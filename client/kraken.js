var TickerData = new Meteor.Collection('tickerData');




function KrakenCron() {
  Meteor.call("GetTickerInfo", Session.get("currencyPairKraken") , function(error, result){
    if(error){
      console.log("error", error);
    }
    if(result){
      // console.log("ALO");
      // console.log(result);
      // console.log(result.XETHXXBT.b[2]);
      Session.set('lowestAsk_kraken', result.a[0]);
      Session.set('lowestAsk_volume_kraken', result.a[2]);



      Session.set('highestBid_kraken', result.b[0]);
      Session.set('highestBid_volume_kraken', result.b[2]);

      Session.set('last_kraken', result.c[0]);


      dataChart.series[1].data[0].update(result.a[0]*1);
      dataChart.series[1].data[1].update(result.b[0]*1);

    }
  });
}


Meteor.setInterval(KrakenCron, 3000);
