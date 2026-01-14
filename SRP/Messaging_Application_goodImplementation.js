class MessagingOperation {
    static messageId = 1;

    constructor(sender, receiver) {
        if (new.target === MessagingOperation) {
            throw new TypeError('Cannot instantiate abstract class MessagingOperation directly');
        }

        this.messageId = MessagingOperation.messageId++;
        this.sender = sender;
        this.receiver = receiver;
        this.timestamp = new Date();
    }
}

class MessageService {
    
    static send(message, conversation) {
        conversation.history.push(message);
        MessageService.notify(message.sender, message);
    }

    static delete(message, conversation) {
        conversation.history = conversation.history.filter(
            msg => msg.messageId !== message.messageId
        );
    }

    static notify(receiver, message) {
        if (receiver.isOnline) {
            console.log(`Notify ${receiver.name}: new message from ${message.sender.name}`);
        }
    }
}

class TextMessage extends MessagingOperation {
    constructor(sender, receiver, message) {
        super(sender, receiver)
        this.isRead = false;

        validations.validateMessage(message, 'Invalid message');
        this.message = message;
    }

    markRead() {
        this.isRead = true;
    }

    markUnread() {
        this.isRead = false;
    }
}

class User {
    constructor(name, contactInfo) {
        validations.validateUserName(name, 'Invalid user name');
        validations.validateContactInfo(contactInfo, 'Invalid contact info');

        this.name = name;
        this.contactInfo = contactInfo;
        this.conversations = [];
        this.isOnline = false;
    }

    userIsOnline() {
        this.isOnline = true;
    }

    userIsOffline() {
        this.isOnline = false;
    }

    createConversation(users) {
        if (!Array.isArray(users) || users.length === 0) {
            throw new ValidationError('At least one user must be provided');
        }
        if (!users.includes(this)) {
            users.push(this);
        }
        const conversation = new Conversation(users);
        users.forEach(user => user.conversations.push(conversation));
        return conversation;
    }
}

class Conversation {
    constructor(users = []) {
        this.users = users;
        this.history = [];
    }

    addUser(user) {
        if(!user) {
            throw new UserNotFoundError('User not found');
        }
        if (!this.users.includes(user)) {
            this.users.push(user);
        }
    }

    getHistory(limit = 10) {
        return this.history.slice(-limit);
    }
}

const validations = {
    validateMessage(value, message) {
        if (!value || typeof value !== 'string' || value.length > 250) {
            throw new InvalidMessageError(message);
        }
    },

    validateContactInfo(value, message) {
        const phone = /^\+?[1-9][0-9]{7,14}$/;
        const email =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value || typeof value !== 'string' || !(email.test(value) || (phone.test(value)))) {
            throw new ValidationError(message);
        }
    },

    validateUserName(value, message) {
        const name = /^[A-Za-z].{1,10}$/;
        if (!value || typeof value !== 'string' || !(name.test(value))) {
            throw new ValidationError(message);
        }
    }
}

class InvalidMessageError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidMessageError';
    }
}

class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

const alice = new User('Alice', 'alice@gmail.com');
const bob = new User('Bob', '+1234567890');
const charlie = new User('Charlie', 'charlie-4@mail.com');

alice.userIsOnline();
bob.userIsOnline();
charlie.userIsOffline();

const chat1 = alice.createConversation([bob]);

const message1 = new TextMessage(alice, bob, 'Hello Bob');
MessageService.send(message1, chat1);
message1.markRead();

const message2 = new TextMessage(bob, alice, 'Hi Alice!');
MessageService.send(message2, chat1);
message2.markRead();

chat1.addUser(charlie);
const message3 = new TextMessage(bob, charlie, 'Welcome Charlie!');
MessageService.send(message3, chat1);

console.log(chat1.getHistory());
