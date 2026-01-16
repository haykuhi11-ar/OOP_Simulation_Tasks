class CoffeeMaker {
    makeCoffee() {
        throw new TypeError('Abstract method makeCoffee');
    }
}

class Baker {
    bakeDessert() {
        throw new TypeError('Abstract method bakeDessert');
    }
}

class Server {
    serveGuest() {
        throw new TypeError('Abstract method serverGuest');
    }
}

class Cashier {
    takePayment() {
        throw new TypeError('Abstract method takePayment');
    }
}

class Barista extends CoffeeMaker {
    makeCoffee() {
        console.log('Barista makes aromatic coffee');
    }
}

class DessertChef extends Baker {
    bakeDessert() {
        console.log('DessertChef creates a delicate dessert');
    }
}

class GuestAssistant extends Server {
    serveGuest() {
        console.log('GuestAssistant welcomes and serves the guest');
    }
}

class PaymentHandler extends Cashier {
    takePayment() {
        console.log('PaymentHandler processes the payment');
    }
}

class CozyCafe {
    constructor(barista, dessertChef, guestAssistant, paymentHandler) {
        this.barista = barista;
        this.dessertChef = dessertChef;
        this.guestAssistant = guestAssistant;
        this.paymentHandler = paymentHandler;
    }

    processOrder() {
        this.barista.makeCoffee();
        this.dessertChef.bakeDessert();
        this.guestAssistant.serveGuest();
        this.paymentHandler.takePayment();
    }
}

const cafe = new CozyCafe(
    new Barista(),
    new DessertChef(),
    new GuestAssistant(),
    new PaymentHandler()
);
cafe.processOrder();