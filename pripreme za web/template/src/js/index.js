import $ from "jquery";

// Zadatak 3: Pretvorite Unix milisekunde u formatirani datum "M/D/YYYY" (2 boda)
function format_date(timestamp) {
    // TODO: implementirati formatiranje datuma
}

// Zadatak 1: Dohvatite sve zapise putem GET /api/events i vratite jQuery Promise (3 boda)
function get_events(callback) {
    // TODO: implementirati poziv $.get("/api/events")
}

// Zadatak 3: Promijenite status zapisa na serveru (PUT /api/events/:id) i promijenite ikonu u prikazu (4 boda)
function toggle(id) {
    // TODO: implementirati toggle logiku
}

// Zadatak 3: Obrišite zapis na poslužitelju (DELETE /api/events/:id) i uklonite karticu uz fadeOut animaciju (4 boda)
function remove(id) {
    // TODO: implementirati remove logiku
}

// Zadatak 3: Dinamički iscrtajte sve kartice unutar #events-container uz fadeIn efekt (10 bodova)
function render_events(events) {
    // TODO: implementirati render_events
}

// Globalno izlaganje za testove
window.format_date = format_date;
window.get_events = get_events;
window.toggle = toggle;
window.remove = remove;
window.render_events = render_events;

export { format_date, get_events, toggle, remove, render_events };

$(() => {
    // Inicijalno učitavanje podataka i poziv render_events
});
