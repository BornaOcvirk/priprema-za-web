import { randomUUID } from "crypto";

const todos = [
  { id: randomUUID(), title: "Buy groceries",     timestamp: 1764845228329, done: true },
  { id: randomUUID(), title: "Email client",      timestamp: 1764845228329, done: true  },
  { id: randomUUID(), title: "Clean desk",        timestamp: 1764931675258, done: false },
  { id: randomUUID(), title: "Pay bills",         timestamp: 1765104490843, done: false },
  { id: randomUUID(), title: "Read 20 pages",     timestamp: 1765018057945, done: false  },
  { id: randomUUID(), title: "Workout",           timestamp: 1765104490843, done: true },
  { id: randomUUID(), title: "Plan weekly tasks", timestamp: 1764845228329, done: true },
  { id: randomUUID(), title: "Water plants",      timestamp: 1765018057945, done: false  },
  { id: randomUUID(), title: "Review code",       timestamp: 1764931675258, done: false }
];

export { todos };
export default todos;