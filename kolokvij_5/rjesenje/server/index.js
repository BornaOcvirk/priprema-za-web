import express from 'express'
import todos from './todos.js'

const app = express()
app.use(express.json());

app.get("/api/todos", (req, res) => {
    res.json(todos);
});

// Modal šalje cijeli zapis (opis, datum, status), pa PUT zamjenjuje sva tri polja
app.put("/api/todos/:id", (req, res) => {
    const todo = todos.find((t) => t.id === req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    const { description, date, completed } = req.body;
    if (typeof description !== "string" || !description.trim()
        || !Number.isFinite(date) || typeof completed !== "boolean") {
        return res.status(400).json({ error: "description (string), date (ms) and completed (boolean) are required" });
    }

    Object.assign(todo, { description: description.trim(), date, completed });
    res.json(todo);
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
