export function createBook(title, author, pages){
    return {
        id: crypto.randomUUID(),
        title: title,
        author: author,
        pages: pages,
        status: "tbr"
    };
}

export function addBook(library, book){
    return [...library, book];
}

export function startReading(library, id) {
    return library.map(book =>
        book.id === id ? {...book, status: "reading"} : book
    );
}

export function finishedReading(library, id){
    return library.map(book => 
        book.id === id ? {...book, status: 'finished'}: book
    )
}

export function removeBook(library, id){
    return library.filter(book => book.id !== id);
}

export function saveLibrary(library){
    localStorage.setItem("library", JSON.stringify(library));
}
export function loadLibrary(){
    const savedLibrary = localStorage.getItem("library")
    if (savedLibrary == null) return [];

    let loadedLibrary;
    try{
        loadedLibrary = JSON.parse(savedLibrary);
    }catch{
        return[]
    }

    const validStatuses = ["tbr","reading","finished"];
    if (!Array.isArray(loadedLibrary)) return [];

    const isValid = loadedLibrary.every(book =>
        typeof book.id === "string" &&
        typeof book.title === "string" &&
        typeof book.author === "string" &&
        typeof book.pages === "number" &&
        validStatuses.includes(book.status)
    );
    return isValid? loadedLibrary : [];
}