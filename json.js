const myStudent = '{"name":"John","alter":30,"fach":"informatik"}'
const myJSONObject = JSON.parse(myStudent)

x=myJSONObject.fach

console.log(x)