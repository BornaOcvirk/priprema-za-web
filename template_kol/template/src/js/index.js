import $ from "jquery";

function format_date(timestamp) {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function get_todos(callback) {
    const request = $.get("/api/todos");
    if (typeof callback === "function") {
        request.then(callback);
    }
    return request;
}

function toggle(id) {
    const $col = $(`[data-id="${id}"]`);
    const $statusIcon = $col.find(".status-icon");
    const isDone = $statusIcon.hasClass("bi-check-circle-fill");
    const newStatus = !isDone;

    return $.ajax({
        url: `/api/todos/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ done: newStatus }),
        success: (updated) => {
            if (updated.done) {
                $statusIcon
                    .removeClass("bi-x-circle-fill text-danger")
                    .addClass("bi-check-circle-fill text-success");
            } else {
                $statusIcon
                    .removeClass("bi-check-circle-fill text-success")
                    .addClass("bi-x-circle-fill text-danger");
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
        url: `/api/todos/${id}`,
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

function render_todos(todos) {
    const $container = $("#todos-container");
    $container.empty();

    todos.forEach((todo) => {
        const formattedDate = format_date(todo.timestamp);
        const iconClass = todo.done
            ? "bi-check-circle-fill text-success"
            : "bi-x-circle-fill text-danger";

        const $col = $(`
            <div class="col" data-id="${todo.id}">
                <div class="card rounded-4 border shadow-sm p-3 h-100">
                    <div class="card-body d-flex flex-column justify-content-between p-0">
                        <div>
                            <h5 class="card-title fw-bold mb-2">${todo.title}</h5>
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

        $col.find(".btn-toggle").on("click", () => toggle(todo.id));
        $col.find(".btn-remove").on("click", () => remove(todo.id));

        $col.hide();
        $container.append($col);
        $col.fadeIn(500);
    });
}

// Global exposure for evaluation and tests
window.format_date = format_date;
window.get_todos = get_todos;
window.toggle = toggle;
window.remove = remove;
window.render_todos = render_todos;

export { format_date, get_todos, toggle, remove, render_todos };

$(() => {
    get_todos().then((todos) => {
        render_todos(todos);
    });
});