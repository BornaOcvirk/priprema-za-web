import { randomUUID } from "crypto";

const events = [
  { id: randomUUID(), title: "Web Dev Workshop", timestamp: 1765018057945, confirmed: true },
  { id: randomUUID(), title: "Design Sprint", timestamp: 1764845228329, confirmed: true },
  { id: randomUUID(), title: "Cybersecurity Meetup", timestamp: 1764931675258, confirmed: false },
  { id: randomUUID(), title: "Frontend Hackathon", timestamp: 1765104490843, confirmed: true },
  { id: randomUUID(), title: "Cloud Computing Summit", timestamp: 1765190900000, confirmed: false },
  { id: randomUUID(), title: "AI & Data Science Panel", timestamp: 1765277300000, confirmed: true },
  { id: randomUUID(), title: "Open Source Day", timestamp: 1764845228329, confirmed: false },
  { id: randomUUID(), title: "Database Optimization", timestamp: 1765018057945, confirmed: false },
  { id: randomUUID(), title: "Career & Networking Night", timestamp: 1764931675258, confirmed: true }
];

export { events };
export default events;
