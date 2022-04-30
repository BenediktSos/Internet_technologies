var myModule = require("./fakesms.js")

var data  = myModule.postd
var reque = myModule.requ
reque.write(data,function(err){
    reque.end()
})