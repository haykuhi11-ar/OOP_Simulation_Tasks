class CarNotAvailableError extends Error {
    constructor(msg) {
        super(msg);
        this.name = this.constructor.name;
    }
}
class InvalidRentalDurationError extends Error {
    constructor(msg) {
        super(msg);
        this.name = this.constructor.name;
    }
}

const seasonFactor = function(season) {
    const price = {
        low: 1,
        high: 1.2,
        peak: 1.5
    };
    if (typeof season !== "string" || season.length === 0) {
            throw new Error("Invalid season name");
        }
    if (season === "winter") return price.high;
    if (season === "summer") return price.peak;
    if (season === "spring") return price.low;
    if (season === "autumn") return price.low;
}

class Rental {
   static rentalId = 1;
   static demand = 1;
    constructor(customer, car, rentalDuration, season) {
        if (new.target === Rental) {
            throw new TypeError("Cannot instantiate abstract class Rental directly");
        }
        this.rentalId = Rental.rentalId++;
        this.customer = customer;
        this.car = car;
        this.rentalDuration = rentalDuration;
        this.season = seasonFactor(season);
        this.demand = Rental.demand++;
    }
    rentCar() {
        if (typeof this.rentalDuration !== "number" || this.rentalDuration <= 0) {
            throw new InvalidRentalDurationError("Invalid rental duration");
        }
        this.car.markRented();
        this.customer.rentalHistory.push({
            rentalId: this.rentalId,
            car: this.car, 
            rentalDuration: this.rentalDuration, 
            totalPrice: this.calculateRentalPrice()
        }); 
    }
    returnCar() {
        this.car.markAvailable();
    }
    calculateRentalPrice() {
        throw new TypeError("Abstract method calculateRentalPrice() must be implemented");
    }
}

class EconomyRental extends Rental {

    calculateRentalPrice() {
        let totalPrice = this.car.rentalPricePerDay * this.rentalDuration;
        if (this.rentalDuration >= 5) {
            totalPrice *= 0.8;
        }
        if (this.demand > 50) {
            totalPrice *= 1.2;
        }
        return totalPrice;
    }
}

class LuxuryRental extends Rental {

    calculateRentalPrice() {
        let totalPrice = this.car.rentalPricePerDay * this.rentalDuration;
        if (this.rentalDuration >= 5) {
            totalPrice *= 0.9;
        }
        totalPrice *= this.season;
        if (this.demand > 10) totalPrice *= 1.5;
        const premiumService = 0.7;
        return totalPrice *= premiumService;
    }
}

class Car {
    static cars = [];

    constructor(make, model, rentalPricePerDay) {
        Object.defineProperties(this, {
            make: {
                get() {
                    return this._make;
                },
                set(value) {
                    if (!value || typeof value !== "string") {
                        throw new Error(`Invalid make`);
                    }
                    this._make = value;
                }
            },
            model: {
                get() {
                    return this._model;
                },
                set(value) {
                    if (!value || typeof value !== "string") {
                        throw new Error(`Invalid model`);
                    }
                    this._model = value;
                }
            },
            rentalPricePerDay: {
                get() {
                    return this._rentalPricePerDay;
                },
                set(value) {
                    if (!value || typeof value !== "number" || value < 0) {
                        throw new Error("Invalid rental duration");
                    }
                    this._rentalPricePerDay = value;
                }
            }
        });
        this.make = make;
        this.model = model;
        this.rentalPricePerDay = rentalPricePerDay;
        this.availability = true;
    }
    markRented() {
        if (this.availability === false) {
            throw new CarNotAvailableError(`${this.make} not available`);
        }
        this.availability = false;
    }
    markAvailable() {
        if (this.availability === true) {
            throw new Error("Car already available");
        }
        this.availability = true;
    }
}

class EconomyCar extends Car {
    constructor(make, model, rentalPricePerDay) {
        super(make, model, rentalPricePerDay);
        if (new.target === EconomyCar) Car.cars.push({
            make: this.make,
            model: this.model,
            rentalPricePerDay: this.rentalPricePerDay
        });
    }
}
class LuxuryCar extends Car {
     constructor(make, model, rentalPricePerDay) {
        super(make, model, rentalPricePerDay);
        if (new.target === LuxuryCar) Car.cars.push({
            make: this.make,
            model: this.model,
            rentalPricePerDay: this.rentalPricePerDay
        });
    }
}

class Customer {
    constructor(name, contactInfo) {
        Object.defineProperties(this, { 
            name: {
                get() {
                    return this._name; 
                },
                set(value) {
                    if (!value || typeof value !== "string") {
                        throw new Error(`Invalid name`);
                    }
                    this._name = value;
                }
            },
            contactInfo: {
                get() {
                    return this._contactInfo;
                },
                set(value) {
                    const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    const phone = /^0\d{8}$/;
                
                    if (!value || 
                        typeof value !== "string" || 
                        !(email.test(value) ||
                        !(phone.test(value)))) {
                        throw new Error("Invalid contactInfo");
                    }
                    this._contactInfo = value;
                }
            }
        });
        this.name = name;
        this.contactInfo = contactInfo;
        this.rentalHistory = [];
    }
    searchCars(filters) {
        const result = [];
            for(let i = 0; i < Car.cars.length; ++i) {
                let flag = true;
                if (Car.cars[i].make !== filters.make) flag = false;
                if (Car.cars[i].model !== filters.model) flag = false;
                if (Car.cars[i].rentalPricePerDay > filters.maxPricePerDay) flag = false;
                if (flag) result.push(Car.cars[i]);
        }
        if (result.length === 0) {
            throw new Error("Car not found");
        } 
        return result;
    }

    viewRentalHistory() {
        return  this.rentalHistory.map(rental => 
            `Rental Id: ${rental.rentalId},
            Car: ${rental.car.make} ${rental.car.model},
            Rental Duration: ${rental.rentalDuration} days,
            Total Price: $${rental.totalPrice} `
        );
    }
}

const economyCar01 = new EconomyCar("BMW", "X5", 20);
const economyCar02 = new EconomyCar("Mercedes-Benz", "C-Class", 25);
const luxuryCar01 = new LuxuryCar("Rolls-Royce", "SUVs", 75);

const customer1 = new Customer("Annet", "anNet@mail.com");
const customer2 = new Customer("Bob", "smith24@mail.com")

const economyRental = new EconomyRental(customer1, economyCar01, 5, "summer");
const luxuryRental = new LuxuryRental(customer2, luxuryCar01, 10, "winter");

economyRental.rentCar();
luxuryRental.rentCar();
console.log(customer1.viewRentalHistory());
console.log(customer2.viewRentalHistory());
console.log(Car.cars);

console.log(customer2.searchCars({
    make:"Mercedes-Benz", 
    model:"C-Class", 
    rentalPricePerDay: 25
}));