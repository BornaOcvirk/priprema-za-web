import express from 'express'
// Zadatak 1: Učitajte polje books iz ./books.js (2 boda)
import books from './books.js'
const app = express()

app.use(express.static("../client/"));
// Zadatak 1: Dodajte middleware za parsiranje JSON tijela zahtjeva: app.use(express.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Testna ruta
app.get("/hello", (req, res) => {
    res.send({ message: "Hello World" });
});

// Zadatak 1: Definirajte rutu za dohvaćanje svih zapisa - GET /api/books (1 bod)

app.get("/api/books", (req, res) => {
    res.json(books);
});
app.get("/books", (req, res) => {
    res.json(books);
});

// Zadatak 1: Definirajte rutu za uređivanje postojećeg zapisa - PUT /api/books/:id (3 boda)
const updateBook = (req, res) => {
    const { id } = req.params;
    const item = books.find((book) => book.id === id);
    if (!item) {
        return res.status(404).json({ message: "Book not found" });
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

// Zadatak 1: Definirajte rutu za brisanje postojećeg zapisa - DELETE /api/books/:id (3 boda)
const deleteBook = (req, res) => {
    const { id } = req.params;
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    const [removed] = books.splice(index, 1);
    return res.json(removed)
}

app.delete("/api/books/:id", deleteBook);
app.delete("/books/:id", deleteBook);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})