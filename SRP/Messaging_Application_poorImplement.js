class MessagingOperation {
    static messageId = 1;
    constructor(sender, receiver, content) {
        this.validateMessage(content, 'message is not valid');

        this.messageId = MessagingOperation.messageId++;
        this.sender = sender;
        this.receiver = receiver;
        this.timestamp = new Date();
        this.content = content;
        this.isRead = false;
    }

    validateMessage(value, message) {
        if (!value || typeof value !== 'string' || value.length > 250) {
            throw new InvalidMessageError(message);
        }
    }

    send(conversation) {
        this.sender.isOnline = true;
        conversation.history.push(this);
    }

    delete(conversation) {
        conversation.history = conversation.history.filter(
            msg => msg.messageId !== this.messageId
        );
    }

    markRead() {
        this.isRead = true;
    }

    markUnread() {
        this.isRead = false;

    }

    notify(receiver) {
        if (receiver.isOnline) {
            console.log(`Notify ${receiver.name}: new message from ${this.name.sender}`);
        }
    }
}

class User {
    constructor(name, contactInfo) {

        this.validateUserName(name, 'Invalid user name');
        this.validateContactInfo(contactInfo, 'Invalid contact info');

        this.name = name;
        this.contactInfo = contactInfo;
        this.conversations = [];
        this.isOnline = false;
    }

    validateUserName(value, message) {
        const name = /^[A-Za-z].{1,10}$/;
        if (!value || typeof value !== 'string' || !(name.test(value))) {
            throw new ValidationError(message);
        }
    }

    validateContactInfo(value, message) {
        const phone = /^\+?[1-9][0-9]{7,14}$/;
        const email =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value || typeof value !== 'string' || !(email.test(value) || (phone.test(value)))) {
            throw new ValidationError(message);
        }
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

const chat1 = alice.createConversation([bob]);

const message1 = new MessagingOperation(alice, bob, 'Hello Bob');
message1.send(chat1);
message1.markRead();

const message2 = new MessagingOperation(bob, alice, 'Hi Alice!');
message2.send(chat1);
message2.markRead();

chat1.addUser(charlie);
const message3 = new MessagingOperation(bob, charlie, 'Welcome Charlie!');
message3.send(chat1);

console.log(chat1.getHistory());
