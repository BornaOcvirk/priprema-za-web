import $ from "jquery";

// Zadatak 3: Pretvorite Unix milisekunde u datum "DD.MM.YYYY." s vodećim nulama, npr. 09.12.2025. (2 boda)
function format_date(timestamp) {
    // TODO: implementirati formatiranje datuma
}

// Zadatak 1: Dohvatite sve zapise putem GET /api/items i vratite jQuery Promise (3 boda)
function get_items(callback) {
    // TODO: implementirati poziv $.get("/api/items")
}

// Zadatak 3: Pošaljite novu količinu (trenutna + delta) na PATCH /api/items/:id
// i nakon odgovora poslužitelja ažurirajte značku i gumb [−] u retku (2 boda)
function change_qty(id, delta) {
    // TODO: implementirati promjenu količine
}

// Zadatak 3: Obrišite zapis na poslužitelju (DELETE /api/items/:id) i uklonite redak uz fadeOut(300) (2 boda)
function remove(id) {
    // TODO: implementirati remove logiku
}

// Zadatak 3: Dinamički iscrtajte retke unutar #items-body uz postupni (staggered) fade-in (5 bodova)
function render_items(items) {
    // TODO: implementirati render_items
}

// Globalno izlaganje za testove
window.format_date = format_date;
window.get_items = get_items;
window.change_qty = change_qty;
window.remove = remove;
window.render_items = render_items;

export { format_date, get_items, change_qty, remove, render_items };

$(() => {
    // Inicijalno učitavanje podataka i poziv render_items
});
