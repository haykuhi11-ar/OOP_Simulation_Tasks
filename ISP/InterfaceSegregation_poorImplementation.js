class CafeEmployee {
    makeCoffee() {
        throw new TypeError('Abstract method makeCoffee');
    }

    bakeDessert() {
        throw new TypeError('Abstract method bakeDessert');
    }

    serveGuest() {
        throw new TypeError('Abstract method serverGuest');
    }

    takePayment() {
        throw new TypeError('Abstract method takePayment');
    }
}

class Barista extends CafeEmployee {
    makeCoffee() {
        console.log('Barista makes aromatic coffee');
    }

    bakeDessert() {
        throw new TypeError('Barista cannot bake dessert');
    }

    serveGuest() {
        throw new TypeError('Barista does not serve guests');
    }

    takePayment() {
        throw new TypeError('Barista does not take payments');
    }
}

class DessertChef extends CafeEmployee {
    makeCoffee() {
        throw new TypeError('DessertChef does not make coffee');
    }

    bakeDessert() {
        console.log('DessertChef creates a delicate dessert');
    }

    serveGuest() {
        throw new TypeError('DessertChef does not serve guests');
    }

    takePayment() {
        throw new TypeError('DessertChef does not take payments');
    }
}

class GuestAssistant extends CafeEmployee {
    makeCoffee() {
        throw new TypeError('GuestAssistant does not make coffee');
    }

    bakeDessert() {
        throw new TypeError('GuestAssistant cannot bake dessert');
    }

    serveGuest() {
        console.log('GuestAssistant welcomes and serves the guest');
    }

    takePayment() {
        throw new TypeError('GuestAssistant does not take payments');
    }
}

class PaymentHandler extends CafeEmployee {
    makeCoffee() {
        throw new TypeError('PaymentHandler does not make coffee');
    }

    bakeDessert() {
        throw new TypeError('PaymentHandler cannot bake dessert');
    }

    serveGuest() {
        throw new TypeError('PaymentHandler does not serve guests');
    }

    takePayment() {
        console.log('PaymentHandler processes the payment');
    }
}

const barista = new Barista();
barista.makeCoffee();
barista.takePayment();