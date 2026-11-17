import $ from "jquery";
import { Modal } from "bootstrap";

// "12/3/24, 9:00 AM"
function format_date(timestamp) {
    return new Date(timestamp).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" });
}

// <input type="datetime-local"> traži "YYYY-MM-DDTHH:mm" u lokalnom vremenu, a toISOString daje UTC,
// pa se prvo oduzme pomak vremenske zone
function to_input_value(timestamp) {
    const offset = new Date(timestamp).getTimezoneOffset() * 60000;
    return new Date(timestamp - offset).toISOString().slice(0, 16);
}

function status_icon(completed) {
    return completed
        ? '<i class="bi bi-check-circle-fill text-success"></i>'
        : '<i class="bi bi-x-circle-fill text-danger"></i>';
}

function get_todos() {
    return $.get("/api/todos");
}

function render_row(todo) {
    const $row = $(`
        <tr data-id="${todo.id}">
            <td class="todo-description"></td>
            <td>${format_date(todo.date)}</td>
            <td class="text-center">${status_icon(todo.completed)}</td>
            <td class="text-center">
                <button class="btn btn-sm text-secondary" aria-label="Modify"><i class="bi bi-pencil-square"></i></button>
            </td>
        </tr>
    `);
    $row.find(".todo-description").text(todo.description); // .text() da korisnički unos ne postane HTML
    $row.find("button").on("click", () => open_modal(todo));
    return $row;
}

function render_todos(todos) {
    $("#todos-body").empty().append(todos.map(render_row));
}

let editing_id = null;

function open_modal(todo) {
    editing_id = todo.id;
    $("#edit-description").val(todo.description);
    $("#edit-date").val(to_input_value(todo.date));
    $("#edit-completed").prop("checked", todo.completed);
    Modal.getOrCreateInstance("#edit-modal").show();
}

function save(event) {
    event.preventDefault();
    return $.ajax({
        url: `/api/todos/${editing_id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            description: $("#edit-description").val(),
            date: new Date($("#edit-date").val()).getTime(),
            completed: $("#edit-completed").is(":checked")
        }),
        success: (updated) => {
            $(`[data-id="${updated.id}"]`).replaceWith(render_row(updated));
            Modal.getInstance("#edit-modal").hide();
        },
        error: (err) => console.error("Greška pri spremanju:", err)
    });
}

window.format_date = format_date;
window.get_todos = get_todos;
window.render_todos = render_todos;

export { format_date, get_todos, render_todos };

$(() => {
    $("#edit-form").on("submit", save);
    get_todos().then(render_todos);
});
