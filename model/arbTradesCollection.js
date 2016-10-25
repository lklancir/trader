arbTrades = new Mongo.Collection("arbtrades");


Meteor.methods({
  saveTrade:function(tradeData){

     arbTrades.insert(tradeData);
     return true;
  },

  removeAllTrades:function(){

    arbTrades.remove({});
    return true;
  }
});
