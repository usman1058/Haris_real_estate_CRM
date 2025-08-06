// Temporary in-memory data
export let dealers = [
  {
    id: 1,
    name: "Ali Real Estate",
    phone: "03001234567",
    location: "Johar Town",
  },
  {
    id: 2,
    name: "Zahid Properties",
    phone: "03211234567",
    location: "Wapda Town",
  }
];

// Functions to add/edit/delete
export function addDealer(dealer: any) {
  dealer.id = Date.now();
  dealers.push(dealer);
}

export function updateDealer(id: number, updated: any) {
  const index = dealers.findIndex(d => d.id === id);
  if (index !== -1) dealers[index] = { ...dealers[index], ...updated };
}

export function deleteDealer(id: number) {
  const index = dealers.findIndex(d => d.id === id);
  if (index !== -1) dealers.splice(index, 1);
}
