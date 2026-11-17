import { randomUUID } from "crypto";

const todos = [
  { id: randomUUID(), description: "Finish writing the project proposal", date: 1733212800000, completed: false },
  { id: randomUUID(), description: "Review and merge pull requests", date: 1733061600000, completed: true },
  { id: randomUUID(), description: "Prepare slides for the seminar", date: 1733304600000, completed: false },
  { id: randomUUID(), description: "Update the department website", date: 1733144400000, completed: false },
  { id: randomUUID(), description: "Debug the robotics navigation module", date: 1733410800000, completed: false },
  { id: randomUUID(), description: "Submit research paper to the journal", date: 1733525940000, completed: false },
  { id: randomUUID(), description: "Organize files and clean up local repositories", date: 1733569200000, completed: false },
  { id: randomUUID(), description: "Test the embedded system prototype", date: 1733241600000, completed: false },
  { id: randomUUID(), description: "Respond to pending emails", date: 1733072400000, completed: true },
  { id: randomUUID(), description: "Plan the curriculum for next semester", date: 1733652000000, completed: false }
];

export { todos };
export default todos;
