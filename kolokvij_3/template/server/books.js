// Zadatak 1:
// 1. Uvezite randomUUID iz ugrađenog modula "crypto" (2 boda)
// 2. Svakom objektu u polju books dodajte atribut "id" s generiranim randomUUID() (2 boda)
// 3. Izvezite polje books kao imenovani i zadani izvoz (export { books }; export default books;)

const books = [
  { title: "Clean Code", timestamp: 1765018057945, read: true },
  { title: "The Pragmatic Programmer", timestamp: 1764845228329, read: true },
  { title: "Eloquent JavaScript", timestamp: 1764931675258, read: false },
  { title: "Refactoring", timestamp: 1765104490843, read: true },
  { title: "Design Patterns", timestamp: 1765190900000, read: false },
  { title: "Head First HTML and CSS", timestamp: 1765277300000, read: true },
  { title: "JavaScript: The Good Parts", timestamp: 1764845228329, read: false },
  { title: "Learning Web Design", timestamp: 1765018057945, read: false },
  { title: "The Mythical Man-Month", timestamp: 1764931675258, read: true }
];
