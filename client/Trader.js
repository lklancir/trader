Meteor.subscribe('arbtrades');




Template.general.helpers({
  spread_1: function () {
    return Session.get('spread_1');
  },
  spread_2: function () {
    return Session.get('spread_2');
  }
});


Template.poloniex.helpers({
  balance_btc_polo: function () {
    return Session.get('balance_btc_polo');
  },
  balance_eth_polo: function () {
    return Session.get('balance_eth_polo');
  },
  last: function () {
    return Session.get('last');
  },
  lowestAsk: function () {
    return Session.get('lowestAsk');
  },
  lowestAsk_volume: function () {
    return Session.get('lowestAsk_volume');
  },
  highestBid: function () {
    return Session.get('highestBid');
  },
  highestBid_volume: function () {
    return Session.get('highestBid_volume');
  },
  percentChange: function () {
    return Session.get('percentChange');
  },
  baseVolume: function () {
    return Session.get('baseVolume');
  },
  quoteVolume: function () {
    return Session.get('quoteVolume');
  }
});





Template.kraken.helpers({
  balance_btc_kraken: function () {
    return Session.get('balance_btc_kraken');
  },
  balance_eth_kraken: function () {
    return Session.get('balance_eth_kraken');
  },

  last_kraken: function () {
    return Session.get('last_kraken');
  },
  lowestAsk_kraken: function () {
    return Session.get('lowestAsk_kraken');
  },
  lowestAsk_volume_kraken: function () {
    return Session.get('lowestAsk_volume_kraken');
  },
  highestBid_kraken: function () {
    return Session.get('highestBid_kraken');
  },
  highestBid_volume_kraken: function () {
    return Session.get('highestBid_volume_kraken');
  },
  percentChange_kraken: function () {
    return Session.get('percentChange_kraken');
  },
  baseVolume_kraken: function () {
    return Session.get('baseVolume_kraken');
  },
  quoteVolume_kraken: function () {
    return Session.get('quoteVolume_kraken');
  }
});


Template.tradebook.helpers({

    settings: function(){
        return {
          collection: arbTrades.find(),
          rowsPerPage: 10,
          showFilter: true,
          showColumnToggles: true,
          fields : ['tradeTime', 'tradeDetails', 'tradeFlow', 'lowestAskPricePolo', 'lowestAskVolumePolo', 'lowestAskPriceKraken', 'lowestAskVolumeKraken', 'tradeCostsPolo', 'tradeCostsKraken', 'balanceBtcPoloBefore', 'balanceBtcPoloAfter', 'balanceEthPoloBefore', 'balanceEthPoloAfter', 'highestBidPriceKraken', 'highestBidVolumeKraken', 'highestBidPricePolo', 'highestBidVolumePolo','tradeRevenueKraken', 'tradeRevenuePolo',  'balanceBtcKrakenBefore', 'balanceBtcKrakenAfter', 'balanceEthKrakenBefore', 'balanceEthKrakenAfter', 'tradeProfit'],
        };
    },

    profit_loss:function(){
     var sum=0;
     var cursor=arbTrades.find();
     cursor.forEach(function(transaction){
       sum = sum + transaction.tradeProfit
     });
     return sum;
   }


});


Template.tradebook.events({
  "click #removeAllTrades": function(event, template){


     Meteor.call("removeAllTrades", function(error, result){
       if(error){
         console.log("error", error);
       }
       if(result){
          console.log("Sucessful cleared the DB");
       }
     });
  }
});


Template.pairs.events({
  "click #ETH_BTC": function(event, template){
    event.preventDefault();

    connection.close();


    Session.set("currencyPairPolo", "BTC_ETH");
    Session.set("currencyPairKraken", "ETHXBT");


    sAlert.info('Currency pair set to: BTC / ETH', {effect: 'slide', position: 'top-right', timeout: '2000', onRouteClose: false, stack: false, offset: '100px'});

    $('[id=ETH_BTC]').prop("disabled", true);
    $('[id=ETH_BTC]').attr("class", "btn btn-info");

    $('[id=USD_BTC]').prop("disabled", false);
    $('[id=USD_BTC]').attr("class", "btn btn-default");

    setTimeout(function () {
    $('[id=startSocket]').prop("disabled", false);
    $('[id=startSocket]').attr("class", "btn btn-success");
    }, 2000);

  },

  "click #USD_BTC": function(event, template){

    event.preventDefault();

    connection.close();


    Session.set("currencyPairPolo", "USDT_BTC");
    Session.set("currencyPairKraken", "XBTUSD");


    sAlert.info('Currency pair set to: BTC / USD', {effect: 'slide', position: 'top-right', timeout: '2000', onRouteClose: false, stack: false, offset: '100px'});

    $('[id=USD_BTC]').prop("disabled", true);
    $('[id=USD_BTC]').attr("class", "btn btn-info");


    $('[id=ETH_BTC]').prop("disabled", false);
    $('[id=ETH_BTC]').attr("class", "btn btn-default");

    setTimeout(function () {
    $('[id=startSocket]').prop("disabled", false);
    $('[id=startSocket]').attr("class", "btn btn-success");
    }, 2000);



  },

  "click #startSocket": function(event, template){

    sAlert.success('Websocket restarted!', {effect: 'slide', position: 'top-right', timeout: '2000', onRouteClose: false, stack: false, offset: '100px'});


    connection.open();

    $('[id=startSocket]').prop("disabled", true);
    $('[id=startSocket]').attr("class", "btn btn-default");



  }

});
