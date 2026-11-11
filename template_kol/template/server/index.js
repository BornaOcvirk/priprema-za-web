import express from 'express'
import todos from './todos.js'

const app = express()

app.use(express.static("../client/"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/hello", (req, res) => {
    res.send({ message: "Hello World" });    
});

app.get("/api/hello", (req, res) => {
    res.send({ message: "Hello World 2" });    
});

// Dohvaćanje svih zapisa
app.get("/api/todos", (req, res) => {
    res.json(todos);
});
app.get("/todos", (req, res) => {
    res.json(todos);
});

// Uređivanje postojećeg zapisa
const updateTodo = (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    if (req.body.done !== undefined) {
        todo.done = req.body.done;
    }
    if (req.body.title !== undefined) {
        todo.title = req.body.title;
    }
    if (req.body.timestamp !== undefined) {
        todo.timestamp = req.body.timestamp;
    }
    return res.json(todo);
};

app.put("/api/todos/:id", updateTodo);
app.patch("/api/todos/:id", updateTodo);
app.put("/todos/:id", updateTodo);
app.patch("/todos/:id", updateTodo);

// Brisanje postojećeg zapisa
const deleteTodo = (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Todo not found" });
    }
    const [removed] = todos.splice(index, 1);
    return res.json(removed);
};

app.delete("/api/todos/:id", deleteTodo);
app.delete("/todos/:id", deleteTodo);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
