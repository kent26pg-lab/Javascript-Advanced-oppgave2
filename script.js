const key = "booklog";
// Henter bøker fra localStorage
function getBooks() {
  return JSON.parse(localStorage.getItem(key)) || [];
}
// Lagrer bøker til localStorage
function savedBooks(books) {
  localStorage.setItem(key, JSON.stringify(books));
}
// Her har jeg satt addEventListener til når jeg klikker på legg til knappen
document.getElementById("addBtn").addEventListener("click", addBook);
// Denne koden kjøres når man trykker på legg til knappen
function addBook() {
  const tittel = document.getElementById("titleInput").value.trim();
  // Stopper funskjonen vis man ikke har lagt til noen tittel i feltet
  if (!tittel) {
    // Da popper denne meldingen opp i nettleseren vis tittelen er tom!
    alert("Tittel er påkrevd");
    return;
  }

  const books = getBooks();
  // some() sjekker om boken allerede finnes i arrayet
  const bokExists = books.some(
    (book) => book.title.toLowerCase() === tittel.toLowerCase(),
  );
  // Stopper funskjonen vis bok tittelen finnes i arrayet og gir brukeren en melding om at denne boken er allerede registrert
  if (bokExists) {
    alert("Denne boken er allerede registrert!");
    return;
  }
  // Legger til den nye boka med de forsjellige verdiene lageret i et Array
  books.push({
    id: Date.now(),
    title: document.getElementById("titleInput").value.trim(),
    author: document.getElementById("authorInput").value.trim(),
    genre: document.getElementById("genreInput").value.trim(),
    rating: document.getElementById("ratingInput").value,
    pages: document.getElementById("pageInput").value,
    pagesRead: document.getElementById("pagesReadInput").value,
    favoritt: false,
  });

  savedBooks(books);
  showBooks();

  // Tømmer inputfeltene etter at boken er lagt til
  titleInput.value = "";
  authorInput.value = "";
  genreInput.value = "";
  ratingInput.value = "";
  pageInput.value = "";
  pagesReadInput.value = "";
}
// Viser bøkene i tabellen
function showBooks() {
  const books = getBooks();

  // map() lager en tabellrad for hver bok etter verdiene i arrayet
  // destructuring henter ut verdiene fra hvert bokobjekt
  document.getElementById("tableBody").innerHTML =
    books
      .map(
        ({ id, title, author, genre, rating, pages, pagesRead, favoritt }) => `
      <tr>
        <td>${title}</td>
        <td>${author || "–"}</td>
        <td>${genre || "–"}</td>
        <td>${"⭐".repeat(rating) || "–"}</td>
        <td>${pagesRead || "0"} / ${pages || "–"}</td>
        <td><button class="favoritBtn" data-id="${id}">${favoritt ? "★" : "☆"}</button></td>
        <td><button class="deleteBtn" data-id="${id}">Slett</button></td>
        <td><button class="editBtn" data-id="${id}">Rediger</button></td>
      </tr>
    `,
      )
      .join("") || "<tr><td colspan='7'>Ingen bøker ennå.</td></tr>";
}

// Lytter etter klikk på hele tabellen, ikke en enkelt knapp.
document.getElementById("tableBody").addEventListener("click", function (e) {
  // Henter id fra knappen som ble trykket
  const id = Number(e.target.dataset.id);

  // Sjekker om favoritt knappen ble trykket
  if (e.target.classList.contains("favoritBtn")) {
    toggleFavoritt(id);
  }

  // Sjekker om slett knappen ble trykket
  if (e.target.classList.contains("deleteBtn")) {
    deleteBook(id);
  }

  // Sjekker om rediger knappen ble trykket
  if (e.target.classList.contains("editBtn")) {
    const newPages = prompt("Hvor mange sider har du lest?");
    if (newPages === null) return;

    // Henter boken som ble trykket på
    const bok = getBooks().find((b) => b.id === id);

    // Sjekker om nyeSider er større enn totalt antall sider
    if (Number(newPages) > Number(bok.pages)) {
      alert(`Boken har bare ${bok.pages} sider!`);
      return;
    }
    
    // Sjekker om at det ikke er bokstaver som blir entret når man oppgir ny side value
    if (isNaN(newPages) || newPages === "") {
      alert("Du kan bare skrive tall!");
      return;
    }

    if (Number(newPages) < 0) {
      alert("Du kan ikke skrive minus!");
      return;
    }


    const books = getBooks().map((b) =>
      b.id === id ? { ...b, pagesRead: newPages } : b,
    );
    savedBooks(books);
    showBooks();
  }
});

// Sletter en bok med hjelp av filter()
function deleteBook(id) {
  const books = getBooks().filter((b) => b.id !== id);
  savedBooks(books);
  showBooks();
}

// Toggler favoritt med map()
function toggleFavoritt(id) {
  const books = getBooks().map((b) =>
    b.id === id ? { ...b, favoritt: !b.favoritt } : b,
  );
  savedBooks(books);
  showBooks();
}

// Hindrer bokstaver i sider feltene
document.getElementById("pageInput").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Hindrer bokstaver i sider lest feltet
document
  .getElementById("pagesReadInput")
  .addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

showBooks();
console.log(getBooks());
