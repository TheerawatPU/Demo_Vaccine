import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const LINE_ACCESS_TOKEN = Deno.env.get("LINE_ACCESS_TOKEN") ?? "";;
const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? "";;
const SUPABASE_SERVICE_KEY = Deno.env.get("VITE_SUPABASE_ANON_KEY") ?? "";; 

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function replyMessage(replyToken: string, messages: any[]) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`
    },
    body: JSON.stringify({ replyToken, messages })
  });
}

serve(async (req) => {
  const body = await req.json();
  const event = body.events?.[0];

  if (event?.type === 'message' && event.message.type === 'text') {
    const userId = event.source.userId;
    const text = event.message.text.replace(/\s+/g, ''); // ลบช่องว่างออก

    // ตรวจสอบว่าเป็นเลขบัตรประชาชน 13 หลัก
    if (/^\d{13}$/.test(text)) {
      
      // 1. อัปเดต line_id ให้กับทุกแถวที่มี national_id ตรงกัน
      const { data, error } = await supabase
        .from('appointments')
        .update({ line_id: userId })
        .eq('national_id', text)
        .select(`*, vaccines(short_name)`);

      if (error) {
        await replyMessage(event.replyToken, [{ type: "text", text: "❌ เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" }]);
      } else if (data && data.length > 0) {
        
        // 2. ค้นหานัดหมายที่ "กำลังจะมาถึง" (สถานะ Pending และวันที่ยังไม่ผ่านไปนาน)
        const upcoming = data
          .filter(a => a.status === 'Pending')
          .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0];

        const childName = data[0].child_name;
        let responseMessages = [];

        responseMessages.push({ 
          type: "text", 
          text: `✅ ลงทะเบียนสำเร็จ!\nระบบได้เชื่อมต่อข้อมูลของ "${childName}" เรียบร้อยแล้วค่ะ` 
        });

        if (upcoming) {
          const dateThai = new Date(upcoming.appointment_date).toLocaleDateString('th-TH', { 
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
          });
          
          responseMessages.push({
            type: "text",
            text: `🗓️ รายการนัดหมายของคุณ:\n💉 วัคซีน: ${upcoming.vaccines?.short_name || 'ไม่ได้ระบุ'}\n📅 วันที่: ${dateThai}\n⏰ เวลา: ${upcoming.appointment_time.substring(0, 5)} น.\n\nกรุณามาถึงก่อนเวลานัด 15 นาทีนะคะ 😊`
          });
        } else {
          responseMessages.push({ 
            type: "text", 
            text: "ขณะนี้คุณยังไม่มีนัดหมายใหม่ในระบบค่ะ หากมีการนัดหมายเพิ่ม ระบบจะแจ้งให้คุณทราบทันที" 
          });
        }

        await replyMessage(event.replyToken, responseMessages);
      } else {
        // กรณีแอดมินยังไม่ได้ลงข้อมูลในระบบ
        await replyMessage(event.replyToken, [{ 
          type: "text", 
          text: `⚠️ ไม่พบข้อมูลเลขบัตรฯ "${text}" ในระบบนัดหมาย\n\nกรุณาตรวจสอบเลขอีกครั้ง หรือติดต่อเจ้าหน้าที่ที่เคาน์เตอร์เพื่อลงทะเบียนนัดหมายก่อนนะคะ` 
        }]);
      }
    } else {
      // กรณีพิมพ์อย่างอื่นมา
      await replyMessage(event.replyToken, [{ 
        type: "text", 
        text: "สวัสดีค่ะ 🏥 กรุณาพิมพ์ **เลขบัตรประชาชน 13 หลัก** ของน้องเพื่อตรวจสอบรายการนัดหมายฉีดวัคซีนค่ะ" 
      }]);
    }
  }
  return new Response("OK", { status: 200 });
});