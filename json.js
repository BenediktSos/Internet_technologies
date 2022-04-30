
let myStudent = require("./sample4.json")

let manualJSON = '{"hello":"world"}'
const myJSONObject = JSON.parse(manualJSON)

for (const human of myStudent.people) {
    if (human.lastName === "Smith"){
        console.log(human);
    }
}


for (const human in myStudent) {
    if (Object.hasOwnProperty.call(myStudent, human)) {
        const element = myStudent[human];
        if (element.lastName === "Smith"){
            console.log(element);
        }
        
    }
}
