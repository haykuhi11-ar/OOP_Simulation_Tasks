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
    constructor(PaymentProcess) {
        this.paymentProcess = PaymentProcess; 
    }

    makePayment(amount) {
        return this.paymentProcess.pay(amount);
    }

    refundPayment(id) {
        return this.paymentProcess.refund(id);
    }

    checkStatus(id) {
        return this.paymentProcess.getStatus(id);
    }
}


const stripe = new StripePayment();
const paypal = new PayPalPayment();

const stripeService = new PaymentService(stripe);
const paypalService = new PaymentService(paypal);

const id1 = stripeService.makePayment(30_000);
const id2 = paypalService.makePayment(36_000);

stripeService.refundPayment(id1);
paypalService.refundPayment(id2);

console.log(stripeService.checkStatus(id1));
console.log(paypalService.checkStatus(id2));