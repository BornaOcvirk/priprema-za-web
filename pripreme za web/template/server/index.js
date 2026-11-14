import express from 'express'
// Zadatak 1: Učitajte polje events iz ./events.js (2 boda)

const app = express()

app.use(express.static("../client/"));
// Zadatak 1: Dodajte middleware za parsiranje JSON tijela zahtjeva: app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Testna ruta
app.get("/hello", (req, res) => {
    res.send({ message: "Hello World" });    
});

// Zadatak 1: Definirajte rutu za dohvaćanje svih zapisa - GET /api/events (1 bod)


// Zadatak 1: Definirajte rutu za uređivanje postojećeg zapisa - PUT /api/events/:id (3 boda)


// Zadatak 1: Definirajte rutu za brisanje postojećeg zapisa - DELETE /api/events/:id (3 boda)


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})
