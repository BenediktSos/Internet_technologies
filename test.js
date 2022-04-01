/**
 * Introduction to Java Script
 * @author Benedikt Sosnowsky
 */

function start() {


    /**
     * Basic variable declarations, initialisations and output to console
     * var: everything-goes variable
     * let: java variable, unique name
     * const: constant variable
     */

    var a = 4
    var b = 30

    let c = a + b
    console.log(c)

    //Danger!!!
    var a = 2

    /**
     * A for-loop with an index running from o to 99
     */
    for (let index = 0; index < 100; index++) {
        console.log(index)
    }

    /**
     * Arrays and for-each-loops
     */
    students = ["Marcel", "Simon", "Mattis", "Matthias", getJosef()]

    students.forEach(student => {
        console.log(student)
    });


    /**
     * Showing funtionality of Maps (basically Lists)
     */
    let studentMap = new Map()
    studentMap.set(1, "Marcel")
    studentMap.set(2, "Simon")
    studentMap.set(3, "Mattis")
    studentMap.set(4, "Matthias")
    studentMap.set(5, getJosef())

    console.log(studentMap.get(5))

    function getJosef() {
        return "Josef"
    }


    /**
     * while-loops
     */
    var someBoolean = true
    while (someBoolean) {
        someBoolean = false
    }


    if (someBoolean) {
        console.log("true")
    } else if (!someBoolean) {
        console.log("fasle")
    } else {
        console.log("not a bool")
    }
}

/**
 * Generates a random integer between two numbers.
 * 
 * @param {integer} min 
 * @param {integer} max 
 * @returns {integer} random integer between numbers 
 */
function between(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

/**
 * Starts a small number guessing game.
 * 
 * @param {integer} min Minimal value to guess
 * @param {integer} max Maximal number to guess
 */
function startGame(min, max) {

    const winMessage = "Correct!"
    const tooLowMessage = "Number too low, try again!"
    const tooHighMessage = "Number too high, try again!"
    const genericErrorMessage = "Some error occured!"

    const prompt = require('prompt-sync')()

    let erraten = false
    const goalNumber = between(min, max + 1)
    console.log(goalNumber)

    while (!erraten) {
        let guessNumber = prompt('Please enter a number between 0 and 100:')

        if (guessNumber == goalNumber) {
            erraten = true
            console.log(winMessage)
        } else if (guessNumber < goalNumber) {
            console.log(tooLowMessage)
        } else if (guessNumber > goalNumber) {
            console.log(tooHighMessage)
        } else(
            console.log(genericErrorMessage)
        )
    }


}


startGame(0, 100)