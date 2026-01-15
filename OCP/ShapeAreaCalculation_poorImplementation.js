class Shape {
    constructor() {
        this.shapes = [];
    }

    addShape(shape) {
        this.shapes.push(shape);
    }

    getArea(shape) {
        if (shape instanceof Rectangle) {
            return shape.width * shape.height;
        }
        if (shape instanceof Square) {
            return shape.side ** 2;
        }
        if (shape instanceof Triangle) {
            return (shape.base * shape.height) / 2;
        }
    }

    getPerimeter(shape) {
        if (shape instanceof Rectangle) {
            return 2 * (shape.width + shape.height);
        }
        if (shape instanceof Square) {
            return shape.side * 4;
        }
        if (shape instanceof Triangle) {
            const side = Math.sqrt((shape.base / 2) ** 2 + shape.height ** 2);
            return (shape.base + 2 * side);
        }

    }

    getToString(shape) {
        if (shape instanceof Rectangle) {
            return `${shape.constructor.name}:
            width = ${shape.width}, 
            height = ${shape.height}, 
            area = ${this.getArea(shape)}, 
            perimeter = ${this.getPerimeter(shape)}`;
        }
        if (shape instanceof Square) {
            return `${shape.constructor.name}:
            side = ${shape.side}, 
            area = ${this.getArea(shape)}, 
            perimeter = ${this.getPerimeter(shape)}`;
        }
        if (shape instanceof Triangle) {
            return `${shape.constructor.name}:
            base = ${shape.base}, 
            height = ${shape.height}, 
            area = ${this.getArea(shape)}, 
            perimeter = ${this.getPerimeter(shape)}`;
        }
    }

    getTotalArea() {
        return  this.shapes.reduce((sum, shape) => sum + this.getArea(shape), 0);
    }

    getTotalPerimeter() {
        return this.shapes.reduce((sum, shape) => sum + this.getPerimeter(shape), 0);
    }
}

class Rectangle {
    constructor(width, height) {
        isValid('All sizes must be positive number', width, height);
        this.width = width;
        this.height = height;
    }
}

class Square {
    constructor(side) {
        isValid('Side of the square must be a positive number', side);
        this.side = side;
    }
}

class Triangle {
    constructor(base, height) {
        isValid('Triangle sides must be positive number', base, height);
        this.base = base;
        this.height = height;
    }
}

class SizeValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SizeValidationError';
    }
}

const isValid = function(message, ...sizes) {
    for(const size of sizes) {
        if (typeof size !== 'number' || size <= 0) {
            throw new SizeValidationError(message);
        }
    }
}

const shape = new Shape();
const rectangle = new Rectangle(7, 8);
const square = new Square(9);
const triangle = new Triangle(9, 3);

shape.addShape(rectangle);
shape.addShape(square);
shape.addShape(triangle);

console.log(shape.getToString(rectangle));
console.log(shape.getToString(square));
console.log(shape.getToString(triangle));
console.log(shape.getTotalArea());
console.log(shape.getTotalPerimeter());
