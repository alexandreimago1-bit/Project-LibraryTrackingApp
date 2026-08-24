// library learning
let library = [{title: "Three Men in a Boat",
                  author: "Jerome K. Jerome",  
                  pages: 185,
                  status: "tbr"},
                {title: "The Three Musketeers",
                  author: "Alexandre Dumas",  
                  pages: 830,
                  status: "tbr"},
                {title: "The Book of Three",
                  author: "Lloyd Alexander",  
                  pages: 224,
                  status: "tbr"}]

function startReading(library,title){
  const updated = library.map(book => {
    if (book.title == title){
      return {
  ...book,
  status: "reading"
}
    }else {
      return book
    }
  })
  return updated
}

function finishedReading(library,title){
  const updated = library.map(book => {
    if (book.title == title){
      return {
  ...book,
  status: "finished"
}
    }else {
      return book
    }
  })
  return updated
}

function removeBook(library, title){
  const updated = library.filter(book => book.title !== title)
  return updated
}

function createBook(title,author,pages){
  return  {
    title: title,
    author: author,
    pages: pages,
    status: "tbr"
  }
}


function addBook(library,book){
  
  const newLib = [...library, book]
  return newLib
}

const newBook = createBook("Frankenstein","Mary Shelley",288)
library = addBook(library,newBook)

// dom with library learning

// const libraryContainer = document.getElementById("library")
// const bookElement = document.createElement("div")

// libraryContainer.appendChild(bookElement)
// bookElement.textContent = `${library[0].title} - ${library[0].author}`



function renderLibrary(library){
    // creates the library container with an empty string so that we have a fresh slate and it doesn't duplicate 
    const libraryContainer = document.getElementById("library")
    libraryContainer.textContent = ""
// for of loop to loop through the array we created. 
for (const book of library){
    const bookElement = document.createElement("div")  // creates a new div for every element
    libraryContainer.appendChild(bookElement) // appends the div
    bookElement.textContent = `${book.title} - ${book.author} - ${book.pages} - ${book.status}` // displays the object properties in the website
    const bookBtn = document.createElement("button") // button for changing the status of our books
    if (book.status == "tbr"){
    bookBtn.textContent = "Start Reading"
        bookElement.appendChild(bookBtn)

}else if (book.status == "reading"){
    bookBtn.textContent = "Finish"
        bookElement.appendChild(bookBtn)

}else if (book.status == "finished"){
    bookBtn.textContent = "Read Again"
        bookElement.appendChild(bookBtn)
}
    // button for starting reading and finishing reading to change the status 
    bookBtn.addEventListener("click",() => {
           if (book.status == "tbr"){
                library = startReading(library,book.title)
                renderLibrary(library)
            }else if (book.status == "reading"){
                
                library = finishedReading(library,book.title)
                renderLibrary(library)
            }else if (book.status == "finished"){
                library = startReading(library,book.title)
                renderLibrary(library)
            }
    })
const removeBtn = document.createElement('button')
removeBtn.textContent = "Remove"
bookElement.appendChild(removeBtn)
removeBtn.addEventListener("click",() => {
    library = removeBook(library,book.title)
    renderLibrary(library)
})
}
}
renderLibrary(library)



    