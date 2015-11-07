function CharacterPool() {
    this.complete = false;
    this.loadPool();
    this.createLookupTables();
}
CharacterPool.prototype = {
    loadPool: function(){
        this.createCow();
    },
    initList:function(){
        var list = [];
        list[CharacterType.Cow] = [];
        return list;
    },
    createLookupTables: function(){
        this.borrowCharacterLookup = [];
        this.borrowCharacterLookup[CharacterType.Cow] = this.borrowCow;
        this.returnCharacterLookup = [];
        this.returnCharacterLookup[CharacterType.Cow] = this.returnCow;
    },
    borrowCharacter : function(characterType){
        return this.borrowCharacterLookup[characterType].call(this);
    },
    returnCharacter: function(characterType, character){
        return this.returnCharacterLookup[characterType].call(this, character);
    },
    createCow: function(){
        this.cows = [];
        this.addCow(100);
    },
    addCow: function(amount){
        for(var i = 0; i < amount; i++){
            this.cows.push(new Cow());
            //console.log("addCow");
        }
    }, // end addCow
    borrowCow : function(){
        if(this.cows.length >= 1)   return this.cows.shift();
        else return null;
    }, // end borrowCow
    returnCow: function(character){
        this.cows.push(character);
    }, // end returnCow
} // end CharacterPool
