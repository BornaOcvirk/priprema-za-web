import $ from "jquery";

function format_date(timestamp) {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}.${d.getFullYear()}.`;
}

function get_items(callback) {
    const request = $.get("/api/items");
    if (typeof callback === "function") {
        request.then(callback);
    }
    return request;
}

// Zajedničko za render_items i change_qty: tekst i boja značke, [−] onemogućen na 0
function set_qty($row, quantity) {
    $row.find(".qty-badge")
        .text(quantity)
        .toggleClass("bg-success", quantity > 0)
        .toggleClass("bg-danger", quantity === 0);
    $row.find(".btn-minus").prop("disabled", quantity === 0);
}

function change_qty(id, delta) {
    const $row = $(`[data-id="${id}"]`);
    const current = Number($row.find(".qty-badge").text());

    return $.ajax({
        url: `/api/items/${id}`,
        method: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({ quantity: current + delta }),
        success: (updated) => set_qty($row, updated.quantity),
        error: (err) => {
            console.error("Greška pri promjeni količine:", err);
        }
    });
}

function remove(id) {
    const $row = $(`[data-id="${id}"]`);
    return $.ajax({
        url: `/api/items/${id}`,
        method: "DELETE",
        success: () => {
            $row.fadeOut(300, function () {
                $(this).remove();
            });
        },
        error: (err) => {
            console.error("Greška pri brisanju zapisa:", err);
        }
    });
}

function render_items(items) {
    const $body = $("#items-body");
    $body.empty();

    items.forEach((item, i) => {
        const $row = $(`
            <tr data-id="${item.id}">
                <td class="fw-semibold">${item.name}</td>
                <td class="d-none d-md-table-cell">${format_date(item.expires)}</td>
                <td><span class="badge rounded-pill qty-badge"></span></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary btn-minus"><i class="bi bi-dash-lg"></i></button>
                        <button class="btn btn-outline-secondary btn-plus"><i class="bi bi-plus-lg"></i></button>
                        <button class="btn btn-outline-danger btn-remove"><i class="bi bi-trash3"></i></button>
                    </div>
                </td>
            </tr>
        `);

        set_qty($row, item.quantity);
        $row.find(".btn-minus").on("click", () => change_qty(item.id, -1));
        $row.find(".btn-plus").on("click", () => change_qty(item.id, 1));
        $row.find(".btn-remove").on("click", () => remove(item.id));

        // Staggered fade-in: svaki redak kreće 100 ms nakon prethodnog
        $row.hide();
        $body.append($row);
        $row.delay(i * 100).fadeIn(400);
    });
}

// Global exposure for evaluation and tests
window.format_date = format_date;
window.get_items = get_items;
window.change_qty = change_qty;
window.remove = remove;
window.render_items = render_items;

export { format_date, get_items, change_qty, remove, render_items };

$(() => {
    get_items().then((items) => {
        render_items(items);
    });
});
