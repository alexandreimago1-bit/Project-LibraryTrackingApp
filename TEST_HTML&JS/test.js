// ============================================================
// LIBRARY TRACKER — DATA / STATE
// ============================================================
//
// `library` is the current state of our application.
//
// Each book is represented as an object containing:
// - title
// - author
// - pages
// - status
//
// CURRENTLY:
// The library only exists in JavaScript memory.
//
// LATER:
// This state will eventually come from a backend/database
// instead of being permanently stored in this JS array.
// ============================================================

// let library = [
//   {
//     title: "Three Men in a Boat",
//     author: "Jerome K. Jerome",
//     pages: 185,
//     status: "tbr"
//   },
//   {
//     title: "The Three Musketeers",
//     author: "Alexandre Dumas",
//     pages: 830,
//     status: "tbr"
//   },
//   {
//     title: "The Book of Three",
//     author: "Lloyd Alexander",
//     pages: 224,
//     status: "tbr"
//   }
// ];


// ============================================================
// LIBRARY STATE FUNCTIONS
// ============================================================
//
// These functions do NOT directly change the DOM.
//
// Their job is to receive the current library and return
// an updated version of it.
//
// This separates:
//     DATA / STATE
// from:
//     UI / DOM
//
// This separation will become very important when the project
// eventually connects to a backend and database.
// ============================================================


// ------------------------------------------------------------
// startReading()
// Changes a book's status from "tbr" to "reading".
// ------------------------------------------------------------

function startReading(library, title) {

  const updated = library.map(book => {

    if (book.title == title) {

      return {
        ...book,
        status: "reading"
      };

    } else {

      return book;

    }
  });
saveLibrary(updated)
  return updated;
}


// ------------------------------------------------------------
// finishedReading()
// Changes a book's status from "reading" to "finished".
// ------------------------------------------------------------

function finishedReading(library, title) {

  const updated = library.map(book => {

    if (book.title == title) {

      return {
        ...book,
        status: "finished"
      };

    } else {

      return book;

    }
  });
  saveLibrary(updated)
  return updated;
}


// ------------------------------------------------------------
// removeBook()
// Creates a new library without the selected book.
//
// `.filter()` is used to keep every book whose title does NOT
// match the title we want to remove.
// ------------------------------------------------------------

function removeBook(library, title) {

  const updated = library.filter(book => book.title !== title);

saveLibrary(updated)

  return updated;
}


// ------------------------------------------------------------
// createBook()
// Creates the standard object structure for a new book.
//
// This is important because every new book added to the
// application should follow the same structure.
//
// The Add Book form will eventually provide these arguments.
//
// Form:
//     title + author + pages
//          ↓
//     createBook()
//          ↓
//     book object
// ------------------------------------------------------------

function createBook(title, author, pages) {

  return {
    id: crypto.randomUUID ,
    title: title,
    author: author,
    pages: pages,
    status: "tbr"
  };
}


// ------------------------------------------------------------
// addBook()
// Receives the current library and a new book.
//
// Creates a new array containing:
//     all existing books + the new book
//
// This is the function the Add Book form now uses.
// ------------------------------------------------------------

function addBook(library, book) {

  const newLib = [...library, book];
  saveLibrary(newLib);
  return newLib;
}


// ============================================================
// INITIAL TEST BOOK
// ============================================================
//
// This was part of our earlier Library Tracker development.
//
// It demonstrates that createBook() and addBook() can be used
// independently of the HTML form.
//
// We can eventually remove/change test data as the project
// develops.
// ============================================================

// const newBook = createBook("Frankenstein", "Mary Shelley", 288);

// library = addBook(library, newBook);


// ============================================================
// DOM / UI
// ============================================================
//
// The functions below are responsible for displaying the
// library state on the webpage.
//
// Important distinction:
//
// STATE:
//     library
//
// UI:
//     what the user sees in the browser
//
// renderLibrary() takes the current state and turns it into
// DOM elements.
// ============================================================


// ------------------------------------------------------------
// renderLibrary()
// Displays every book currently inside the library array.
//
// IMPORTANT CONCEPT:
// Before rendering, the container is cleared.
//
// Without clearing it first, every re-render would append
// another copy of the books and cause duplicate rendering.
// ------------------------------------------------------------

