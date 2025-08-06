export let demands = [];

export function addDemand(demand: any) {
  demand.id = Date.now();
  demands.push(demand);
}
