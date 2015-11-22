function CharacterPool() {
    this.complete = false;
    this.loadPool();
    this.createLookupTables();
}
CharacterPool.prototype = {
    loadPool: function(){
        this.createCow();
        this.createHut();
    },
    initList:function(){
        var list = [];
        list[CharacterType.Cow] = [];
        list[CharacterType.Hut] = [];
        return list;
    },
    createLookupTables: function(){
        this.borrowCharacterLookup = [];
        this.borrowCharacterLookup[CharacterType.Cow] = this.borrowCow;
        this.borrowCharacterLookup[CharacterType.Hut] = this.borrowHut;

        this.returnCharacterLookup = [];
        this.returnCharacterLookup[CharacterType.Cow] = this.returnCow;
        this.returnCharacterLookup[CharacterType.Hut] = this.returnHut;
    },
    borrowCharacter : function(characterType){
        return this.borrowCharacterLookup[characterType].call(this);
    },
    returnCharacter: function(characterType, character){
        return this.returnCharacterLookup[characterType].call(this, character);
    },
    createCow: function(){
        this.cows = [];
        this.addCow(5000);
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
    createHut: function(){
        this.huts = [];
        this.addHut(8);
    },
    addHut: function(amount){
        for(var i = 0; i < amount; i++){
            this.huts.push(new Hut());
            //console.log("addHut");
        }
    }, // end addHut
    borrowHut : function(){
        if(this.huts.length >= 1)   return this.huts.shift();
        else return null;
    }, // end borrowHut
    returnHut: function(character){
        this.huts.push(character);
    }, // end returnHut
} // end CharacterPool
