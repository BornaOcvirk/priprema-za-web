import express from 'express'
import events from './events.js'

const app = express()

app.use(express.static("../client/"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/hello", (req, res) => {
    res.send({ message: "Hello World" });    
});

// Zadatak 1: Dohvaćanje svih zapisa (1 bod)
app.get("/api/events", (req, res) => {
    res.json(events);
});
app.get("/events", (req, res) => {
    res.json(events);
});

// Zadatak 1: Uređivanje postojećeg zapisa (3 boda)
const updateEvent = (req, res) => {
    const { id } = req.params;
    const item = events.find((e) => e.id === id);
    if (!item) {
        return res.status(404).json({ error: "Event not found" });
    }
    if (req.body.confirmed !== undefined) {
        item.confirmed = req.body.confirmed;
    }
    if (req.body.title !== undefined) {
        item.title = req.body.title;
    }
    if (req.body.timestamp !== undefined) {
        item.timestamp = req.body.timestamp;
    }
    return res.json(item);
};

app.put("/api/events/:id", updateEvent);
app.patch("/api/events/:id", updateEvent);
app.put("/events/:id", updateEvent);
app.patch("/events/:id", updateEvent);

// Zadatak 1: Brisanje postojećeg zapisa (3 boda)
const deleteEvent = (req, res) => {
    const { id } = req.params;
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Event not found" });
    }
    const [removed] = events.splice(index, 1);
    return res.json(removed);
};

app.delete("/api/events/:id", deleteEvent);
app.delete("/events/:id", deleteEvent);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
