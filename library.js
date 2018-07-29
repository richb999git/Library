// Start /////////////////////
// an array of objects (books)
let myLibrary = [];
setupListeners();
clearNewBookForm(); 
checkForLocalStorage();
render();


function Book(title, author, pages, read) {
  // the constructor...
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}


function toggleRead(index) {
    myLibrary[index].read = !myLibrary[index].read;
    render();
    if (storageAvailable('localStorage')) {
        let str = JSON.stringify(myLibrary[index]);    
        z = "myLibrary"+index;
        localStorage.setItem(z, str)
    } 
}


function addBookToLibrary(e) {
    // validation of entries is done by HTML 5 form
    e.preventDefault(); // prevents submitting to server and causing errors
    var title = document.getElementById("inpTitle").value;
    var author = document.getElementById("inpAuthor").value;
    var pages = document.getElementById("inpPages").value;
    var read = (document.getElementById("inpRead").checked == true) ? true: false;
    if(title == "" || author == "" || pages == "") {
        console.log("IE not validating");
        alert("Missing data");
    } else {
        myLibrary.push(new Book(title, author, pages, read));
        clearNewBookForm();
        render();
        clearLocalStorage();
        saveLibraryToLocalStorage();
    }
}


function deleteBookFromLibrary(index) {
    myLibrary.splice(index, 1);
    render(); 
    clearLocalStorage();
    saveLibraryToLocalStorage();       
}


function clearNewBookForm() {
    document.getElementById("inpForm").reset();
}


function render() {
    var titleEl, authorEl, pagesEl, readOutput, readEl, delEl;
    //this clears the book list on screen ready for it to be put back
    document.getElementById("bookList").innerHTML = '<div id="bookList"></div>';
    // this adds them on in correct order
    myLibrary.forEach (function(book, index) {
        titleEl = '<p class="book bookTitle" id="titleBook' + index + '">' + book.title + '</p>';
        authorEl = '<p class="book bookAuthor" id="authorBook' + index + '">' + book.author + '</p>';
        pagesEl = '<p class="book bookPages" id="pagesBook' + index + '">' + book.pages + '</p>';
        readOutput = (book.read == true) ? "Yep": "Nope";
        readEl = '<a class="book bookRead" id="readBook' + index + '" href="#" >' + readOutput + '</a>';
        delEl = '<a class="book bookDel" id="delBook' + index + '" href="#" >x</a>';  

        document.getElementById("bookList").insertAdjacentHTML('beforeend', titleEl);
        document.getElementById("titleBook" + index).insertAdjacentHTML('afterend', authorEl);
        document.getElementById("authorBook" + index).insertAdjacentHTML('afterend', pagesEl);   
        document.getElementById("pagesBook" + index).insertAdjacentHTML('afterend', readEl);   
        document.getElementById("readBook" + index).insertAdjacentHTML('afterend', delEl);    
    });
    
    myLibrary.forEach (function(book, index) {
        document.getElementById("readBook" + index).addEventListener('click', function() {
            toggleRead(index);
        });
        document.getElementById("delBook" + index).addEventListener('click', function() {
            deleteBookFromLibrary(index);
        });
    });
}


function setupListeners() {
    var el = document.getElementById("inpForm");
    if(el.addEventListener){
        el.addEventListener("submit", function(e) {
                addBookToLibrary(e);
        }, false);                                      //Modern browsers
        console.log("Modern browsers");
    } else if(el.attachEvent){
        el.attachEvent("onsubmit", function(e) {
                addBookToLibrary(e);
        });                                             //Old IE. Should do this for other listeners but it's mostly redundant
        console.log("Old browers");
    }
}

/////////////////////////////// LocaStorage functions //////////////////////////////////////////////////

function clearLocalStorage() {
    if (storageAvailable('localStorage')) {
        for(i=0; i<localStorage.length; i++) {
            z = "myLibrary"+i;
            localStorage.clear(z);
        }
    }
}


function saveLibraryToLocalStorage() {
    if (storageAvailable('localStorage')) {
        myLibrary.forEach(function(book, index){
            let str = JSON.stringify(book);    
            console.log(str);
            z = "myLibrary"+index;
            localStorage.setItem(z, str);
        });
    }
}


function checkForLocalStorage() {
    
    if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
        console.log("LocalStorage available");

        for(i=0; i<localStorage.length; i++) {
            z = "myLibrary"+i;
            x = localStorage.getItem(z);
            console.log(z, x);
            myLibrary[i] = JSON.parse(x);
            console.log(myLibrary[i]);
        }

    }
        else {
            // Too bad, no localStorage for us
            console.log("LocalStorage NOT available");
            // Some sample books when localStorage not available:
            myLibrary[0] = new Book('The Hobbit', 'J.R.R Tolkien', 450, false);
            myLibrary[1] = new Book('The Lord of The Rings', 'J.R.R Tolkien', 1200, true);
            myLibrary[2] = new Book('The Shining', 'Stephen King', 600, true);
            myLibrary[3] = new Book('Christine', 'Stephen King', 800, true)
    }   
}


function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}


// an object for each book in localStorage
// refactor. Thin out ids and classnames if not used 
