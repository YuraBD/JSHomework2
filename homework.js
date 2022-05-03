/* DONT CHANGE THIS CODE - START */
function wait(ms = 1000) { return new Promise(resolve => setTimeout(resolve, ms)) }

class Dish {
    constructor(cookingTime) {
        this.cookingTime = cookingTime;
    }

    async cook() {
        const actualCookingTime = this.cookingTime * (1 + Math.random()) * 100;
        await wait(actualCookingTime);
        return this;
    }
}
/* DONT CHANGE THIS CODE - END */

class Bolognese extends Dish {
    constructor() {
        super(10);
        this.ingredients = {'spaghetti':1, 'meat':1, 'tomato':2}
    }
}

class MashedPotatoes extends Dish {
    constructor() {
        super(8);
        this.ingredients = {'potato':1};
    }
}

class Steak extends Dish {
    constructor() {
        super(7);
        this.ingredients = {'meat':1}
    }
}

class SteakAndFries extends Dish {
    constructor() {
        super(9);
        this.ingredients = {'meat':1, 'potato':1}
    }
}

class Ingredient {
    constructor(name, num) {
        this.name = name;
        this.num = num;
    }
}

class Kitchen {
    constructor() {
        this.ingredients = []
        this.orders = []
    }

    addToFridge(newIngredients) {
        if (!(newIngredients instanceof Array)) {
            newIngredients = [newIngredients];
        }
        for (let ing of newIngredients) {
            if (!(ing instanceof Ingredient)) {
                throw new Error("Invalid ingredient");
            }

            let existingIng = this.findIngredient(ing.name);
            if (existingIng) {
                existingIng.num += ing.num;
            } else {
                this.ingredients.push(ing);
            }
        }
    }

    order(dish) {
        if (!(dish instanceof Dish)) {
            throw new Error("Invalid dish")
        }
        if (!(this.checkIngredients(dish))) {
            throw new Error("Not enough ingredients in fridge");
        }
        for (let requiredIng of Object.keys(dish.ingredients)) {
            let ing = this.findIngredient(requiredIng);
            ing.num -= dish.ingredients[requiredIng];
            if (ing.num === 0) {
                this.ingredients.splice(this.ingredients.indexOf(ing), 1);
            }
        }
        this.orders.push(dish);
    }

    findIngredient(ingredientName) {
        return this.ingredients.find(element => element.name === ingredientName);
    }

    checkIngredients(dish) {
        for (let ing of Object.keys(dish.ingredients)) {
            let existingIng = this.findIngredient(ing);
            if (!existingIng || existingIng.num < dish.ingredients[ing]) {
                return false
            }
        }
        return true;
    }

    cookFastestOrder() {
        let fastestOrder = this.orders[0];
        for (let order of this.orders) {
            if (order.cookingTime < fastestOrder.cookingTime) {
                fastestOrder = order;
            }
        }
        this.orders.splice(this.orders.indexOf(fastestOrder), 1);
        return fastestOrder.cook();
    }

    cookAllOrders() {
        let cookedOrders =  Promise.all(this.orders.map(order => order.cook()));
        this.orders = [];
        return cookedOrders;
    }
}



async function test() {
    const kitchen = new Kitchen();
    kitchen.addToFridge([
        new Ingredient('potato', 1),
        new Ingredient('spaghetti', 1),
        new Ingredient('meat', 3),
        new Ingredient('tomato', 2)
    ])

    kitchen.order(new Bolognese()); // Bolognese extends Dish (cookingTime = 10)
    kitchen.order(new MashedPotatoes()); // MashedPotatoes extends Dish (cookingTime = 8)
    kitchen.order(new Steak()); // Steak extends Dish (cookingTime = 7)

    // // Feel free to experiment with various dishes and ingridients

    let fastestOrder = await kitchen.cookFastestOrder(); // Returns fastest dish to make
    console.log(fastestOrder);
    let cookedOrders = await kitchen.cookAllOrders(); // Returns two dishes in array
    console.log(cookedOrders);

    kitchen.order(new SteakAndFries()); // Throws Error: Not enough ingridients in fridge
}

test();
