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
    set dishes(value) {
        if (!value || !(value instanceof Map)) {
            throw new DishNotFoundError("DishNotFound");
        }
        this.#dishes = value;
    } 
    addDish(dish) {
        if (this.dishes.has(dish)) {
            throw new DishNotFoundError(`${dish} already exists in menu.`);
        }
        this.#dishes.set(dish.name, dish);
    }
    removeDish(dishName) {
        if (!this.dishes.has(dishName)) {
            throw new DishNotFoundError(`${dishName} not found`);
        }
        this.#dishes.delete(dishName);
    }
    viewMenu() {
       throw new TypeError("Abstract method viewMenu() must be implemented");
    }
}
class AppetizersMenu extends Menu {
    viewMenu() {
        console.log("------Appetizers------");
        for(const [name, dish] of this.dishes) {
            console.log(`${name} : $${dish.price}`);
        }
    }
}
class EntreesMenu extends Menu {
    viewMenu() {
        console.log("--------Entrees--------");
        for(const [name, dish] of this.dishes) {
            console.log(`---${name}--- : $${dish.price}`);
        }
   }
}
class DessertsMenu extends Menu {
    viewMenu() {
        console.log("---------Desserts--------");
        for(const [name, dish] of this.dishes) {
            console.log(`..${name}: $${dish.price}`);
        }
   }
}
class Dish {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}
class Appetizer extends Dish {}
class Entree extends Dish {}
class Dessert extends Dish {}
class Customer {
    constructor(name, contactInfo, orderHistory = []) {
        Object.defineProperty(this, "name", {
            get() {
                return this._name;
            },
            set(value) {
                if (value === "" || typeof value !== 'string') {
                    throw new Error();
                } 
                this._name = value;
            }
        });
        Object.defineProperty(this, "contactInfo", {
            get() {
                return this._contactInfo;
            },
            set(value) {
                const phone = /^0\d{8}$/
                if (!phone.test(value)) {
                    throw new InvalidOrderError(`Invalid ${value}`);
                }
                this._contactInfo = value;
            }
        });
        this.name = name;
        this.contactInfo = contactInfo;
        this.orderHistory = orderHistory;
    }
    placeOrder(order) {
        this.orderHistory.push(order);
    }
    viewOrderHistory() {
       this.orderHistory.forEach(order => {
        console.log(`${order.customer.name} : ${this.orderHistory.getTotal()}`)
       });
    }
}
class Order {
    #totalPrice;
    constructor(customer, dishes = []) {
        this.customer = customer;
        this.dishes = dishes;
    }
    get totalPrice() {
        return this.#totalPrice;
    }
    set totalPrice(value) {
        if (value < 0) throw new InvalidOrderError("Invalid value");
        this.#totalPrice = value;
    }
    addDish(dishName, menus) {
        if (!dishName || typeof dishName !== "string") {
            throw new InvalidOrderError(`${dishName} invalid name`);
        }
        for(const menu of menus) {
            if (menu.dishes.has(dishName)) {
                const dish = menu.dishes.get(dishName);
                this.dishes.push(dish);
                this.totalPrice += dish.price;
                return;
            }
        }
        throw new InvalidOrderError(`${dishName} not found`);
    }
    getTotal() {
      return  this.dishes.reduce((sum, dish) => sum + dish.price, 0);
    }
    viewSummary() {
        this.dishes.forEach(dish => {
            console.log(`${dish.name} : ${dish.price}`);
        });
    }
    increasePrice(dishName, percent) {
        for(const dish of this.dishes) {
            if (dishName === dish) {
                dish.price += Math.floor(dish.price * (percent / 100));
                this.getTotal();
            }
        }
    }
    descreasePrice(dishName, percent) {
         for(const dish of this.dishes) {
            if (dishName === dish) {
                dish.price -= Math.floor(dish.price * (percent / 100));
                this.getTotal();
            }
        }
    }
    applyDemandPricing(popularDishNames) {
         for(const dish of this.dishes) {
            if (popularDishNames === dish) {
                dish.price -= Math.floor(dish.price / 2);
                this.getTotal();
            }
        }
    }
}
const appetizer_menu = new AppetizersMenu();
const entrees_menu = new EntreesMenu();
const desserts_menu = new DessertsMenu();
appetizer_menu.addDish(new Appetizer("Salad", 50));
appetizer_menu.addDish(new Appetizer("Soup", 40));
entrees_menu.addDish(new Entree("Chicken", 70));
entrees_menu.addDish(new Entree("Fish", 120));
desserts_menu.addDish(new Dessert("Cake", 35));
desserts_menu.addDish(new Dessert("Ice Cream", 25));

appetizer_menu.viewMenu();
entrees_menu.viewMenu();
desserts_menu.viewMenu();

const customer_1 = new Customer("Annet", "094786543");
const customer_2 = new Customer("Bob", "094672312");
const order_1 = new Order(customer_1);
const order_2 = new Order(customer_2);

order_1.addDish("Salad", [appetizer_menu, entrees_menu,desserts_menu]);
order_2.addDish("Fish", [appetizer_menu, entrees_menu,desserts_menu]);
order_1.addDish("Ice Cream", [appetizer_menu, entrees_menu,desserts_menu]);
order_2.addDish("Soup", [appetizer_menu, entrees_menu,desserts_menu]);

customer_1.placeOrder(order_1);
customer_2.placeOrder(order_2);

order_1.viewSummary();
console.log(order_1.getTotal());
order_2.viewSummary();
console.log(order_2.getTotal());