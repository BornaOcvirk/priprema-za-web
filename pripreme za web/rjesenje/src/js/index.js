import $ from "jquery";

function format_date(timestamp) {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function get_events(callback) {
    const request = $.get("/api/events");
    if (typeof callback === "function") {
        request.then(callback);
    }
    return request;
}

function toggle(id) {
    const $col = $(`[data-id="${id}"]`);
    const $statusIcon = $col.find(".status-icon");
    const isConfirmed = $statusIcon.hasClass("bi-calendar-check-fill");
    const newStatus = !isConfirmed;

    return $.ajax({
        url: `/api/events/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ confirmed: newStatus }),
        success: (updated) => {
            if (updated.confirmed) {
                $statusIcon
                    .removeClass("bi-calendar-x-fill text-danger")
                    .addClass("bi-calendar-check-fill text-success");
            } else {
                $statusIcon
                    .removeClass("bi-calendar-check-fill text-success")
                    .addClass("bi-calendar-x-fill text-danger");
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
        url: `/api/events/${id}`,
        method: "DELETE",
        success: () => {
            $col.fadeOut(300, function () {
                $(this).remove();
            });
        },
        error: (err) => {
            console.error("Greška pri brisanju zapisa:", err);
        }
    });
}

function render_events(events) {
    const $container = $("#events-container");
    $container.empty();

    events.forEach((item) => {
        const formattedDate = format_date(item.timestamp);
        const iconClass = item.confirmed
            ? "bi-calendar-check-fill text-success"
            : "bi-calendar-x-fill text-danger";

        const $col = $(`
            <div class="col" data-id="${item.id}">
                <div class="card rounded-4 border shadow-sm p-3 h-100">
                    <div class="card-body d-flex flex-column justify-content-between p-0">
                        <div>
                            <h5 class="card-title fw-bold mb-2">${item.title}</h5>
                            <p class="card-text mb-1"><span class="fw-bold">When:</span> ${formattedDate}</p>
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

// Global exposure for evaluation and tests
window.format_date = format_date;
window.get_events = get_events;
window.toggle = toggle;
window.remove = remove;
window.render_events = render_events;

export { format_date, get_events, toggle, remove, render_events };

$(() => {
    get_events().then((events) => {
        render_events(events);
    });
});
