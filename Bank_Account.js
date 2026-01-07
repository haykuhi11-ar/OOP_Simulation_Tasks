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
    #balance;
    #transactions = [];
    constructor(balance, transactions, accountNumber, type) {
        if (new.target === BankAccount) throw new TypeError ("Cannot instantiate abstract class BankAccount directly.");

        this.#balance = balance;
        this.#transactions = transactions;
        Object.defineProperty(this, "accountNumber", {
            get() {
                return this._accountNumber;
            },
            set(value) {
                if (value.length === 10) {
                    this._accountNumber = value;
                } else {
                    throw new ValidationError("Invalid accountNumber");
                }
            }
        });
        this.accountNumber = accountNumber;
        this.type = type;
    }
    get AccountBalance () {
        return this.#balance;
    }
    set AccountBalance (value) {
        if (value > 0) {
            this.#balance = value;
        }
    }
    get accountTransactions () {
        return this.#transactions;
    }
    set accountTransactions (value) {
        if (value) {
            this.#transactions = value;
        }
    } 
    deposit(amount) {
        throw new TypeError ("Abstract method deposit() must be implemented.");
    }
    withdraw(amount) {
        throw new TypeError ("Abstract method withdraw() must be implemented.");
    }
    getBalance() {
        throw new TypeError ("Abstract method getBalance() must be implemented.");
    }
    transferFunds(targetAccount, amount, actor) {
        throw new TypeError ("Abstract method transferFunds() must be implemented.");
    }
    getTransactionSummary() {
        for(let i = this.accountTransactions.length - 1; i <= 10; --i) {
            console.log(this.accountTransactions[i]);
        }
    }
    getAllTransactions() {
        for(let i = 0; i < this.accountTransactions.length; ++i) {
           console.log(this.accountTransactions[i]);
        }
    }
}
class IndividualAccount extends BankAccount {
    constructor(balance, transactions, accountNumber, type) {
        super(balance, transactions, accountNumber, type);
        this.type = "individual";
    }
    deposit(amount) {
        if (amount < 0) throw new InvalidTransactionError("Invalid amount");
        this.AccountBalance += amount;
        this.accountTransactions.push(new Transaction(this.accountNumber, amount, 'deposit', new Date(), null, this.accountNumber));
    }
    withdraw(amount) {
        if (this.AccountBalance < amount || amount < 0) throw new InsufficientFundsError("Invalid amount");
        this.AccountBalance -= amount;
        this.accountTransactions.push(new Transaction(this.accountNumber, amount, 'withdraw', new Date(), this.accountNumber, null));
    }
    getBalance() {
        return this.AccountBalance;
    }
    transferFunds(targetAccount, amount) {
        this.withdraw(amount);
        targetAccount.deposit(amount);
        this.accountTransactions.push(new Transaction(this.accountNumber, amount, 'transfer', new Date(), this.accountNumber, targetAccount.accountNumber));
    }
}
class JointAccount extends BankAccount {
    constructor(balance, transactions, accountNumber, type, owners = []) {
        super(balance, transactions, accountNumber, type);
        this.type = "joint";
        this.owners = owners;
    }
    deposit(amount) {
        if (amount < 0) throw new InvalidTransactionError("Invalid amount");
        this.AccountBalance += amount;
        this.accountTransactions.push(new Transaction(this.accountNumber, amount, 'deposit', new Date(), null, this.accountNumber));
    }
    withdraw(amount, owner) {
        if (!this.owners.includes(owner)) throw new AuthorizationError("Unauthorized owner");
        if (this.AccountBalance < amount) throw new InsufficientFundsError("Invalid amount");
        this.AccountBalance -= amount;
        this.accountTransactions.push(new Transaction(this.accountNumber, amount, 'withdraw', new Date(), this.accountNumber, null));
    }
    getBalance(owner) {
        if (this.owners.includes(owner)) {
            return this.AccountBalance;
        }
        else { throw new AuthorizationError("Unauthorized owner"); }
    }
    transferFunds(targetAccount, amount, actor) {
        this.withdraw(amount, actor);
        targetAccount.deposit(amount);
        this.accountTransactions.push(new Transaction(this.accountNumber, amount, 'transfer', new Date(), this.accountNumber, targetAccount.accountNumber));
    }
}
class Customer {
    constructor(name, contactInfo, accounts = []) {
        Object.defineProperty(this, "name", {
            get() {
                return this._name;
            },
            set(value) {
                if (value === "" || typeof value !== 'string') throw new ValidationError("Invalid name");
                this._name = value;
            },
        })
        Object.defineProperty(this, "contactInfo", {
            get() {
                return this._contactInfo;
            },
            set(value) {
                const email = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (typeof value === 'string' && email.test(value)) {
                    this._contactInfo = value;
                } else {
                    throw new ValidationError("Invalid contactInfo");
                }
            },
        });
        this.name = name;
        this.contactInfo = contactInfo;
        this.accounts = accounts;
    }
    addAccount(account) {
        this.accounts.push(account);
    }
    viewAccounts() {
        for(let i = 0; i < this.accounts.length; ++i) {
            console.log(this.accounts[i]);
        }
    }
    viewTransactionHistory(accountNumber) {
        for(let i = 0; i < this.accounts.length; ++i) {
            if (this.accounts[i].accountNumber === accountNumber) {
                this.accounts[i].getAllTransactions();
                return;
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
const account_1 = new IndividualAccount(10_000, [], "1238764590", "individual");
const account_2 = new JointAccount(100_000, [], "1111008887", "joint", ['Annet', 'Bob']);
const customer = new Customer('Bob', 'smith1999@mail.com');
customer.addAccount(account_1);
customer.addAccount(account_2);
account_1.deposit(1_000);
account_2.deposit(20_000);
account_1.withdraw(500);
account_2.withdraw(15_000, 'Annet');
console.log(account_2.getBalance('Bob'));
console.log(account_1.getBalance());
customer.viewAccounts();
console.log(customer.accounts);
account_2.transferFunds(account_1, 10_000, 'Bob');
customer.viewTransactionHistory("1111008887");

