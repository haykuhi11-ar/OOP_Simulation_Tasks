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
        if (!this.books.includes(book)) {
            throw new BookError('book is not found');
        }
        user.borrowBook(book);
    }

    returnBook(user, book) {
        if (user.borrowedBooks.includes(book)) {
            user.returnBook(book);
        } else {
            throw new BookError(`${user.name} has not borrowed ${book.title}`);
        }
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

    borrowBook() {
        throw new TypeError('Abstract method borrowBook() must be implemented');
    }

    returnBook(book) {
        this.borrowedBooks = this.borrowedBooks.filter(b => b !== book);
        book.return();
    }
}

class RegularUser extends User {

    borrowBook(book) {
        if (this.borrowedBooks.length >= 2) {
            throw new RegularUserLimitError('Regular user cannot borrow more than 2 books');
        }
        if (book.isAvailable === false) {
            throw new BookError(`${book.title} is already borrowed`);
        }
        book.borrow();
        this.borrowedBooks.push(book);
    }
}

class PremiumUser extends User {
    borrowBook(book) {
        if (this.borrowedBooks.length >= 5) {
            throw new PremiumUserLimitError('Premium user cannot borrow more than 5 books');
        }
        if (book.isAvailable === false) {
            throw new BookError(`${book.title} is already borrowed`);
        }
        book.borrow();
        this.borrowedBooks.push(book);
    }
}

class BookError extends Error {
    constructor(message){
        super(message);
        this.name = 'BookError';
    }
}

class RegularUserLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RegularUserLimitError';
    }
}

class PremiumUserLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PremiumUserLimitError';
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

try {
    library.borrowBook(bob, book4);
} catch (error) {
    console.log(error.name);
    console.log(error.message);
}

library.returnBook(bob, book2);

