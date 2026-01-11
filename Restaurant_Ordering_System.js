class DishNotFoundError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "DishNotFoundError";
    }
}

class InvalidOrderError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidOrderError";
    }
}

class Menu {
    #dishes;

    constructor() {
        if (new.target === Menu) {
            throw new TypeError("Cannot instantiate abstract class Menu diractly");
        }
        this.#dishes = new Map();
    }
    get dishes() {
        return this.#dishes;
    }

    addDish(dish) {
        if (!dish || !dish.name) {
            throw new InvalidOrderError("Invalid dish");
        }
        if (this.#dishes.has(dish.name)) {
            throw new DishNotFoundError(`${dish.name} already exists in menu.`);
        }
        this.#dishes.set(dish.name, dish);
    }

    removeDish(dishName) {
        if (!this.#dishes.has(dishName)) {
            throw new DishNotFoundError(`${dishName} not found`);
        }
        this.#dishes.delete(dishName);
    }

    viewMenu() {
       throw new TypeError("Abstract method viewMenu() must be implemented");
    }

    increasePrice(dishName, percent) {
        const dish = this.#dishes.get(dishName);
            if (!dish) {
                throw new DishNotFoundError(`${dishName} not found`);
            }
                dish.price += dish.price * (percent / 100);
    }

    decreasePrice(dishName, percent) {
        const dish = this.#dishes.get(dishName);
            if (!dish) {
                throw new DishNotFoundError(`${dishName} not found`);
            }
                dish.price -= dish.price * (percent / 100);
    }

    applyDemandPricing(popularDishNames, percent) {
         for(const name of popularDishNames) {
            if (this.#dishes.has(name)) {
                this.increasePrice(name, percent);
            }
        }
    }
}

class AppetizersMenu extends Menu {
    viewMenu() {
        console.log("------Appetizers------");
        return [...this.dishes].map(
            ([name, dish]) => `${name}: $${dish.price}`
        );
    }
}

class EntreesMenu extends Menu {
    viewMenu() {
        console.log("--------Entrees--------");
        return [...this.dishes].map(
            ([name, dish]) => `${name}: $${dish.price}`
        );  
   }
}

class DessertsMenu extends Menu {
    viewMenu() {
        console.log("---------Desserts--------");
        return [...this.dishes].map(
            ([name, dish]) => `${name}: $${dish.price}`
        );
   }
}

class Dish {
    constructor(name, price) {
        if (typeof name !== "string" || name.trim() === "") {
            throw new InvalidOrderError("Invalid dish name");
        }
        if (typeof price !== "number" || price <= 0) {
            throw new InvalidOrderError("Invalid dish price");
        }
        this.name = name;
        this.price = price;
    }
}

class Appetizer extends Dish {}
class Entree extends Dish {}
class Dessert extends Dish {}

class Customer {
    constructor(name, contactInfo) {
        Object.defineProperty(this, "name", {
            get() {
                return this._name;
            },
            set(value) {
                if (typeof value !== "string" || value.trim() === "") {
                    throw new Error("Invalid name");
                } 
                this._name = value;
            }
        });

        Object.defineProperty(this, "contactInfo", {
            get() {
                return this._contactInfo;
            },
            set(value) {
                const phone = /^0\d{8}$/;
                const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!phone.test(value) && !email.test(value)) {
                    throw new InvalidOrderError(`Invalid contact info`);
                }
                this._contactInfo = value;
            }
        });

        this.name = name;
        this.contactInfo = contactInfo;
        this.orderHistory = [];
    }

    placeOrder(order) {
        this.orderHistory.push(order);
    }

    viewOrderHistory() {
       return this.orderHistory.map(
        order => `${order.customer.name} : ${order.getTotal()}`
       );
    }
}

class Order {
    #totalPrice = 0;

    constructor(customer) {
        this.customer = customer;
        this.dishes = [];
    }

    get totalPrice() {
        return this.#totalPrice;
    }

    addDish(dishName, menus) {
        if (typeof dishName !== "string") {
            throw new InvalidOrderError("Invalid dish name");
        }
        for(const menu of menus) {
            if (menu.dishes.has(dishName)) {
                const dish = menu.dishes.get(dishName);
                this.dishes.push(dish);
                this.#totalPrice += dish.price;
                return;
            }
        }
        throw new InvalidOrderError(`${dishName} not found`);
    }

    getTotal() {
      return  this.dishes.reduce((sum, dish) => sum + dish.price, 0);
    }

    viewSummary() {
        return this.dishes.map(dish => `${dish.name} : $${dish.price}`
        );
    }
}

const appetizerMenu = new AppetizersMenu();
const entreesMenu = new EntreesMenu();
const dessertsMenu = new DessertsMenu();

appetizerMenu.addDish(new Appetizer("Salad", 50));
appetizerMenu.addDish(new Appetizer("Soup", 40));
entreesMenu.addDish(new Entree("Chicken", 70));
entreesMenu.addDish(new Entree("Fish", 120));
dessertsMenu.addDish(new Dessert("Cake", 35));
dessertsMenu.addDish(new Dessert("Ice Cream", 25));

console.log(appetizerMenu.viewMenu());
console.log(entreesMenu.viewMenu());
console.log(dessertsMenu.viewMenu());

const customer1 = new Customer("Annet", "094786543");
const customer2 = new Customer("Bob", "094672312");
const order1 = new Order(customer1);
const order2 = new Order(customer2);

order1.addDish("Salad", [appetizerMenu, entreesMenu,dessertsMenu]);
order2.addDish("Fish", [appetizerMenu, entreesMenu,dessertsMenu]);
order1.addDish("Ice Cream", [appetizerMenu, entreesMenu,dessertsMenu]);
order2.addDish("Soup", [appetizerMenu, entreesMenu,dessertsMenu]);

customer1.placeOrder(order1);
customer2.placeOrder(order2);

console.log(order1.viewSummary());
console.log(order1.getTotal());
console.log(order2.viewSummary());
console.log(order2.getTotal());