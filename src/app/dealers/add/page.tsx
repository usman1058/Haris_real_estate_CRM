'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDealer } from '../../../lib/dealers';

export default function AddDealerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', location: '' });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addDealer(form);
    router.push('/dealers');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Dealer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border w-full p-2 rounded" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border w-full p-2 rounded" placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="border w-full p-2 rounded" placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Dealer</button>
      </form>
    </div>
  );
}
