import React from "react";

const pastelColors = [
  "#FFD6E0",
  "#FFE5B4",
  "#FFF3B0",
  "#D4F8E8",
  "#CDE7FF",
  "#E4D1FF",
  "#FADADD",
  "#E2F0CB",
  "#F6D8AE",
  "#C1F0F6",
];

function AppointmentModal({
  open,
  setOpen,
  form,
  setForm,
  onSave,
  onDelete,
  selectedDate,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[420px] bg-white rounded-2xl shadow-xl p-6 animate-[fadeIn_.25s]">
        <h2 className="text-lg font-semibold text-gray-700 mb-1">
          New Appointment
        </h2>

        <p className="text-xs text-gray-400 mb-4">{selectedDate}</p>

        {/* CHILD */}
        <input
          placeholder="👶 Child Name"
          value={form.child}
          onChange={(e) => setForm({ ...form, child: e.target.value })}
          className="w-full border rounded-lg p-2 text-sm mb-2 focus:ring-2 focus:ring-blue-200 outline-none"
        />

        {/* VACCINE */}
        <input
          placeholder="💉 Vaccine"
          value={form.vaccine}
          onChange={(e) => setForm({ ...form, vaccine: e.target.value })}
          className="w-full border rounded-lg p-2 text-sm mb-2 focus:ring-2 focus:ring-blue-200 outline-none"
        />

        {/* LOCATION */}
        <input
          placeholder="🏥 Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border rounded-lg p-2 text-sm mb-2"
        />

        {/* DOCTOR */}
        <input
          placeholder="👩‍⚕️ Doctor"
          value={form.doctor}
          onChange={(e) => setForm({ ...form, doctor: e.target.value })}
          className="w-full border rounded-lg p-2 text-sm mb-2"
        />

        {/* TIME */}
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="w-full border rounded-lg p-2 text-sm mb-2"
        />

        {/* NOTE */}
        <textarea
          placeholder="📝 Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full border rounded-lg p-2 text-sm mb-3"
        />

        {/* COLOR */}
        <div className="flex flex-wrap mb-4">
          {pastelColors.map((c, i) => (
            <div
              key={i}
              onClick={() => setForm({ ...form, color: c })}
              className="w-7 h-7 rounded-full mr-2 mb-2 cursor-pointer border-2"
              style={{
                background: c,
                borderColor: form.color === c ? "#2563eb" : "#fff",
              }}
            />
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-end space-x-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-100 text-red-500 rounded-lg"
            >
              Delete
            </button>
          )}

          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 text-sm bg-gray-100 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-1 text-sm bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentModal;
