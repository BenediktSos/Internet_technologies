

module.exports = class {
    constructor(e){
      this.e = e
      this.lätaa = function (){
        return "b"
      }
    }
    nextLetter(){
      return "d"
    }
    getLetter(){
      return this.e
    }
  }
