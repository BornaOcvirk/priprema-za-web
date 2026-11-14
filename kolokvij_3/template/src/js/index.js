import $ from "jquery";

// Zadatak 3: Pretvorite Unix milisekunde u formatirani datum "M/D/YYYY" (2 boda)
function format_date(timestamp) {
    // TODO: implementirati formatiranje datuma
}

// Zadatak 1: Dohvatite sve zapise putem GET /api/books i vratite jQuery Promise (3 boda)
function get_books(callback) {
    // TODO: implementirati poziv $.get("/api/books")
}

// Zadatak 3: Promijenite status zapisa na serveru (PUT /api/books/:id) i promijenite ikonu u prikazu (4 boda)
function toggle(id) {
    // TODO: implementirati toggle logiku
}

// Zadatak 3: Obrišite zapis na poslužitelju (DELETE /api/books/:id) i uklonite karticu uz fadeOut animaciju (4 boda)
function remove(id) {
    // TODO: implementirati remove logiku
}

// Zadatak 3: Dinamički iscrtajte sve kartice unutar #books-container uz fadeIn efekt (10 bodova)
function render_books(books) {
    // TODO: implementirati render_books
}

// Globalno izlaganje za testove
window.format_date = format_date;
window.get_books = get_books;
window.toggle = toggle;
window.remove = remove;
window.render_books = render_books;

export { format_date, get_books, toggle, remove, render_books };

$(() => {
    // Inicijalno učitavanje podataka i poziv render_books
});
