import express from 'express'
import books from './books.js'

const app = express()

app.use(express.static("../client/"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/hello", (req, res) => {
    res.send({ message: "Hello World" });    
});

// Zadatak 1: Dohvaćanje svih zapisa (1 bod)
app.get("/api/books", (req, res) => {
    res.json(books);
});
app.get("/books", (req, res) => {
    res.json(books);
});

// Zadatak 1: Uređivanje postojećeg zapisa (3 boda)
const updateBook = (req, res) => {
    const { id } = req.params;
    const item = books.find((e) => e.id === id);
    if (!item) {
        return res.status(404).json({ error: "Book not found" });
    }
    if (req.body.read !== undefined) {
        item.read = req.body.read;
    }
    if (req.body.title !== undefined) {
        item.title = req.body.title;
    }
    if (req.body.timestamp !== undefined) {
        item.timestamp = req.body.timestamp;
    }
    return res.json(item);
};

app.put("/api/books/:id", updateBook);
app.patch("/api/books/:id", updateBook);
app.put("/books/:id", updateBook);
app.patch("/books/:id", updateBook);

// Zadatak 1: Brisanje postojećeg zapisa (3 boda)
const deleteBook = (req, res) => {
    const { id } = req.params;
    const index = books.findIndex((e) => e.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    const [removed] = books.splice(index, 1);
    return res.json(removed);
};

app.delete("/api/books/:id", deleteBook);
app.delete("/books/:id", deleteBook);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
