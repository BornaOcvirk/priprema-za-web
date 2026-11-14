// Zadatak 1:
// 1. Uvezite randomUUID iz ugrađenog modula "crypto" (2 boda)
// 2. Svakom objektu u polju events dodajte atribut "id" s generiranim randomUUID() (2 boda)
// 3. Izvezite polje events kao imenovani i zadani izvoz (export { events }; export default events;)

const events = [
  { title: "Web Dev Workshop", timestamp: 1765018057945, confirmed: true },
  { title: "Design Sprint", timestamp: 1764845228329, confirmed: true },
  { title: "Cybersecurity Meetup", timestamp: 1764931675258, confirmed: false },
  { title: "Frontend Hackathon", timestamp: 1765104490843, confirmed: true },
  { title: "Cloud Computing Summit", timestamp: 1765190900000, confirmed: false },
  { title: "AI & Data Science Panel", timestamp: 1765277300000, confirmed: true },
  { title: "Open Source Day", timestamp: 1764845228329, confirmed: false },
  { title: "Database Optimization", timestamp: 1765018057945, confirmed: false },
  { title: "Career & Networking Night", timestamp: 1764931675258, confirmed: true }
];
