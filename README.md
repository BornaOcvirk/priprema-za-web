# Priprema za kolokvij: Web programiranje

Objašnjenja rješenja za tri probna kolokvija i upute za pokretanje. Za svaki zadatak piše **što se traži**, **kako izgleda rješenje** i **zašto je rješenje baš takvo**.

> Kliknite na bilo koji **▶ Zadatak** da otvorite objašnjenje.

## Sadržaj

- [Pokretanje](#pokretanje)
- [Probni kolokvij 1: TaskProgress](#probni-kolokvij-1-taskprogress)
- [Probni kolokvij 2: EventPulse](#probni-kolokvij-2-eventpulse)
- [Probni kolokvij 3: ReadingList](#probni-kolokvij-3-readinglist)

## Pokretanje

Svaka aplikacija ima poslužitelj (Express, port 3000) i klijent (Vite, port 8080), pa su potrebna **dva terminala**:

| Kolokvij | Mapa projekta |
|---|---|
| 1: TaskProgress | `template_kol/template` |
| 2: EventPulse | `pripreme za web/rjesenje` |
| 3: ReadingList | `kolokvij_3/rjesenje` |

```bash
# Terminal 1: poslužitelj (port 3000)
cd "<mapa projekta>/server"
npm install
npm run nodemon        # ili: node index.js

# Terminal 2: klijent (port 8080)
cd "<mapa projekta>"
npm install
npm run vite
```

Otvorite http://localhost:8080. Vite prosljeđuje zahtjeve na `/api` prema poslužitelju na portu 3000, pa oba terminala moraju biti pokrenuta. Podaci su samo u memoriji: restart poslužitelja vraća početno stanje.

Za vježbu umjesto `rjesenje` pokrenite `template` (kolokvij 2 i 3) i riješite TODO komentare.

---

## Probni kolokvij 1: TaskProgress

Aplikacija za popis zadataka (todo). Svaki zapis ima naslov, datum (`timestamp`) i status `done` (gotovo ili nije). Kartica prikazuje te podatke i dva gumba: **Toggle** mijenja status, **Remove** briše zapis.

<details>
<summary><b>Zadatak 1 (21 bod): boje, font, navigacija, poslužitelj i <code>get_todos</code></b></summary>

### 1a. Bootstrap boje i font (1 + 2 boda)

**Što se traži:** promijeniti Bootstrapove boje `success`, `warning` i `danger` u `#3cb47c`, `#ffea63` i `#fe604e` te postaviti font Fraunces na cijelu stranicu.

**Rješenje** (`src/scss/style.scss`):

```scss
$primary: #26a69a;
$light: #f8f9fa;
$dark: #212529;
$success: #3cb47c;
$warning: #ffea63;
$danger: #fe604e;

@import "bootstrap/scss/bootstrap";

@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css");

body {
  font-family: "Fraunces", serif;
  font-optical-sizing: auto;
  font-style: normal;
}
```

**Zašto je ovako:**
- Bootstrap svoje boje drži u Sass varijablama označenima s `!default`. To znači: "uzmi ovu vrijednost samo ako varijabla još ne postoji". Zato naše varijable moraju biti **iznad** `@import "bootstrap/scss/bootstrap"`. Kad Bootstrap dođe na red, `$success` već postoji i Bootstrap ga ne prepisuje.
- Da su varijable ispod importa, Bootstrap bi već izgenerirao sve klase sa svojim bojama i promjena ne bi imala učinka. To je najčešća greška u ovom zadatku.
- Jedna varijabla mijenja sve klase koje je koriste: `text-success`, `bg-success`, `btn-success` i ostale. Zato su kasnije i ikone statusa automatski u našoj zelenoj i crvenoj.
- `@import url(...)` s Google Fonts samo **učitava** font. Stranica ga počinje koristiti tek kad ga postavimo na `body` s `font-family`, a svi elementi unutar `body` ga nasljeđuju. `serif` je rezervni font ako se Fraunces ne učita.
- Bootstrap Icons su također font, pa se uvoze ovdje. Bez tog importa `<i class="bi bi-stack">` ostaje prazan.
- Ova datoteka se uopće primjenjuje jer je `src/js/main.js` uvozi (`import "../scss/style.scss"`), a Vite je pri tome prevodi iz SCSS-a u CSS.

### 1b. Navigacijska traka (4 boda)

**Što se traži:** navigacijska traka napravljena isključivo Bootstrap klasama, sa sjenom ispod, ikonom `stack` i naslovom aplikacije.

**Rješenje** (`src/index.html`):

```html
<nav class="navbar bg-success shadow mb-4">
    <div class="container">
        <a class="navbar-brand text-white d-flex align-items-center" href="#">
            <i class="bi bi-stack text-warning me-2 fs-5"></i>
            <span>TaskProgress</span>
        </a>
    </div>
</nav>
```

**Zašto je ovako:**
- `navbar` je Bootstrapova komponenta trake: daje unutarnji razmak i flex raspored.
- `bg-success` boja pozadine (naša `$success` zelena), `shadow` sjena koju zadatak spominje, `mb-4` razmak između trake i kartica.
- `container` unutar trake poravnava naslov s `<main class="container">` ispod, pa naslov stoji u istoj liniji kao kartice.
- `navbar-brand` je klasa za naziv aplikacije (veći font, bez podcrtavanja). `text-white` jer bi zadana tamna boja teksta bila teško čitljiva na zelenoj pozadini.
- `d-flex align-items-center` stavlja ikonu i tekst u red i centrira ih okomito.
- Ikona: `bi` je osnovna klasa svih Bootstrap ikona, `bi-stack` bira ikonu, `text-warning` je boji u žuto, `me-2` daje razmak do teksta, a `fs-5` određuje veličinu.
- Zadatak kaže "isključivo Bootstrap klase", zato nema vlastitog CSS-a za traku.

### 1c. UUID za svaki zapis (2 boda)

**Što se traži:** svakom zapisu u `server/todos.js` dodati jedinstveni identifikator.

**Rješenje** (`server/todos.js`):

```js
import { randomUUID } from "crypto";

const todos = [
  { id: randomUUID(), title: "Buy groceries", timestamp: 1764845228329, done: true },
  { id: randomUUID(), title: "Email client",  timestamp: 1764845228329, done: true },
  // ... isto za svaki zapis
];

export { todos };
export default todos;
```

**Zašto je ovako:**
- Kad klijent kaže "promijeni ovaj zapis" ili "obriši ovaj zapis", poslužitelj mora točno znati koji. Naslov nije siguran ključ jer se može ponoviti. Pozicija u polju nije sigurna jer se pomakne čim se nešto obriše. UUID je jedinstven za svaki zapis.
- `randomUUID` dolazi iz Nodeovog ugrađenog modula `crypto`, pa ne treba instalirati nikakav paket.
- `randomUUID()` se izvršava pri pokretanju poslužitelja. Zato svaki restart daje nove id-eve.
- Dva izvoza: `export default todos` omogućuje `import todos from './todos.js'`, a `export { todos }` omogućuje `import { todos } from './todos.js'`. Oba načina rade.
- `import`/`export` sintaksa radi jer `server/package.json` ima `"type": "module"`.

### 1d. Uvoz podataka i rute (2 + 1 + 3 + 3 boda)

**Što se traži:** uvesti polje u `server/index.js` i napraviti rute za dohvat svih zapisa, uređivanje postojećeg i brisanje postojećeg.

**Rješenje** (`server/index.js`):

```js
import express from 'express'
import todos from './todos.js'

const app = express()
app.use(express.json());

// Dohvaćanje svih zapisa
app.get("/api/todos", (req, res) => {
    res.json(todos);
});

// Uređivanje postojećeg zapisa
const updateTodo = (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    if (req.body.done !== undefined) {
        todo.done = req.body.done;
    }
    if (req.body.title !== undefined) {
        todo.title = req.body.title;
    }
    if (req.body.timestamp !== undefined) {
        todo.timestamp = req.body.timestamp;
    }
    return res.json(todo);
};
app.put("/api/todos/:id", updateTodo);
app.patch("/api/todos/:id", updateTodo);

// Brisanje postojećeg zapisa
const deleteTodo = (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Todo not found" });
    }
    const [removed] = todos.splice(index, 1);
    return res.json(removed);
};
app.delete("/api/todos/:id", deleteTodo);
```

**Zašto je ovako:**
- `import todos from './todos.js'`: u Node ES modulima ekstenzija `.js` je obavezna.
- `app.use(express.json())`: klijent šalje novi status kao JSON tekst. Ovaj middleware ga pretvara u objekt `req.body`. Bez njega je `req.body` prazan i PUT ruta ne može pročitati novi status.
- **GET** `res.json(todos)` šalje cijelo polje kao JSON.
- **PUT** `:id` u putanji je parametar koji Express sprema u `req.params.id`.
  - `find` vraća **referencu** na objekt koji je u polju. Kad promijenimo `todo.done`, mijenja se sam zapis u polju, pa idući GET vraća novu vrijednost.
  - Provjera je `!== undefined`, a ne `if (req.body.done)`. `false` je ispravna nova vrijednost, a `if (false)` bi preskočio postavljanje i zapis se nikad ne bi mogao vratiti na "nije gotovo".
  - Ako zapis ne postoji, ruta vraća `404`. Inače vraća ažurirani zapis, koji klijent koristi da promijeni ikonu.
- **DELETE** `findIndex` daje poziciju zapisa, a `splice(index, 1)` uklanja točno jedan element iz **originalnog** polja. `filter` ovdje ne bi radio: vraća novo polje, a uvezeni `todos` bi ostao isti (uvezenu varijablu ne možemo ponovno dodijeliti).
- Sve rute počinju s `/api` jer Vite proxy prosljeđuje poslužitelju samo zahtjeve koji počinju s `/api`.
- Rješenje usput registrira i `PATCH` na istoj funkciji. To nije obavezno, samo omogućuje da radi i PUT i PATCH zahtjev.

### 1e. Klijentska funkcija `get_todos` (3 boda)

**Što se traži:** na klijentu napraviti funkciju koja dohvaća sve zapise s poslužitelja.

**Rješenje** (`src/js/index.js`):

```js
function get_todos(callback) {
    const request = $.get("/api/todos");
    if (typeof callback === "function") {
        request.then(callback);
    }
    return request;
}
```

**Zašto je ovako:**
- `$.get(url)` šalje GET zahtjev i vraća jQuery Promise. Funkcija ga vraća, pa se može pisati `get_todos().then(render_todos)`.
- Ako se proslijedi funkcija (`get_todos(render_todos)`), ona se pozove s podacima kad stignu. Tako rade oba načina poziva.
- URL je relativan (`/api/todos`, bez `localhost:3000`). Zahtjev ide na Vite (8080), a proxy ga prosljeđuje poslužitelju. Zato nema CORS problema.

</details>

<details>
<summary><b>Zadatak 2 (16 bodova): prototip kartice i responzivnost</b></summary>

**Što se traži:** u `index.html`, samo HTML-om i Bootstrap klasama, napraviti jednu karticu s jednim zapisom:
- sadržaj: naslov (1), datum (1), status s ikonom (2), gumbi Toggle i Remove (2)
- stil: zaobljena kartica (1), gumbi u obliku pilule (3)
- responzivnost: raspored kartica (2), raspored gumbova (2), razmaci (2)

Kad je kartica gotova, treba je **zakomentirati** i iskoristiti kao predložak za Zadatak 3.

**Rješenje** (`src/index.html`):

```html
<main class="container mb-5">
    <!-- Prototip kartice (Zadatak 2):
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col">
            <div class="card rounded-4 border shadow-sm p-3 h-100">
                <div class="card-body d-flex flex-column justify-content-between p-0">
                    <div>
                        <h5 class="card-title fw-bold mb-2">Buy groceries</h5>
                        <p class="card-text mb-1"><span class="fw-bold">When:</span> 12/4/2025</p>
                        <p class="card-text mb-3"><span class="fw-bold">Status:</span> <i class="bi bi-check-circle-fill text-success"></i></p>
                    </div>
                    <div class="d-flex gap-2 mt-auto">
                        <button class="btn btn-outline-secondary rounded-pill flex-fill">Toggle</button>
                        <button class="btn btn-outline-secondary rounded-pill flex-fill">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    -->

    <div id="todos-container" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 w-100">
    </div>
</main>
```

**Zašto je ovako:**

*Raspored kartica (responzivnost):*
- `row` je Bootstrapov red mreže, a `row-cols-*` kaže koliko stupaca stane u red. Bootstrap ide "od mobitela prema većem": `row-cols-1` vrijedi uvijek, `row-cols-md-2` od 768 px širine, `row-cols-lg-3` od 992 px. Rezultat: 1 kartica u redu na mobitelu, 2 na tabletu, 3 na računalu.
- Svaka kartica je u `<div class="col">`. Bez `col` element ne bi bio stupac mreže.
- `g-4` je "gutter", razmak između kartica i vodoravno i okomito.

*Kartica:*
- `card` je Bootstrapova komponenta kartice. `rounded-4` daje jaču zaobljenost od zadane, `border` tanki obrub, `shadow-sm` malu sjenu, `p-3` unutarnji razmak.
- `h-100` daje karticama u istom redu jednaku visinu, čak i kad je jedan naslov duži.
- `card-body d-flex flex-column justify-content-between` slaže sadržaj okomito: tekst gore, gumbi dolje.

*Sadržaj:*
- Naslov je `h5.card-title`, a `fw-bold` ga podebljava. Oznake "When:" i "Status:" su podebljane s `<span class="fw-bold">`.
- Datum je u formatu `M/D/YYYY`, isti format koji će kasnije davati `format_date`.
- Status je ikona: `bi-check-circle-fill text-success` (zelena kvačica) za gotov zadatak i `bi-x-circle-fill text-danger` (crveni X) za nedovršen.

*Gumbi:*
- `d-flex gap-2` stavlja gumbe u red s razmakom između njih. `mt-auto` ih gura na dno kartice.
- `btn btn-outline-secondary` je sivi gumb s obrubom, `rounded-pill` mu daje oblik pilule, `flex-fill` čini da oba gumba zauzmu jednak dio širine.

*Zašto zakomentirati prototip:*
- Na stranici bi ostala lažna kartica s izmišljenim podacima koju JavaScript ne kontrolira.
- Njegov HTML postaje predložak za `render_todos` u Zadatku 3.
- Ostaje prazan `#todos-container` s istim klasama mreže. JavaScript u njega ubacuje `<div class="col">` kartice, pa responzivnost i dalje radi.

</details>

<details>
<summary><b>Zadatak 3 (22 boda): <code>render_todos</code>, <code>toggle</code>, <code>remove</code>, <code>format_date</code>, fade-in</b></summary>

**Što se traži:** na klijentu (`src/js/index.js`):
- `render_todos` iscrtava sve zapise dohvaćene preko `get_todos` (5)
- `remove` (2) i `toggle` (2) mijenjaju podatke **i na poslužitelju i na klijentu**, a pozivaju se klikom na gumbe (2 + 2)
- pri promjeni statusa mijenja se ikona (2)
- datum se iz milisekundi pretvara u čitljiv format (2)
- kartice se pri učitavanju pojavljuju s fade-in efektom (5)

### `format_date` (2 boda)

```js
function format_date(timestamp) {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
// format_date(1764845228329) → "12/4/2025"
```

**Zašto je ovako:**
- `timestamp` je broj milisekundi od 1. 1. 1970. (Unix epoha). `new Date(timestamp)` od tog broja napravi datum.
- `getMonth()` broji mjesece od 0 (siječanj = 0), zato `+ 1`.
- `getDate()` je dan u mjesecu. `getDay()` bi vratio dan u tjednu (0 do 6), što je česta greška.
- Format je `M/D/YYYY`, bez vodećih nula (`12/4/2025`, a ne `12/04/2025`), isto kao u prototipu.

### `render_todos` (5 bodova), gumbi (2 + 2 boda) i fade-in (5 bodova)

```js
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

$(() => {
    get_todos().then((todos) => {
        render_todos(todos);
    });
});
```

**Zašto je ovako:**
- `$container.empty()` prvo isprazni kontejner, pa ponovni poziv funkcije ne udvostruči kartice.
- Za svaki zapis uzima se HTML zakomentiranog prototipa iz Zadatka 2 kao template string (navodnici `` ` ``), a izmišljeni podaci zamijene se pravima preko `${...}`: naslov, formatirani datum i klasa ikone.
- Klasa ikone bira se ternarnim operatorom: ako je `todo.done` istina, zelena kvačica, inače crveni X.
- Tri dodatka u odnosu na prototip služe kasnijim funkcijama:
  - `data-id="${todo.id}"` na stupcu: `toggle` i `remove` po njemu nalaze baš tu karticu.
  - klasa `status-icon` na ikoni: `toggle` po njoj nalazi ikonu koju mijenja.
  - klase `btn-toggle` i `btn-remove`: po njima se nalaze gumbi za vezanje klika.
- Klik se veže s `$col.find(".btn-toggle").on("click", ...)` dok je kartica još u varijabli. Arrow funkcija "pamti" `todo.id` tog zapisa, pa svaki gumb poziva `toggle`/`remove` sa svojim id-em.
- Fade-in: `fadeIn` radi samo na skrivenom elementu, zato je redoslijed `hide()` → `append()` → `fadeIn(500)`. Kartica se doda nevidljiva, a onda se pojavi kroz 500 ms.
- `$(() => { ... })` se izvršava kad je HTML učitan, tj. kad `#todos-container` već postoji. Tada se dohvate zapisi i proslijede u `render_todos`.

### `toggle` (2 boda) i promjena ikone (2 boda)

```js
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
```

**Zašto je ovako:**
- Kartica se nađe po `data-id`, a ikona unutar nje po klasi `status-icon`.
- Trenutni status čita se iz same ikone: ako ima klasu `bi-check-circle-fill`, zadatak je gotov. Novi status je suprotan (`!isDone`).
- Koristi se `$.ajax` jer jQuery nema skraćenicu za PUT (postoje samo `$.get` i `$.post`).
- `contentType: "application/json"` i `JSON.stringify(...)` šalju tijelo kao JSON. Samo takvo tijelo `express.json()` na poslužitelju zna pročitati.
- Ikona se mijenja tek u `success`, kad poslužitelj potvrdi spremanje, i to prema vrijednosti `updated.done` koju je poslužitelj vratio. Tako prikaz nikad ne pokazuje nešto što nije spremljeno.
- Mijenjaju se dvije klase odjednom: oblik ikone (`bi-check-circle-fill` ↔ `bi-x-circle-fill`) i boja (`text-success` ↔ `text-danger`).
- Ako zahtjev ne uspije, greška se ispiše u konzolu i ikona ostaje ista.

### `remove` (2 boda)

```js
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
```

**Zašto je ovako:**
- Prvo se šalje DELETE poslužitelju (opet `$.ajax`, jer jQuery nema skraćenicu za DELETE). Tako zapis nestaje i iz podataka, ne samo s ekrana. Nakon osvježavanja stranice ne vraća se.
- Kartica se uklanja tek kad poslužitelj potvrdi brisanje (`success`).
- `fadeOut(300)` postupno sakrije karticu, a `$(this).remove()` u callbacku je izbaci iz HTML-a **nakon** animacije. Da se `remove()` pozove odmah, kartica bi nestala prije nego što se animacija vidi.

### Funkcije na `window`

```js
window.format_date = format_date;
window.get_todos = get_todos;
window.toggle = toggle;
window.remove = remove;
window.render_todos = render_todos;
```

**Zašto:** `index.js` se učitava kao modul (`<script type="module">`), a funkcije iz modula nisu globalne. Dodjelom na `window` mogu ih pozvati testovi i konzola preglednika.

</details>

---

## Probni kolokvij 2: EventPulse

Aplikacija za praćenje događaja. Svaki događaj ima naslov, datum (`timestamp`) i status `confirmed` (potvrđen ili nije). Kartica prikazuje te podatke i gumbe **Toggle** (mijenja potvrdu) i **Remove** (briše događaj).

<details>
<summary><b>Zadatak 1 (21 bod): boje, font, navigacija, poslužitelj i <code>get_events</code></b></summary>

### 1a. Bootstrap boje i font Outfit (1 + 2 boda)

**Što se traži:** boje `success`, `warning` i `danger` postaviti na `#2ec4b6`, `#ff9f1c` i `#e71d36` te font klijenta na Outfit.

**Rješenje** (`src/scss/style.scss`):

```scss
$primary: #4361ee;
$light: #f8f9fa;
$dark: #212529;
$success: #2ec4b6;
$warning: #ff9f1c;
$danger: #e71d36;

@import "bootstrap/scss/bootstrap";

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css");

body {
  font-family: "Outfit", sans-serif;
}
```

**Zašto je ovako:**
- Varijable moraju biti **iznad** `@import "bootstrap/scss/bootstrap"`. Bootstrapove varijable imaju `!default`, što znači da Bootstrap zadržava vrijednost koja je već definirana. Ispod importa bi bilo prekasno: klase bi već bile izgenerirane s izvornim bojama.
- Promjenom `$success` i `$danger` mijenjaju se i `text-success`/`text-danger`, pa su ikone statusa u traženim bojama bez ikakvog dodatnog CSS-a.
- `$primary` zadatak ne traži izravno, ali rješenje ga mijenja jer navigacija koristi `bg-primary`, pa traka dobiva plavu `#4361ee`.
- Font se prvo učita s Google Fonts (`@import url(...)`), a onda postavi na `body`. Svi elementi ga nasljeđuju. `sans-serif` je rezervni font.
- Bootstrap Icons se uvoze jer su ikone font. Bez njih `<i class="bi ...">` ne prikazuje ništa.

### 1b. Navigacijska traka (4 boda)

**Što se traži:** traka samo Bootstrap klasama, pozadina `bg-primary`, sjena `shadow`, ikona `calendar-event` u boji `text-warning` i naslov `EventPulse`.

**Rješenje** (`src/index.html`):

```html
<nav class="navbar bg-primary shadow mb-4">
    <div class="container">
        <a class="navbar-brand text-white d-flex align-items-center" href="#">
            <i class="bi bi-calendar-event text-warning me-2 fs-5"></i>
            <span>EventPulse</span>
        </a>
    </div>
</nav>
```

**Zašto je ovako:**
- `navbar` daje izgled i raspored trake, `bg-primary` plavu pozadinu (naša `$primary`), `shadow` sjenu ispod trake, `mb-4` razmak do kartica.
- `container` poravnava sadržaj trake sa sadržajem stranice ispod.
- `navbar-brand` je klasa za naziv aplikacije. `text-white` je potreban da bi tekst bio čitljiv na plavoj pozadini.
- `d-flex align-items-center` drži ikonu i naslov u istom redu, okomito centrirane.
- `bi bi-calendar-event` je tražena ikona, `text-warning` je boji u narančasto (`$warning`), `me-2` odmiče tekst od ikone, `fs-5` određuje veličinu.

### 1c. UUID za svaki događaj (2 boda)

**Što se traži:** u `server/events.js` uvesti `randomUUID` iz modula `crypto`, svakom događaju dodati `id` i izvesti polje.

**Rješenje** (`server/events.js`):

```js
import { randomUUID } from "crypto";

const events = [
  { id: randomUUID(), title: "Web Dev Workshop", timestamp: 1765018057945, confirmed: true },
  { id: randomUUID(), title: "Design Sprint",    timestamp: 1764845228329, confirmed: true },
  // ... isto za svaki događaj
];

export { events };
export default events;
```

**Zašto je ovako:**
- PUT i DELETE rute moraju znati točno koji događaj mijenjaju. Naslovi se mogu ponavljati, a pozicija u polju se mijenja nakon brisanja. UUID je jedinstven.
- `crypto` je ugrađen u Node, pa ne treba `npm install`.
- Svaki restart poslužitelja generira nove id-eve, jer se `randomUUID()` poziva pri učitavanju datoteke.
- Imenovani izvoz (`export { events }`) i zadani izvoz (`export default events`) omogućuju oba načina uvoza. Zadatak traži oba.

### 1d. Uvoz i rute (2 + 1 + 3 + 3 boda)

**Što se traži:** uvesti polje u `server/index.js`, dodati middleware za JSON i napraviti rute `GET /api/events`, `PUT /api/events/:id` i `DELETE /api/events/:id`.

**Rješenje** (`server/index.js`):

```js
import express from 'express'
import events from './events.js'

const app = express()
app.use(express.json());

// GET: svi događaji (1 bod)
app.get("/api/events", (req, res) => {
    res.json(events);
});

// PUT: uređivanje postojećeg (3 boda)
const updateEvent = (req, res) => {
    const { id } = req.params;
    const item = events.find((e) => e.id === id);
    if (!item) {
        return res.status(404).json({ error: "Event not found" });
    }
    if (req.body.confirmed !== undefined) {
        item.confirmed = req.body.confirmed;
    }
    if (req.body.title !== undefined) {
        item.title = req.body.title;
    }
    if (req.body.timestamp !== undefined) {
        item.timestamp = req.body.timestamp;
    }
    return res.json(item);
};
app.put("/api/events/:id", updateEvent);
app.patch("/api/events/:id", updateEvent);

// DELETE: brisanje postojećeg (3 boda)
const deleteEvent = (req, res) => {
    const { id } = req.params;
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Event not found" });
    }
    const [removed] = events.splice(index, 1);
    return res.json(removed);
};
app.delete("/api/events/:id", deleteEvent);
```

| Metoda | Ruta | Tijelo zahtjeva | Odgovor |
|---|---|---|---|
| `GET` | `/api/events` | | polje svih događaja |
| `PUT` | `/api/events/:id` | `{ "confirmed": true }` | ažurirani događaj ili `404` |
| `DELETE` | `/api/events/:id` | | obrisani događaj ili `404` |

**Zašto je ovako:**
- `express.json()` pretvara JSON tijelo zahtjeva u `req.body`. Bez njega PUT ruta ne bi vidjela novi `confirmed`.
- **GET** samo vraća cijelo polje s `res.json`.
- **PUT**:
  - `req.params.id` je vrijednost iz putanje (`:id`).
  - `find` vraća referencu na objekt u polju, pa promjena `item.confirmed` mijenja stvarni podatak koji vraća i idući GET.
  - Provjera `!== undefined` dopušta postavljanje na `false`. Uvjet `if (req.body.confirmed)` bi `false` preskočio i događaj se ne bi mogao "odpotvrditi".
  - Nepostojeći id vraća `404`. Ispravan zahtjev vraća ažurirani događaj, koji klijent koristi za promjenu ikone.
- **DELETE** `findIndex` nađe poziciju, `splice(index, 1)` ukloni taj element iz **originalnog** polja. `filter` bi vratio novo polje, a uvezeni `events` ostao bi nepromijenjen.
- Putanje počinju s `/api` jer Vite proxy samo njih prosljeđuje na port 3000.

### 1e. Klijentska funkcija `get_events` (3 boda)

**Što se traži:** funkcija koja preko `GET /api/events` dohvaća sve događaje i vraća jQuery Promise.

**Rješenje** (`src/js/index.js`):

```js
function get_events(callback) {
    const request = $.get("/api/events");
    if (typeof callback === "function") {
        request.then(callback);
    }
    return request;
}
```

**Zašto je ovako:**
- `$.get` šalje GET zahtjev i vraća Promise. Funkcija ga vraća, pa se može pisati `get_events().then(render_events)`.
- Ako se proslijedi callback, poziva se s podacima kad stignu.
- Relativni URL `/api/events` ide na Vite, a Vite ga prosljeđuje poslužitelju. Ne treba pisati port i nema CORS problema.

</details>

<details>
<summary><b>Zadatak 2 (16 bodova): prototip kartice i responzivnost</b></summary>

**Što se traži:** u `index.html`, samo HTML-om i Bootstrap klasama, jedna kartica s jednim događajem:

| Stavka | Bodovi |
|---|---|
| naslov događaja | 1 |
| datum u formatu `When: M/D/YYYY` | 1 |
| status s ikonom | 2 |
| gumbi Toggle i Remove | 2 |
| `rounded-4`, `border`, `shadow-sm` | 1 |
| gumbi `btn btn-outline-secondary rounded-pill flex-fill` | 3 |
| mreža: 3 stupca na `lg`, 2 na `md`, 1 na malom ekranu | 2 |
| gumbi vodoravno, s razmakom, na dnu kartice | 2 |
| razmaci između kartica `g-4` | 2 |

Nakon izrade prototip treba zakomentirati.

**Rješenje** (`src/index.html`):

```html
<main class="container mb-5">
    <!-- Prototip kartice (Zadatak 2):
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col">
            <div class="card rounded-4 border shadow-sm p-3 h-100">
                <div class="card-body d-flex flex-column justify-content-between p-0">
                    <div>
                        <h5 class="card-title fw-bold mb-2">Web Dev Workshop</h5>
                        <p class="card-text mb-1"><span class="fw-bold">When:</span> 12/6/2025</p>
                        <p class="card-text mb-3"><span class="fw-bold">Status:</span> <i class="bi bi-calendar-check-fill text-success"></i></p>
                    </div>
                    <div class="d-flex gap-2 mt-auto">
                        <button class="btn btn-outline-secondary rounded-pill flex-fill">Toggle</button>
                        <button class="btn btn-outline-secondary rounded-pill flex-fill">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    -->

    <div id="events-container" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 w-100">
    </div>
</main>
```

**Zašto je ovako:**
- **Mreža:** `row-cols-1 row-cols-md-2 row-cols-lg-3` određuje broj kartica u redu po širini ekrana. Bootstrap kreće od najmanjeg ekrana: `row-cols-1` vrijedi uvijek, a `md` (od 768 px) i `lg` (od 992 px) ga nadjačavaju na širim ekranima. Svaka kartica je u `col` elementu.
- **Razmaci:** `g-4` dodaje jednak razmak između kartica vodoravno i okomito.
- **Kartica:** `rounded-4` (jača zaobljenost), `border` (tanki obrub) i `shadow-sm` (mala sjena) su točno ono što zadatak traži. `h-100` izjednačava visine kartica u istom redu.
- **Raspored unutar kartice:** `d-flex flex-column justify-content-between` drži tekst na vrhu i gumbe na dnu.
- **Gumbi:** `d-flex gap-2` ih stavlja u red s razmakom, `mt-auto` ih gura na dno, `rounded-pill` im daje oblik pilule, `flex-fill` ih čini jednako širokima.
- **Ikona statusa:** `bi-calendar-check-fill text-success` za potvrđen događaj i `bi-calendar-x-fill text-danger` za nepotvrđen. Boje dolaze iz `$success` i `$danger` iz Zadatka 1.
- **Komentiranje:** prototip ima izmišljene podatke i ne smije ostati na stranici. Njegov HTML se kopira u `render_events`. Prazan `#events-container` ima iste klase mreže, pa dinamički dodane kartice dobivaju isti responzivni raspored.

</details>

<details>
<summary><b>Zadatak 3 (22 boda): <code>render_events</code>, <code>toggle</code>, <code>remove</code>, <code>format_date</code>, animacije</b></summary>

**Što se traži** (`src/js/index.js`):
- `render_events` iscrtava događaje dohvaćene s `get_events` u `#events-container` (5)
- `remove` (2) i `toggle` (2) mijenjaju podatke na poslužitelju i klijentu, a pozivaju se klikom na gumbe (2 + 2)
- toggle mijenja ikonu između `calendar-check-fill text-success` i `calendar-x-fill text-danger` (2)
- `format_date` pretvara milisekunde u `M/D/YYYY` (2)
- fade-in kartica pri učitavanju, 500 ms (5), i fade-out pri uklanjanju, 300 ms

### `format_date` (2 boda)

```js
function format_date(timestamp) {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
// format_date(1765018057945) → "12/6/2025"
```

**Zašto je ovako:**
- `timestamp` je broj milisekundi od 1. 1. 1970. `new Date(timestamp)` pretvara ga u datum s kojim se može raditi.
- `getMonth()` vraća 0 do 11, zato se dodaje 1.
- `getDate()` je dan u mjesecu. `getDay()` vraća dan u tjednu i dao bi krivi datum.
- Format `M/D/YYYY` je bez vodećih nula, isti kao u prototipu.

### `render_events` (5 bodova), gumbi (2 + 2 boda) i fade-in (5 bodova)

```js
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

$(() => {
    get_events().then((events) => {
        render_events(events);
    });
});
```

**Zašto je ovako:**
- `empty()` briše postojeći sadržaj kontejnera, pa ponovni poziv ne stvara duplikate.
- HTML kartice je prototip iz Zadatka 2 pretvoren u template string. Naslov, datum i ikona umeću se s `${...}`.
- Ternarni operator bira klasu ikone prema `item.confirmed`.
- Dodaci koji nisu bili u prototipu, a trebaju kasnijim funkcijama:
  - `data-id` na stupcu, da `toggle` i `remove` mogu naći karticu po id-u
  - `status-icon` na ikoni, da `toggle` zna koju ikonu mijenja
  - `btn-toggle` i `btn-remove` na gumbima, da im se može vezati klik
- Klik se veže na gumbe unutar `$col` prije dodavanja na stranicu. Arrow funkcija zapamti `item.id` baš tog događaja.
- `hide()` → `append()` → `fadeIn(500)`: `fadeIn` djeluje samo na skriven element, pa se kartica prvo sakrije, doda i onda pojavi kroz 500 ms.
- `$(() => { ... })` čeka da se HTML učita, tako da `#events-container` postoji kad se kartice dodaju.

### `toggle` (2 boda) i zamjena ikone (2 boda)

```js
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
```

**Zašto je ovako:**
- Trenutni status se čita iz klase ikone, a novi je njegova suprotnost.
- `$.ajax` s `method: "PUT"` jer jQuery nema skraćenicu za PUT.
- `contentType: "application/json"` + `JSON.stringify` šalju podatke kao JSON, jedini oblik koji `express.json()` čita.
- Ikona se mijenja tek nakon odgovora poslužitelja i prema vrijednosti koju je poslužitelj vratio (`updated.confirmed`). Tako su poslužitelj i prikaz uvijek usklađeni.
- `removeClass`/`addClass` zamjenjuju i oblik ikone i njezinu boju.

### `remove` (2 boda) i fade-out (300 ms)

```js
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
```

**Zašto je ovako:**
- DELETE zahtjev briše događaj na poslužitelju, pa se ne vraća nakon osvježavanja stranice.
- Kartica nestaje tek kad poslužitelj potvrdi brisanje.
- `fadeOut(300)` je tražena animacija od 300 ms. `$(this).remove()` je u callbacku jer se element smije izbaciti iz HTML-a tek kad animacija završi.

### Funkcije na `window`

```js
window.format_date = format_date;
window.get_events = get_events;
window.toggle = toggle;
window.remove = remove;
window.render_events = render_events;
```

**Zašto:** skripta je modul (`type="module"`), a funkcije u modulu nisu globalne. Bez ovoga ih testovi i konzola ne mogu pozvati.

</details>

---

## Probni kolokvij 3: ReadingList

Popis knjiga za čitanje. Svaka knjiga ima naslov, datum dodavanja (`timestamp`) i status `read` (pročitana ili nije). Kartica prikazuje te podatke i gumbe **Toggle** (mijenja pročitanost) i **Remove** (briše knjigu).

> Prvo pokušajte sami riješiti `kolokvij_3/template` prema [tekstu zadatka](kolokvij_3/probni-kolokvij-3.html), a tek onda otvorite objašnjenja ispod ili [objasnjenje_rjesenja.html](kolokvij_3/objasnjenje_rjesenja.html).

<details>
<summary><b>Zadatak 1 (21 bod): boje, font, navigacija, poslužitelj i <code>get_books</code></b></summary>

### 1a. Bootstrap boje i font Nunito (1 + 2 boda)

**Što se traži:** boje `success`, `warning` i `danger` postaviti na `#06d6a0`, `#ffd166` i `#ef476f` te font klijenta na Nunito.

**Rješenje** (`src/scss/style.scss`):

```scss
$primary: #3a0ca3;
$light: #f8f9fa;
$dark: #212529;
$success: #06d6a0;
$warning: #ffd166;
$danger: #ef476f;

@import "bootstrap/scss/bootstrap";

@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css");

body {
  font-family: "Nunito", sans-serif;
}
```

**Zašto je ovako:**
- Varijable idu **prije** `@import "bootstrap/scss/bootstrap"`. Bootstrap ih definira s `!default`, pa poštuje vrijednost koja već postoji. Nakon importa bi bilo prekasno.
- Nove `$success` i `$danger` automatski mijenjaju `text-success` i `text-danger`, pa ikone statusa dobivaju tražene boje.
- `$primary` zadatak ne traži. Ovdje se ne koristi jer je navigacija `bg-dark`, pa je njegova promjena neobavezna.
- Font se učita s Google Fonts i postavi na `body`. Sve unutar njega ga nasljeđuje.
- Bootstrap Icons se uvoze jer su ikone font. Bez importa ikone su nevidljive.

### 1b. Navigacijska traka (4 boda)

**Što se traži:** traka samo Bootstrap klasama, pozadina `bg-dark`, sjena `shadow`, ikona `book-half` u boji `text-warning` i naslov `ReadingList`.

**Rješenje** (`src/index.html`):

```html
<nav class="navbar bg-dark shadow mb-4">
    <div class="container">
        <a class="navbar-brand text-white d-flex align-items-center" href="#">
            <i class="bi bi-book-half text-warning me-2 fs-5"></i>
            <span>ReadingList</span>
        </a>
    </div>
</nav>
```

**Zašto je ovako:**
- `navbar` daje raspored trake, `bg-dark` tamnu pozadinu, `shadow` sjenu ispod, `mb-4` razmak do kartica.
- Na tamnoj pozadini zadani tamni tekst se ne bi vidio, zato `text-white` na nazivu.
- `container` poravnava sadržaj trake s karticama ispod.
- `d-flex align-items-center` drži ikonu i naslov u istom redu.
- `bi bi-book-half` je tražena ikona, `text-warning` je boji u žuto (`$warning`), `me-2` daje razmak do naslova, `fs-5` određuje veličinu.

### 1c. UUID za svaku knjigu (2 boda)

**Što se traži:** u `server/books.js` uvesti `randomUUID`, svakoj knjizi dodati `id` i izvesti polje.

**Rješenje** (`server/books.js`):

```js
import { randomUUID } from "crypto";

const books = [
  { id: randomUUID(), title: "Clean Code",               timestamp: 1765018057945, read: true },
  { id: randomUUID(), title: "The Pragmatic Programmer", timestamp: 1764845228329, read: true },
  // ... isto za svaku knjigu
];

export { books };
export default books;
```

**Zašto je ovako:**
- Da bi poslužitelj znao koju knjigu mijenja ili briše, svaka mora imati jedinstven ključ. Naslov to nije (dvije knjige mogu imati isti), a pozicija u polju se mijenja nakon brisanja.
- `crypto` je ugrađen u Node, ništa se ne instalira.
- Id-evi se generiraju pri pokretanju poslužitelja, pa su nakon svakog restarta drugačiji.
- Izvoze se i imenovano i zadano, pa rade oba oblika `import` naredbe.

### 1d. Uvoz i rute (2 + 1 + 3 + 3 boda)

**Što se traži:** uvesti polje u `server/index.js` i napraviti rute `GET /api/books`, `PUT /api/books/:id` i `DELETE /api/books/:id`.

**Rješenje** (`server/index.js`):

```js
import express from 'express'
import books from './books.js'

const app = express()
app.use(express.json());

// GET: sve knjige (1 bod)
app.get("/api/books", (req, res) => {
    res.json(books);
});

// PUT: uređivanje postojeće (3 boda)
const updateBook = (req, res) => {
    const { id } = req.params;
    const item = books.find((e) => e.id === id);
    if (!item) {
        return res.status(404).json({ error: "Book not found" });
    }
    if (req.body.read !== undefined) {
        item.read = req.body.read;
    }
    if (req.body.title !== undefined) {
        item.title = req.body.title;
    }
    if (req.body.timestamp !== undefined) {
        item.timestamp = req.body.timestamp;
    }
    return res.json(item);
};
app.put("/api/books/:id", updateBook);
app.patch("/api/books/:id", updateBook);

// DELETE: brisanje postojeće (3 boda)
const deleteBook = (req, res) => {
    const { id } = req.params;
    const index = books.findIndex((e) => e.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    const [removed] = books.splice(index, 1);
    return res.json(removed);
};
app.delete("/api/books/:id", deleteBook);
```

| Metoda | Ruta | Tijelo zahtjeva | Odgovor |
|---|---|---|---|
| `GET` | `/api/books` | | polje svih knjiga |
| `PUT` | `/api/books/:id` | `{ "read": true }` | ažurirana knjiga ili `404` |
| `DELETE` | `/api/books/:id` | | obrisana knjiga ili `404` |

**Zašto je ovako:**
- `express.json()` pretvara JSON tijelo zahtjeva u `req.body`. Bez njega PUT ne zna novu vrijednost `read`.
- **GET** vraća cijelo polje.
- **PUT**:
  - `find` vraća referencu na knjigu u polju, pa promjena `item.read` mijenja pravi podatak.
  - Uvjet je `!== undefined` da bi `false` bio dopušten. `if (req.body.read)` ne bi nikad postavio knjigu natrag na "nepročitana".
  - Nepostojeći id vraća `404`, ispravan vraća ažuriranu knjigu.
- **DELETE** `splice` uklanja knjigu iz originalnog polja. `filter` bi napravio novo polje, a ono koje rute koriste ostalo bi isto.
- Rute su pod `/api` jer Vite proxy prosljeđuje samo te zahtjeve.

### 1e. Klijentska funkcija `get_books` (3 boda)

**Što se traži:** funkcija koja preko `GET /api/books` dohvaća sve knjige.

**Rješenje** (`src/js/index.js`):

```js
function get_books(callback) {
    const request = $.get("/api/books");
    if (typeof callback === "function") {
        request.then(callback);
    }
    return request;
}
```

**Zašto je ovako:**
- `$.get` šalje zahtjev i vraća Promise. Zato se može pisati `get_books().then(render_books)`.
- Opcionalni callback dopušta i poziv `get_books(render_books)`.
- Relativni URL ide preko Vite proxyja do poslužitelja, bez porta i bez CORS problema.

</details>

<details>
<summary><b>Zadatak 2 (16 bodova): prototip kartice i responzivnost</b></summary>

**Što se traži:** u `index.html`, samo HTML-om i Bootstrap klasama, jedna kartica s jednom knjigom:

| Stavka | Bodovi |
|---|---|
| naslov knjige | 1 |
| datum dodavanja u formatu `Added: M/D/YYYY` | 1 |
| status s ikonom | 2 |
| gumbi Toggle i Remove | 2 |
| `rounded-4`, `border`, `shadow-sm` | 1 |
| gumbi `btn btn-outline-secondary rounded-pill flex-fill` | 3 |
| mreža: 3 stupca na `lg`, 2 na `md`, 1 na malom ekranu | 2 |
| gumbi vodoravno, s razmakom, na dnu kartice | 2 |
| razmaci između kartica `g-4` | 2 |

Nakon izrade prototip treba zakomentirati.

**Rješenje** (`src/index.html`):

```html
<main class="container mb-5">
    <!-- Prototip kartice (Zadatak 2):
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col">
            <div class="card rounded-4 border shadow-sm p-3 h-100">
                <div class="card-body d-flex flex-column justify-content-between p-0">
                    <div>
                        <h5 class="card-title fw-bold mb-2">Clean Code</h5>
                        <p class="card-text mb-1"><span class="fw-bold">Added:</span> 12/6/2025</p>
                        <p class="card-text mb-3"><span class="fw-bold">Status:</span> <i class="bi bi-bookmark-check-fill text-success"></i></p>
                    </div>
                    <div class="d-flex gap-2 mt-auto">
                        <button class="btn btn-outline-secondary rounded-pill flex-fill">Toggle</button>
                        <button class="btn btn-outline-secondary rounded-pill flex-fill">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    -->

    <div id="books-container" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 w-100">
    </div>
</main>
```

**Zašto je ovako:**
- **Mreža:** `row-cols-1` (uvijek 1 kartica u redu), `row-cols-md-2` (2 od 768 px), `row-cols-lg-3` (3 od 992 px). Bootstrap kreće od mobitela i na širim ekranima nadjačava manje postavke. Svaka kartica je u `col`.
- **Razmaci:** `g-4` daje razmak između kartica u oba smjera.
- **Kartica:** `rounded-4`, `border` i `shadow-sm` daju traženu zaobljenost, obrub i sjenu. `h-100` čini kartice u redu jednako visokima.
- **Unutar kartice:** `d-flex flex-column justify-content-between` drži tekst gore i gumbe dolje.
- **Gumbi:** `d-flex gap-2` vodoravno s razmakom, `mt-auto` na dno, `rounded-pill` oblik pilule, `flex-fill` jednaka širina.
- **Ikona statusa:** `bi-bookmark-check-fill text-success` za pročitanu knjigu, `bi-bookmark-x-fill text-danger` za nepročitanu.
- **Datum** ima oznaku `Added:` umjesto `When:`, jer je to datum kad je knjiga dodana na popis.
- **Komentiranje:** prototip se zakomentira da na stranici ne ostane lažna knjiga. Njegov HTML se koristi u `render_books`, a prazan `#books-container` s istim klasama mreže prima kartice iz JavaScripta.

</details>

<details>
<summary><b>Zadatak 3 (22 boda): <code>render_books</code>, <code>toggle</code>, <code>remove</code>, <code>format_date</code>, animacije</b></summary>

**Što se traži** (`src/js/index.js`):
- `render_books` iscrtava knjige dohvaćene s `get_books` u `#books-container` (5)
- `remove` (2) i `toggle` (2) mijenjaju podatke na poslužitelju i klijentu, a pozivaju se klikom na gumbe (2 + 2)
- toggle mijenja ikonu između `bookmark-check-fill text-success` i `bookmark-x-fill text-danger` (2)
- `format_date` pretvara milisekunde u `M/D/YYYY` (2)
- fade-in kartica pri učitavanju, 500 ms (5), i fade-out pri uklanjanju, 300 ms

### `format_date` (2 boda)

```js
function format_date(timestamp) {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
// format_date(1765018057945) → "12/6/2025"
```

**Zašto je ovako:**
- `timestamp` su milisekunde od 1. 1. 1970., a `new Date(timestamp)` od njih radi datum.
- `getMonth()` počinje od 0, zato `+ 1`.
- `getDate()` daje dan u mjesecu (`getDay()` bi dao dan u tjednu).
- Rezultat je `M/D/YYYY` bez vodećih nula, kao u prototipu.

### `render_books` (5 bodova), gumbi (2 + 2 boda) i fade-in (5 bodova)

```js
function render_books(books) {
    const $container = $("#books-container");
    $container.empty();

    books.forEach((item) => {
        const formattedDate = format_date(item.timestamp);
        const iconClass = item.read
            ? "bi-bookmark-check-fill text-success"
            : "bi-bookmark-x-fill text-danger";

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

$(() => {
    get_books().then((books) => {
        render_books(books);
    });
});
```

**Zašto je ovako:**
- `empty()` čisti kontejner, pa ponovno iscrtavanje ne stvara duplikate.
- Kartica je HTML prototipa iz Zadatka 2 kao template string, s pravim naslovom, datumom i ikonom umetnutima preko `${...}`.
- Ternarni operator bira ikonu prema `item.read`.
- Dodatne oznake za kasnije funkcije:
  - `data-id` da `toggle` i `remove` nađu karticu
  - `status-icon` da `toggle` zna koju ikonu mijenja
  - `btn-toggle` i `btn-remove` da se gumbima veže klik
- Klik se veže dok je kartica još u varijabli `$col`. Arrow funkcija pamti `item.id` te knjige.
- `hide()` → `append()` → `fadeIn(500)`: kartica se doda skrivena i onda pojavi kroz 500 ms. `fadeIn` na već vidljivom elementu ne bi napravio ništa.
- `$(() => { ... })` pokreće dohvat tek kad je HTML učitan i `#books-container` postoji.

### `toggle` (2 boda) i zamjena ikone (2 boda)

```js
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
```

**Zašto je ovako:**
- Trenutni status čita se iz klase ikone, a novi je suprotan.
- `$.ajax` s `method: "PUT"`, jer jQuery nema skraćenicu za PUT.
- `contentType: "application/json"` i `JSON.stringify` šalju tijelo kao JSON koje `express.json()` čita.
- Ikona se mijenja tek u `success`, prema `updated.read` koji je vratio poslužitelj. Prikaz tako uvijek odgovara spremljenom stanju.
- Zamjenjuju se i oblik (`bookmark-check-fill` ↔ `bookmark-x-fill`) i boja (`text-success` ↔ `text-danger`).

### `remove` (2 boda) i fade-out (300 ms)

```js
function remove(id) {
    const $col = $(`[data-id="${id}"]`);
    return $.ajax({
        url: `/api/books/${id}`,
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
```

**Zašto je ovako:**
- DELETE briše knjigu na poslužitelju, pa se ne vraća nakon osvježavanja.
- Kartica se uklanja tek nakon potvrde poslužitelja.
- `fadeOut(300)` je tražena animacija, a `$(this).remove()` u callbacku izbacuje karticu iz HTML-a tek kad animacija završi.

### Funkcije na `window`

```js
window.format_date = format_date;
window.get_books = get_books;
window.toggle = toggle;
window.remove = remove;
window.render_books = render_books;
```

**Zašto:** skripta je modul (`type="module"`), pa njezine funkcije nisu globalne. Ovako su dostupne testovima i konzoli preglednika.

</details>
