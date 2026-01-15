class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new TypeError('Cannot instantiate abstract class Shape directly');
        }
    }

    getArea() {
        throw new TypeError('Abstract method getArea() must be implemented');
    }

    getPerimeter() {
        throw new TypeError('Abstract method getPerimeter() must be implemented');
    }

    toString() {
        throw new TypeError('Abstract method toString() must be implemented');
    }
}

class ShapeCollection {
    constructor() {
        this.shapes = [];
    }

        addShape(shape) {
        if (typeof shape?.getArea === 'function' &&
            typeof shape?.getPerimeter === 'function' &&
            typeof shape?.toString === 'function') {
            this.shapes.push(shape);
        } else {
            throw new TypeError('Object does not implement Shape interface');
        }
    }

    totalArea() {
        return  this.shapes.reduce((sum, shape) => sum + shape.getArea(), 0);
    }

    totalPerimeter() {
        return this.shapes.reduce((sum, shape) => sum + shape.getPerimeter(), 0);
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        
        isValid('All sizes must be positive number', width, height);
        this.width = width;
        this.height = height;

    }

    getArea() {
        return this.width * this.height;
    }

    getPerimeter() {
        return 2 * (this.width + this.height);
    }
    
    toString() {
        return `${this.constructor.name}:
         width = ${this.width}, 
         height = ${this.height}, 
         area = ${this.getArea()}, 
         perimeter = ${this.getPerimeter()}`;
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        super();

        isValid('Triangle sides must be positive number', base, height);
        this.base = base;
        this.height = height;

    }

    getArea() {
        return (this.base * this.height) / 2;
    }

    getPerimeter() {
        const side = Math.sqrt((this.base / 2) ** 2 + this.height ** 2);
        return (this.base + 2 * side);
    }

    toString() {
        return `${this.constructor.name}:
         base = ${this.base}, 
         height = ${this.height}, 
         area = ${this.getArea()}, 
         perimeter = ${this.getPerimeter()}`;
    }
}

class Square extends Shape {
    constructor(side) {
        super();

        isValid('Side of the square must be a positive number', side);
        this.side = side;

    }

    getArea() {
        return this.side ** 2;
    }

    getPerimeter() {
        return this.side * 4;
    }

    toString() {
        return `${this.constructor.name}:
         side = ${this.side}, 
         area = ${this.getArea()}, 
         perimeter = ${this.getPerimeter()}`;
    }
}

const isValid = function(message, ...sizes) {
    for(const size of sizes) {
        if (typeof size !== 'number' || size <= 0) {
            throw new SizeValidationError(message);
        }
    }
}

class SizeValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SizeValidationError';
    }
}

const shapes = new ShapeCollection()
const rectangle = new Rectangle(4, 5);
shapes.addShape(rectangle);
const triangle = new Triangle(2, 4);
shapes.addShape(triangle);
const square = new Square(8);
shapes.addShape(square);

console.log(shapes.totalArea());
console.log(shapes.totalPerimeter());
console.log(rectangle.toString());
console.log(triangle.toString());
console.log(square.toString());
