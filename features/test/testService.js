// Erstellen einer Service Klasse, die sich um CRUD Aktionen mit der Datenbank kümmert
// C - Create
// R - Read
// U - Update
// D - Delete
// Achtung in JS gibt es keinen private deklarator bei Klassen
class TestService {
    constructor() {
    }

    tests = [
        {id:1,label:"Test"},
        {id:2,label:"Mein Test"},
        {id:3,label:"Ich teste"},
        {id:4,label:"Test"},
        {id:5,label:"5. Test"},
    ];
   
  
    get() {
        return this.tests;
    }
    
    find(id) {

        if(id == null)
            return null;

        if(typeof id === 'string')
            id = parseInt(id);
        else if(typeof id !== 'number')
            return null;

        for (let i = 0; i < this.tests.length; i++) {
            if(this.tests[i].id === id)
                return this.tests[i];            
        }

        return null;
    }
    
    insert(test) {
        this.tests[this.tests.length] = test;
        return test;
    }
  };

// Testservice wird als Singleton deklariert. 
// Bedeutet es kann nur 1 Instanz des Service geben
module.exports = new TestService();