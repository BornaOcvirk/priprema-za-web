import express from 'express'
// Zadatak 1: Učitajte polje items iz ./pantry.js (2 boda)

const app = express()

app.use(express.static("../client/"));
// Zadatak 1: Dodajte middleware za parsiranje JSON tijela zahtjeva: app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Testna ruta
app.get("/hello", (req, res) => {
    res.send({ message: "Hello World" });
});

// Zadatak 1: GET /api/items - vratite sve namirnice SORTIRANE po roku trajanja (expires),
// najraniji rok prvi. Ne mijenjajte redoslijed originalnog polja! (2 boda)


// Zadatak 1: PATCH /api/items/:id - postavite novu količinu iz tijela zahtjeva { quantity } (3 boda)
// - 404 ako namirnica ne postoji
// - 400 ako quantity nije cijeli broj ili je manji od 0
// - inače vratite ažuriranu namirnicu


// Zadatak 1: DELETE /api/items/:id - obrišite namirnicu, 404 ako ne postoji (2 boda)


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})
