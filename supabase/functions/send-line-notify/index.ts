import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// ⚠️ เอา Channel Access Token (รหัสยาวๆ) ที่ก๊อปมา มาวางในเครื่องหมายคำพูดด้านล่างนี้
const LINE_ACCESS_TOKEN = "ldtWyFa6UK2eypv3ntyv3WJWpCaLBxbY2xETUrv8xrvs2ybTaRHeMtHjsUMh6xZx0K+gEFyMeeTXZCd6YhYs9CZAOBfwoSIBD/2sr4F11nGpD09E1bnepg3vF6ER5+tdn/4meV4l8Kojpa89kHQP1gdB04t89/1O/w1cDnyilFU=";

serve(async (req) => {
  // อนุญาตให้หน้าเว็บ React ของเราเรียกใช้งานได้ (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    // รับข้อมูล รหัสลูกค้า (userId) และ ข้อความ (message) จาก React
    const { userId, message } = await req.json()

    // จัดเตรียมข้อมูลส่งหา LINE
    const payload = {
      to: userId, // รหัส U... ของผู้ปกครอง
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    };

    // ยิงคำสั่งไปที่ LINE API
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
})