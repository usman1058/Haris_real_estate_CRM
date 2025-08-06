'use client';

import { useSearchParams } from 'next/navigation';
import { inventory } from '../../lib/inventory';
import { useState } from 'react';

export default function MatchesPage() {
  const params = useSearchParams();
  const budget = parseInt(params.get('budget') || '0');
  const size = params.get('size');
  const location = params.get('location');

  const matches = inventory.filter((item) =>
    item.size === size &&
    item.location.toLowerCase() === location?.toLowerCase() &&
    item.price >= budget * 0.9 && item.price <= budget * 1.1
  );

  const [selected, setSelected] = useState<number[]>([]);

  const handleSend = async () => {
    const matched = inventory.filter(i => selected.includes(i.id));
    const message = matched.map(i =>
      `🏠 ${i.type} - ${i.size} in ${i.location}\nPKR ${i.price.toLocaleString()}`
    ).join('\n\n');

    await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });

    alert("Message sent to admin for approval.");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Matching Properties</h1>
      {matches.length === 0 && <p>No matches found for given criteria.</p>}
      <div className="space-y-4">
        {matches.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow bg-white">
            <input type="checkbox" className="mr-2"
              checked={selected.includes(item.id)}
              onChange={() =>
                setSelected((prev) =>
                  prev.includes(item.id)
                    ? prev.filter(id => id !== item.id)
                    : [...prev, item.id]
                )
              }
            />
            <strong>{item.type}</strong> - {item.size}, {item.location} <br />
            💰 {item.price.toLocaleString()} PKR
          </div>
        ))}
      </div>
      {matches.length > 0 && (
        <button onClick={handleSend} className="mt-6 bg-green-600 text-white px-4 py-2 rounded">
          Send via WhatsApp
        </button>
      )}
    </div>
  );
}
