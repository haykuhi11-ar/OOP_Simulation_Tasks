class PaymentProcess { 
    constructor() { 
        if (new.target  === PaymentProcess) {
            throw new TypeError('Cannot instantiate interface directly.');
        }
    }

    pay() {
        throw new TypeError('Method pay() must be implemented.');
    }

    refund() {
        throw new TypeError('Method refund() must be implemented.');
    }

    getStatus() {
        throw new TypeError('Method getStatus() must be implemented.');
    }
}

class StripePayment extends PaymentProcess { 
    
    constructor() {
        super();
        this.id = 1;
        this.transaction = {};
    }

    pay(amount) {
        const id = this.id++;
        this.transaction[id] = {id, amount, status: "paid"};
        console.log(`Stripe Payment : Paid ${amount}`);
        return id;
    } 

    refund(id) {
        if (!this.transaction[id]) {
            return false;
        }
        this.transaction[id].status = "refunded";
        console.log(`Stripe Payment : Refunded : ID ${id}`);
        return true;
    } 

    getStatus(id) {
        return this.transaction[id] ? this.transaction[id] : "Transactions not found.";
    }
}

class PayPalPayment extends PaymentProcess {
    
    constructor() {
        super();
        this.store  = {};
        this.id = 1;
    }

    pay(amount) {
        const id = this.id++;
        this.store[id] = {id,  amount, status: "paid"};
        console.log(`PayPal Payment: Paid ${amount}`);
        return id;
    }

    refund(id) {
        if (!this.store[id]) {
            return false;
        }
        this.store[id].status = "refunded";
        console.log(`PayPal Payment : Refunded : ID ${id}`);
        return true;
    } 

    getStatus(id) {
        return this.store[id] ? this.store[id] : "store is not found";
    }
}

class PaymentService {
    constructor() {
        this.providers = {
            stripe: new StripePayment(),
            paypal: new PayPalPayment(),
        };
    }

    makePayment(amount, type) {
        return this.providers[type].pay(amount);
    }

    refundPayment(id, type) {
       return this.providers[type].refund(id);
    }

    checkStatus(id, type) {
        return this.providers[type].getStatus(id);
    }
}

const paymentService = new PaymentService();
const id1 = paymentService.makePayment(30_000, "stripe");
const id2 = paymentService.makePayment(36_000, "paypal");

paymentService.refundPayment(id1, "stripe");
paymentService.refundPayment(id2, "paypal");

console.log(paymentService.checkStatus(id1, "stripe"));
console.log(paymentService.checkStatus(id2, "paypal"));