function renderLibrary(library) {

  // Find the HTML element where books will be displayed.
  const libraryContainer = document.getElementById("library");

  // Clear the previous UI so we can render a fresh version.
  libraryContainer.textContent = "";


  // ----------------------------------------------------------
  // Loop through every book in the current library.
  //
  // `for...of` gives us each book object one at a time.
  // ----------------------------------------------------------

  for (const book of library) {

    // Create a new div for this particular book.
    const bookElement = document.createElement("div");

    // Put the book div inside the library container.
    libraryContainer.appendChild(bookElement);

    // Display information from the book object.
    bookElement.textContent =
      `${book.title} - ${book.author} - ${book.pages} - ${book.status}`;


    // --------------------------------------------------------
    // BOOK STATUS BUTTON
    //
    // The button's text depends on the current status.
    // --------------------------------------------------------

    const bookBtn = document.createElement("button");


    if (book.status == "tbr") {

      bookBtn.textContent = "Start Reading";
      bookElement.appendChild(bookBtn);

    } else if (book.status == "reading") {

      bookBtn.textContent = "Finish";
      bookElement.appendChild(bookBtn);

    } else if (book.status == "finished") {

      bookBtn.textContent = "Read Again";
      bookElement.appendChild(bookBtn);

    }


    // --------------------------------------------------------
    // STATUS BUTTON EVENT
    //
    // Clicking this button changes the book's status.
    //
    // Flow:
    //
    // button click
    //      ↓
    // startReading() / finishedReading()
    //      ↓
    // updated library
    //      ↓
    // renderLibrary()
    //      ↓
    // updated UI
    // --------------------------------------------------------

    bookBtn.addEventListener("click", () => {

      if (book.status == "tbr") {

        library = startReading(library, book.title);

        renderLibrary(library);

      } else if (book.status == "reading") {

        library = finishedReading(library, book.title);

        renderLibrary(library);

      } else if (book.status == "finished") {

        library = startReading(library, book.title);

        renderLibrary(library);

      }

    });


    // --------------------------------------------------------
    // REMOVE BUTTON
    // --------------------------------------------------------

    const removeBtn = document.createElement("button");

    removeBtn.textContent = "Remove";

    bookElement.appendChild(removeBtn);


    // --------------------------------------------------------
    // REMOVE BUTTON EVENT
    //
    // Flow:
    //
    // click Remove
    //      ↓
    // removeBook()
    //      ↓
    // updated library
    //      ↓
    // renderLibrary()
    // --------------------------------------------------------

    removeBtn.addEventListener("click", () => {

      library = removeBook(library, book.title);

      renderLibrary(library);

    });

  }
}


// ============================================================
// ADD BOOK FORM
// ============================================================
//
// THIS IS THE PART WE BUILT TONIGHT.
//
// The form takes user input and turns it into a book object
// that can be inserted into our existing library system.
//
// Current flow:
//
// HTML FORM
//     ↓
// submit event
//     ↓
// preventDefault()
//     ↓
// FormData
//     ↓
// formData.get()
//     ↓
// createBook()
//     ↓
// addBook()
//     ↓
// renderLibrary()
//
// CURRENTLY:
// Everything happens on the frontend.
//
// EVENTUALLY:
//
// Form
//     ↓
// JavaScript
//     ↓
// HTTP POST request
//     ↓
// Backend API
//     ↓
// Database
//
// This is one of the first pieces of the project that will
// eventually connect directly to the full-stack architecture.
// ============================================================


// Find the actual <form> element.
const addBookForm = document.getElementById("addBookForm");


// Listen for the form being submitted.
addBookForm.addEventListener("submit", (event) => {

  // Stop the browser's default form submission behavior.
  //
  // Without this, the browser would normally submit/reload
  // the page instead of letting our JavaScript handle it.
  event.preventDefault();


  // ----------------------------------------------------------
  // FORMDATA
  // ----------------------------------------------------------
  //
  // FormData collects the submitted values from the form.
  //
  // The `name` attribute of each input is important because
  // FormData uses those names as keys.
  //
  // Example:
  //
  // name="book_title"
  //       ↓
  // formData.get("book_title")
  //       ↓
  // "The Hobbit"
  // ----------------------------------------------------------

  const formData = new FormData(event.target);


  // ----------------------------------------------------------
  // CREATE BOOK FROM FORM DATA
  // ----------------------------------------------------------
  //
  // Extract the three form values and pass them into our
  // existing createBook() function.
  //
  // FormData gives ordinary input values to JavaScript as
  // strings, so Number() converts the page count into a number.
  // ----------------------------------------------------------

  const book = createBook(
    formData.get("book_title"),
    formData.get("book_author"),
    Number(formData.get("book_pages"))
  );


  // ----------------------------------------------------------
  // ADD BOOK TO LIBRARY
  //
  // The newly created book is added to our current library
  // state.
  // ----------------------------------------------------------

  library = addBook(library, book);


  // ----------------------------------------------------------
  // RE-RENDER THE UI
  //
  // The library state has changed, so we render the updated
  // library to make the new book appear on the page.
  // ----------------------------------------------------------

  renderLibrary(library);

});

// localStorage.setItem("library",JSON.stringify(library))
// const savedLibrary = localStorage.getItem("library")
// const loadedLibrary = JSON.parse(savedLibrary)

// let bookTitles = loadedLibrary.map(book => book.title)
// console.log(bookTitles);


function saveLibrary(library){
  localStorage.setItem("library",JSON.stringify(library))
}

function loadLibrary(){

  let savedLibrary = localStorage.getItem("library")

    if(savedLibrary == null){
      return []
    }
    let loadedLibrary
    try{
       loadedLibrary = JSON.parse(savedLibrary)
    }catch(error){
      return []
    }
    const validStatuses = ['tbr','finished','reading']
    if (Array.isArray(loadedLibrary)){
      if(loadedLibrary.every(book => 
        typeof book.title == "string" && typeof book.author == "string" && typeof book.pages == "number" && validStatuses.includes(book.status)
      )){
        return loadedLibrary
      }else{
        return []
      }
    }else{
      return []
    }
}
let library = loadLibrary()



localStorage.setItem("library", JSON.stringify([
  {
    title: "Dune",
    author: "Frank Herbert",
    pages: 412,
    status: "banana"
  }
]))
  console.log(library)