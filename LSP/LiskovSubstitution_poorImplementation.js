class Library {
    constructor() {
        this.books = [];
        this.users = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    registerUser(user) {
        this.users.push(user);
    }

    borrowBook(user, book) {
        user.borrowBook(book);
    }

    returnBook(user, book) {
       user.returnBook(book);
    }
}

class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
        this.isAvailable = true;
    }

    borrow() {
        this.isAvailable = false;
    }

    return() {
        this.isAvailable = true;
    }
}

class User {
    constructor(name) {
        this.name = name;
        this.borrowedBooks = [];
    }

    borrowBook(book) {
        book.borrow();
        this.borrowedBooks.push(book);
    }

    returnBook(book) {
        this.borrowedBooks = this.borrowedBooks.filter(b => b !== book);
        book.return();
    }
}

class RegularUser extends User {

    borrowBook(book) {
        if (this.borrowedBooks.length >= 2) {
            console.log('Regular user cannot borrow more than 2 books');
            return;
        }
        if (book.isAvailable === false) {
            console.log(`${book.title} is already borrowed`);
            return;
        }
        book.borrow();
        this.borrowedBooks.push(book);
    }

    returnBook(book) {
        this.borrowedBooks.filter(b => b !== book);
        book.return();
    }
}

class PremiumUser extends User {
    borrowBook(book) {
        if (this.borrowedBooks.length >= 5) {
            console.log('Premium user cannot borrow more than 5 books');
            return;
        }
        if (book.isAvailable === false) {
            console.log(`${book.title} is already borrowed`);
            return;
        }
        book.borrow();
        this.borrowedBooks.push(book);
    }

    returnBook(book) {
        book.return();
    }
}

const library = new Library();

const book1 = new Book('The Hobbit', 'J.R.R. Tolkien');
const book2 = new Book('Fahrenheit 451', 'Ray Bradbury');
const book3 = new Book('Pride and Prejudice', 'Jane Austen');
const book4 = new Book('To Kill a Mockingbird', 'Harper Lee');

const annet = new PremiumUser('Annet');
const bob = new RegularUser('Bob');

library.addBook(book1);
library.addBook(book2);
library.addBook(book3);
library.addBook(book4);

library.registerUser(annet);
library.registerUser(bob);

library.borrowBook(annet, book3);
library.borrowBook(bob, book1);
library.borrowBook(bob, book2);
library.borrowBook(bob, book4);

library.returnBook(bob, book2);

