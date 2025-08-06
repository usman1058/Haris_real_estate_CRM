export let inventory = [
  {
    id: 1,
    type: "House",
    size: "5 Marla",
    location: "Johar Town",
    price: 15000000,
    status: "Available",
    beds: 3,
    floors: 2
  }
];

export function addInventory(item: any) {
  item.id = Date.now();
  inventory.push(item);
}

export function updateInventory(id: number, updated: any) {
  const index = inventory.findIndex(i => i.id === id);
  if (index !== -1) inventory[index] = { ...inventory[index], ...updated };
}
