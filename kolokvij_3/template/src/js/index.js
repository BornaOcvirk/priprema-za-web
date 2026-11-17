import $ from "jquery";

// Zadatak 3: Pretvorite Unix milisekunde u formatirani datum "M/D/YYYY" (2 boda)
function format_date(timestamp) {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

// Zadatak 1: Dohvatite sve zapise putem GET /api/books i vratite jQuery Promise (3 boda)
function get_books(callback) {
    // TODO: implementirati poziv $.get("/api/books")
    const request = $.get("/api/books");
    if (typeof callback === "function") {
        request.then(callback);
    }
    return request;
}

function toggle(id) {
    const $col = $(`[data-id="${id}"]`);
    const $statusIcon = $col.find(".status-icon");
    const isRead = $statusIcon.hasClass("bi-bookmark-check-fill");
    const newStatus = !isRead;

    return $.ajax({
        url: `/api/books/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ read: newStatus }),
        success: (updated) => {
            if (updated.read) {
                $statusIcon
                    .removeClass("bi-bookmark-x-fill text-danger")
                    .addClass("bi-bookmark-check-fill text-success");
            } else {
                $statusIcon
                    .removeClass("bi-bookmark-check-fill text-success")
                    .addClass("bi-bookmark-x-fill text-danger");
            }
        },
        error: (err) => {
            console.error("Greška pri ažuriranju statusa:", err);
        }
    });
}

function remove(id) {
    const $col = $(`[data-id="${id}"]`);
    return $.ajax({
        url: `/api/books/${id}`,
        method: "DELETE",
        success: () => {
            $col.fadeOut(300, function() {
                $(this).remove();
            });
        },
        error: (err) => {
            console.error("Greška pri brisanju zapisa:", err);
        }
    });
}

// Zadatak 3: Dinamički iscrtajte sve kartice unutar #books-container uz fadeIn efekt (10 bodova)
function render_books(books) {
    const $container = $("#books-container");
    $container.empty();

    books.forEach((item) => {
        const formattedDate = format_date(item.timestamp);
        const iconClass = item.read ?
            "bi-bookmark-check-fill text-success" :
            "bi-bookmark-x-fill text-danger";

        const $col = $(`
            <div class="col" data-id="${item.id}">
                <div class="card rounded-4 border shadow-sm p-3 h-100">
                    <div class="card-body d-flex flex-column justify-content-between p-0">
                        <div>
                            <h5 class="card-title fw-bold mb-2">${item.title}</h5>
                            <p class="card-text mb-1"><span class="fw-bold">Added:</span> ${formattedDate}</p>
                            <p class="card-text mb-3"><span class="fw-bold">Status:</span> <i class="bi ${iconClass} status-icon"></i></p>
                        </div>
                        <div class="d-flex gap-2 mt-auto">
                            <button class="btn btn-outline-secondary rounded-pill flex-fill btn-toggle">Toggle</button>
                            <button class="btn btn-outline-secondary rounded-pill flex-fill btn-remove">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        $col.find(".btn-toggle").on("click", () => toggle(item.id));
        $col.find(".btn-remove").on("click", () => remove(item.id));

        $col.hide();
        $container.append($col);
        $col.fadeIn(500);
    });
}


// Globalno izlaganje za testove
window.format_date = format_date;
window.get_books = get_books;
window.toggle = toggle;
window.remove = remove;
window.render_books = render_books;

export { format_date, get_books, toggle, remove, render_books };

$(() => {
    get_books().then((books) => {
        render_books(books);
    });
});