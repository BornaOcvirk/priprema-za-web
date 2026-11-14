import { randomUUID } from "crypto";

const items = [
  { id: randomUUID(), name: "Mlijeko", expires: 1766055600000, quantity: 2 },
  { id: randomUUID(), name: "Tjestenina", expires: 1767610800000, quantity: 4 },
  { id: randomUUID(), name: "Jogurt", expires: 1765278000000, quantity: 0 },
  { id: randomUUID(), name: "Riža", expires: 1774004400000, quantity: 1 },
  { id: randomUUID(), name: "Jaja", expires: 1765710000000, quantity: 10 },
  { id: randomUUID(), name: "Maslac", expires: 1770807600000, quantity: 1 },
  { id: randomUUID(), name: "Konzerva tune", expires: 1782813600000, quantity: 3 },
  { id: randomUUID(), name: "Sir", expires: 1766401200000, quantity: 0 },
  { id: randomUUID(), name: "Pelati", expires: 1769598000000, quantity: 2 }
];

export { items };
export default items;
