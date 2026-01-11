class InsufficientFundsError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InsufficientFundsError";
    }
}

class InvalidTransactionError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidTransactionError";
    }
}

class AuthorizationError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "AuthorizationError";
    }
}

class ValidationError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "ValidationError";
    }
}

class BankAccount {
    #balance = 0;
    #transactions = [];

    constructor(accountNumber) {
        if (new.target === BankAccount) {
            throw new TypeError ("Cannot instantiate abstract class BankAccount directly.");
        }

        Object.defineProperty(this, "accountNumber", {
            get() {
                return this._accountNumber;
            },
            set(value) {
                const accNum = /^\d{10}$/;
                if (typeof value !== "string" || !(accNum.test(value))) {
                    throw new ValidationError("Invalid accountNumber");
                }
                this._accountNumber = value;
            }
        });
        this.accountNumber = accountNumber;
    }

    _changeBalance(amount) {
        this.#balance += amount;
    }

    _addTransaction(transaction) {
        this.#transactions.push(transaction);
    }

    get balance() {
        return this.#balance;
    }
    
    deposit(amount) {
        throw new TypeError ("Abstract method deposit() must be implemented.");
    }

    withdraw(amount) {
        throw new TypeError ("Abstract method withdraw() must be implemented.");
    }

    transferFunds(targetAccount, amount, actor) {
        throw new TypeError ("Abstract method transferFunds() must be implemented.");
    }

    getTransactionSummary(limit = 10) {
        for(let i = this.#transactions.length - 1; i <= limit; --i) {
            return this.#transactions[i];
        }
    }

    getAllTransactions() {
        return [...this.#transactions];
    }
}

class IndividualAccount extends BankAccount {
    constructor(accountNumber) {
        super(accountNumber);
        this.type = "individual";
    }

    deposit(amount) {
        if (typeof amount !== "number" || amount <= 0) {
            throw new InvalidTransactionError("Invalid amount");
        }
        this._changeBalance(amount);
        this._addTransaction(new Transaction(this.accountNumber, amount, 'deposit', new Date(), null));
    }

    withdraw(amount) {
        if (typeof amount !== "number" || this.balance < amount || amount <= 0) {
            throw new InsufficientFundsError("Invalid amount");
        }
        this._changeBalance(-amount);
        this._addTransaction(new Transaction(this.accountNumber, amount, 'withdraw', new Date(), null));
    }

    transferFunds(targetAccount, amount) {
        this.withdraw(amount);
        targetAccount.deposit(amount);
        this._addTransaction(new Transaction(this.accountNumber, amount, 'transfer', new Date(), this.accountNumber, targetAccount.accountNumber));
    }
}

class JointAccount extends BankAccount {
    constructor(accountNumber, owners = []) {
        super(accountNumber);
        this.type = "joint";
        this.owners = owners;
    }

    _authorize(actor) {
        if (!this.owners.includes(actor)) {
            throw new AuthorizationError("Unauthorized owner");
        }
    }

    deposit(amount) {
        if (typeof amount !== "number" || amount < 0) {
            throw new InvalidTransactionError("Invalid amount");
        }
        this._changeBalance(amount);
        this._addTransaction(new Transaction(this.accountNumber, amount, 'deposit', new Date(), null, this.accountNumber));
    }

    withdraw(amount, owner) {
        this._authorize(owner);
        if (typeof amount !== "number" || amount <= 0 || this.balance < amount) {
            throw new InsufficientFundsError("Invalid amount");
        }
        this._changeBalance(-amount);
        this._addTransaction(new Transaction(this.accountNumber, amount, 'withdraw', new Date(), this.accountNumber, null));
    }

    transferFunds(targetAccount, amount, actor) {
        this.withdraw(amount, actor);
        targetAccount.deposit(amount);
        this._addTransaction(new Transaction(this.accountNumber, amount, 'transfer', new Date(), this.accountNumber, targetAccount.accountNumber));
    }
}

class Customer {
    constructor(name, contactInfo) {
        Object.defineProperty(this, "name", {
            get() {
                return this._name;
            },
            set(value) {
                if (value === "" || typeof value !== 'string') {
                    throw new ValidationError("Invalid name");
                }
                this._name = value;
            },
        })
        Object.defineProperty(this, "contactInfo", {
            get() {
                return this._contactInfo;
            },
            set(value) {
                const email = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                const phone = /^0\d{8}$/;
                if (typeof value !== 'string' || !(email.test(value)) && !(phone.test(value))) {
                    throw new ValidationError("Invalid contactInfo");
                } 
                this._contactInfo = value;
            },
        });

        this.name = name;
        this.contactInfo = contactInfo;
        this.accounts = [];
    }

    addAccount(account) {
        this.accounts.push(account);
    }

    viewAccounts() {
        return this.accounts;
    }

    viewTransactionHistory(accountNumber) {
        
        for(let i = 0; i < this.accounts.length; ++i) {
            if (this.accounts[i].accountNumber === accountNumber) {
               return this.accounts[i].getAllTransactions();
            }
        }
        throw new ValidationError("Account not found");
    }
}

class Transaction {
    constructor(accountNumber, amount, transactionType, timestamp, fromAccount, toAccount) {
        this.accountNumber = accountNumber;
        this.amount = amount;
        this.transactionType = transactionType;
        this.timestamp = timestamp;
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
    }
}

const account1 = new IndividualAccount("1238764590");
const account2 = new JointAccount("1111008887", ['Annet', 'Bob']);
const customer = new Customer('Bob', 'smith1999@mail.com');

customer.addAccount(account1);
customer.addAccount(account2);

account1.deposit(1_000);
account2.deposit(20_000);

account1.withdraw(500);
account2.withdraw(15_000, 'Annet');

console.log(account1.balance);
console.log(account2.balance);
console.log(customer.viewAccounts());

account2.transferFunds(account1, 2_000, 'Bob');
console.log(customer.viewTransactionHistory("1111008887"));

