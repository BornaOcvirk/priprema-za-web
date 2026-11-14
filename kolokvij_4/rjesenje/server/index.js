import express from 'express'
import items from './pantry.js'

const app = express()

app.use(express.static("../client/"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/hello", (req, res) => {
    res.send({ message: "Hello World" });
});

// Zadatak 1: Dohvaćanje svih zapisa, sortirano po roku trajanja (2 boda)
app.get("/api/items", (req, res) => {
    // kopija [...items] da sort ne mijenja originalno polje
    res.json([...items].sort((a, b) => a.expires - b.expires));
});

// Zadatak 1: Promjena količine (3 boda)
app.patch("/api/items/:id", (req, res) => {
    const item = items.find((e) => e.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({ error: "Quantity must be an integer >= 0" });
    }
    item.quantity = quantity;
    return res.json(item);
});

// Zadatak 1: Brisanje zapisa (2 boda)
app.delete("/api/items/:id", (req, res) => {
    const index = items.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: "Item not found" });
    }
    const [removed] = items.splice(index, 1);
    return res.json(removed);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
