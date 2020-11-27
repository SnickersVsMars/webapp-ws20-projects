const dbConnection = require("../dbConnection");

// Class for CRUD actions for the database
// C - Create
// R - Read
// U - Update
// D - Delete
// !!! CAUTION !!! There are no private fields in class definitions in JS.
// If you want private fields and functions you need to declare TestService as function
// function TestService(constructorParam1, constructorParam2)

class TestService {
    constructor() {}

    get(succes) {
        dbConnection.select("Select * FROM tests", succes);
    }

    find(id) {
        if (id == null) return null;

        if (typeof id === "string") id = parseInt(id);
        else if (typeof id !== "number") return null;

        for (let i = 0; i < this.tests.length; i++) {
            if (this.tests[i].id === id) return this.tests[i];
        }

        return null;
    }

    insert(test) {
        this.tests[this.tests.length] = test;
        return test;
    }
}

// return instance of TestService, because we want a singleton TestService
module.exports = new TestService();
