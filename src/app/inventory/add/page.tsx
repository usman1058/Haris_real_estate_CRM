'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addInventory } from '../../../lib/inventory';
import WhatsAppModal from '@/components/WhatsAppModal';

export default function AddInventoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({ type: '', size: '', location: '', price: '', beds: '', floors: '' });
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addInventory({ ...form, price: parseInt(form.price), beds: parseInt(form.beds), floors: parseInt(form.floors), status: "Available" });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border w-full p-2 rounded" placeholder="Type (e.g., House)" onChange={(e) => setForm({ ...form, type: e.target.value })} />
        <input className="border w-full p-2 rounded" placeholder="Size (e.g., 5 Marla)" onChange={(e) => setForm({ ...form, size: e.target.value })} />
        <input className="border w-full p-2 rounded" placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="border w-full p-2 rounded" placeholder="Price" type="number" onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="border w-full p-2 rounded" placeholder="Beds" type="number" onChange={(e) => setForm({ ...form, beds: e.target.value })} />
        <input className="border w-full p-2 rounded" placeholder="Floors" type="number" onChange={(e) => setForm({ ...form, floors: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save & Ask WhatsApp</button>
      </form>

      {showModal && <WhatsAppModal onClose={() => router.push('/inventory')} property={form} />}
    </div>
  );
}
