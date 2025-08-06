'use client';

import { useState } from 'react';

export default function WhatsAppModal({ onClose, property }: any) {
  const [message, setMessage] = useState(
    `New ${property.type} available in ${property.location}.\nSize: ${property.size}\nBeds: ${property.beds}, Floors: ${property.floors}\nPrice: PKR ${property.price}`
  );

  const handleSend = async () => {
    // Call mock API (just logs for now)
    await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    alert("Sent to admin for approval!");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded shadow w-[90%] max-w-lg">
        <h2 className="text-xl font-bold mb-2">Send WhatsApp Message?</h2>
        <textarea
          className="border p-2 w-full h-32"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSend} className="px-4 py-2 bg-green-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
