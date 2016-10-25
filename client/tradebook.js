// LAP_p = Lowest Ask Polonix price
// LAP_v = Lowest Ask Poloniex volume
// BBP = Balance Bitcoin Poloniex
// BEP = Balance Ether Poloniex
// TFP = Trading Fees Polo
counter_LAP_HBK = 1;
counter_LAK_HBP = 1;

semafor_LAP_HBK = 1;
semafor_LAK_HBP= 1;

spreadLimit = -0.0001



function initiateTrade_LAP_HBK() {

  console.log("TRADE INITIATED LAP - > HBK - #" + counter_LAP_HBK);
  counter_LAP_HBK++;

  var BBP = Session.get("balance_btc_polo");
  var BEP = Session.get("balance_eth_polo");

  var BBK = Session.get("balance_btc_kraken");
  var BEK = Session.get("balance_eth_kraken");

  var TFP = 0.004;
  var TFK = 0.0015;

  var LAP_p = Session.get("lowestAsk");
  var LAP_v = Session.get("lowestAsk_volume")

  var HBK_p = Session.get("highestBid_kraken");
  var HBK_v = Session.get("highestBid_volume_kraken")


  console.log(Session.get("spread_1"));

  console.log("PRETVORENO U: ");

  var spread = Session.get("spread_1");
  console.log(spread);

  var cost = 0
  var revenue = 0;



  if (spread < spreadLimit) {
    // to create the actual API trade


    // IF THE volume of ETH is same or LOWER then KRAKEN  AND the volume is same or lower then ETH balance on KRAKEN - then proceed with trade

    if (LAP_v <= HBK_v && LAP_v <= BEK) {

      //========= buy ETH at lowest ask(SELLING) on POLONIEX =========

      cost = (LAP_p * LAP_v) + (LAP_p * LAP_v * TFP);  // cost of the trade in BTC with the fees
      cost = cost.toFixed(8)*1;

      // if the cost of the trade is less then the BTC balance in the account then do the trade
      if (cost < BBP){
        console.log("Price: " + LAP_p + " - Volume: " + LAP_v + " - Cost in BTC + Fees: " + cost); // LOG THE TRADE (DB)




                //========= sell ETH at highest bid(BUYING) on KRAKEN =========

                // neki timeout
                console.log("API CALL FOR TRADE 2sec");
                // setTimeout(function(){
                //   console.log("TRADE EXECUTED");
                // }, 2000);

                revenue = (HBK_p * LAP_v) - (HBK_p * LAP_v * TFK); // revenue of the trade in BTC minus the fees
                revenue = revenue.toFixed(8)*1;

                console.log("Price: " + HBK_p + " - Volume: " + LAP_v + " - Revenue in BTC - Fees: " + revenue);







                var profit = revenue - cost;
                profit = profit.toFixed(8)*1;



                if (profit > 0) {

                  console.log("PROFIT: " + profit);
                  console.log("=================");
                  console.log("TRADE SUCCESFUL");

                  Session.set("balance_btc_polo", BBP - cost); // UPDATE POLO BTC BALANCE - subtract bitcoin
                  Session.set("balance_eth_polo", BEP + parseFloat(LAP_v)); // UPDATE POLO ETH BALANCE - add ether

                  console.log("Updated balance_btc_polo: " + (BBP-cost));
                  console.log("Updated balance_eth_polo: " + (BEP+ parseFloat(LAP_v)));


                  Session.set("balance_btc_kraken", BBK + revenue); // UPDATE KRAKEN BTC BALANCE - add bitcoin
                  Session.set("balance_eth_kraken", BEK - parseFloat(LAP_v)); // UPDATE KRAKEN ETH BALANCE - subtract ether

                  console.log("Updated balance_btc_kraken: " + (BBK + revenue));
                  console.log("Updated balance_eth_kraken: " + (BEK - parseFloat(LAP_v)));




                  var tradeData = {
                      tradeTime: new Date().getTime(),
                      tradeFlow: "LAP -> HBK",
                      tradeDetails: "Volume on Polo is same or lower then Kraken",
                      lowestAskPricePolo: LAP_p,
                      lowestAskVolumePolo: LAP_v,
                      tradeCostsPolo: cost,
                      balanceBtcPoloBefore: BBP,
                      balanceBtcPoloAfter: (BBP - cost),
                      balanceEthPoloBefore: BEP,
                      balanceEthPoloAfter: (BEP + parseFloat(LAP_v)),
                      highestBidPriceKraken: HBK_p,
                      highestBidVolumeKraken: LAP_v,
                      tradeRevenueKraken: revenue,
                      balanceBtcKrakenBefore: BBK,
                      balanceBtcKrakenAfter: (BBK + revenue),
                      balanceEthKrakenBefore: BEK,
                      balanceEthKrakenAfter: (BEK - parseFloat(LAP_v)),
                      tradeProfit: profit
                  };

                  Meteor.call("saveTrade", tradeData, function(error, result){
                    if(error){
                      console.log("error", error);
                    }
                    if(result){
                       console.log("Trade Successfuly Saved");
                    }
                  });

                  semafor_LAP_HBK = 0;
                  semafor_LAK_HBP = 1;

                  console.log("SET semafor_LAP_HBK (current exchange flow) to: " + semafor_LAP_HBK);
                  console.log("SET semafor_LAK_HBP (opoosite exchange flow) to: " + semafor_LAK_HBP);

                }



      }
      else {
        console.log("THERE IS NOT ENOUGH BTC BALANCE");
      }



    }
    else if(HBK_v <= BEK) { // VOLUME ON KRAKEN IS LOWER THAN ETHER BALANCE ON POLO
      console.log("VOLUME ON POLO IS BIGGER THEN VOLUME ON KRAKEN");

      //========= buy ETH at lowest ask(SELLING) on POLONIEX but for the volume from KRAKEN (HBK_v) because it is surely lower than volume on POLO=========

      cost = (LAP_p * HBK_v) + (LAP_p * HBK_v * TFP);  // cost of the trade in BTC with the fees
      cost = cost.toFixed(8)*1;


      // if the cost of the trade is less then the BTC balance in the account then do the actula trade
      if (cost < BBP){
        console.log("Price: " + LAP_p + " - Volume: " + HBK_v + " - Cost in BTC + Fees: " + cost);



                //========= sell ETH at highest bid(BUYING) on KRAKEN =========

                // neki timeout
                console.log("API CALL FOR TRADE 2sec");
                // setTimeout(function(){
                //   console.log("TRADE EXECUTED");
                // }, 2000);

                revenue = (HBK_p * HBK_v) - (HBK_p * HBK_v * TFK); // revenue of the trade in BTC with the fees
                revenue = revenue.toFixed(8)*1;


                console.log("Price: " + HBK_p + " - Volume: " + HBK_v + " - Revenue in BTC + Fees: " + revenue);





                var profit = revenue - cost;
                profit = profit.toFixed(8)*1;

                if (profit > 0) {

                  console.log("PROFIT: " + profit);
                  console.log("=================");
                  console.log("TRADE SUCCESFUL");


                  Session.set("balance_btc_polo", BBP-cost); // UPDATE POLO BTC BALANCE - subtract bitcoin
                  Session.set("balance_eth_polo", BEP + parseFloat(HBK_v)); // UPDATE POLO ETH BALANCE - add ether

                  console.log("Updated balance_btc_polo: " + (BBK + revenue));
                  console.log("Updated balance_eth_polo: " + (BEP + parseFloat(HBK_v)));


                  Session.set("balance_btc_kraken", BBK + revenue); // UPDATE KRAKEN BTC BALANCE - add bitcoin
                  Session.set("balance_eth_kraken", BEK - parseFloat(HBK_v)); // UPDATE KRAKEN ETH BALANCE - subtract ether

                  console.log("Updated balance_btc_kraken: " + (BBK + revenue));
                  console.log("Updated balance_eth_kraken: " + (BEK - parseFloat(HBK_v)));


                  var tradeData = {
                      tradeTime: new Date().getTime(),
                      tradeDetails: "Volume on Polo is bigger than volume on Kraken",
                      tradeFlow: "LAP -> HBK",
                      lowestAskPricePolo: LAP_p,
                      lowestAskVolumePolo: HBK_v,
                      tradeCostsPolo: cost,
                      balanceBtcPoloBefore: BBP,
                      balanceBtcPoloAfter: (BBP - cost),
                      balanceEthPoloBefore: BEP,
                      balanceEthPoloAfter: (BEP + parseFloat(HBK_v)),
                      highestBidPriceKraken: HBK_p,
                      highestBidVolumeKraken: HBK_v,
                      tradeRevenueKraken: revenue,
                      balanceBtcKrakenBefore: BBK,
                      balanceBtcKrakenAfter: (BBK + revenue),
                      balanceEthKrakenBefore: BEK,
                      balanceEthKrakenAfter: (BEK - parseFloat(HBK_v)),
                      tradeProfit: profit
                  };

                  Meteor.call("saveTrade", tradeData, function(error, result){
                    if(error){
                      console.log("error", error);
                    }
                    if(result){
                       console.log("Trade Successfuly Saved");
                    }
                  });


                  semafor_LAP_HBK = 0;
                  semafor_LAK_HBP = 1;

                  console.log("SET semafor_LAP_HBK (current exchange flow) to: " + semafor_LAP_HBK);
                  console.log("SET semafor_LAK_HBP (opoosite exchange flow) to: " + semafor_LAK_HBP);

                }







      }
      else {
        console.log("THERE IS NOT ENOUGH BTC BALANCE");
      }


    }
    else {
      console.log("VOLUME ON POLO IS BIGGER THEN VOLUME ON KRAKEN AND THERE IS NOT ENOUGH ETHER BALANCE ON KRAKEN");
    }
  }
  else {
    console.log("NOT ENOUGH SPREAD");
  }



}

function initiateTrade_LAK_HBP() {

  console.log("TRADE INITIATED LAK -> HBP #" + counter_LAP_HBK);
  counter_LAP_HBK++;

  var BBP = Session.get("balance_btc_polo");
  var BEP = Session.get("balance_eth_polo");

  var BBK = Session.get("balance_btc_kraken");
  var BEK = Session.get("balance_eth_kraken");

  var TFP = 0.004;
  var TFK = 0.0015;

  var LAK_p = Session.get("lowestAsk_kraken");
  var LAK_v = Session.get("lowestAsk_volume_kraken");

  var HBP_p = Session.get("highestBid");
  var HBP_v = Session.get("highestBid_volume");

  console.log(Session.get("spread_2"));

  console.log("PRETVORENO U: ");

  var spread = Session.get("spread_2");
  console.log(spread);

  var cost = 0
  var revenue = 0;

  if (spread < spreadLimit) {
    // to create the actual API trade


    // IF THE volume of ETH is same or LOWER thenn POLO then proceed with trade

    if (LAK_v <= HBP_v && LAK_v <= BEP) {

      //========= buy ETH at lowest ask(SELLING) on KRAKEN =========

      cost =(LAK_p * LAK_v) + (LAK_p * LAK_v * TFK);  // cost of the trade in BTC with the fees
      cost = cost.toFixed(8)*1;


      // if the cost of the trade is less then the BTC balance on Kraken and there is enought ETH balance on POLONIEX then do the trade
      if (cost < BBK){
        console.log("Price: " + LAK_p + " - Volume: " + LAK_v + " - Cost in BTC + Fees: " + cost);




                    //========= sell ETH at highest bid(BUYING) on POLO =========

                    // neki timeout
                    console.log("API CALL FOR TRADE 2sec");
                    // setTimeout(function(){
                    //   console.log("TRADE EXECUTED");
                    // }, 2000);

                    revenue = (HBP_p * LAK_v) - (HBP_p * LAK_v * TFP); // revenue of the trade in BTC with the fees
                    revenue = revenue.toFixed(8)*1;


                    console.log("Price: " + HBP_p + " - Volume: " + LAK_v + " - Revenue in BTC + Fees: " + revenue);





                    var profit = revenue - cost;
                    profit = profit.toFixed(8)*1;


                    if (profit > 0) {

                      console.log("PROFIT: " + profit);
                      console.log("=================");
                      console.log("TRADE SUCCESFUL");

                      Session.set("balance_btc_kraken", BBK - cost);
                      Session.set("balance_eth_kraken", BEK + parseFloat(LAK_v) );

                      console.log("Updated balance_btc_kraken: " + (BBK - cost));
                      console.log("Updated balance_eth_kraken: " + (BEK + parseFloat(LAK_v)));


                      Session.set("balance_btc_polo", BBP + revenue); // UPDATE POLO BTC BALANCE - add bitcoin
                      Session.set("balance_eth_polo", BEP - parseFloat(LAK_v)); // UPDATE POLO ETH BALANCE - subtract ether

                      console.log("Updated balance_btc_polo: " + (BBP + revenue));
                      console.log("Updated balance_eth_polo: " + (BEP - parseFloat(LAK_v)));


                      var tradeData = {
                          tradeTime: new Date().getTime(),
                          tradeDetails: "Volume on Kraken is same or lower then Polo",
                          tradeFlow: "LAK -> HBP",
                          lowestAskPriceKraken: LAK_p,
                          lowestAskVolumeKraken: LAK_v,
                          tradeCostsKraken: cost,
                          balanceBtcKrakenBefore: BBK,
                          balanceBtcKrakenAfter: (BBK - cost),
                          balanceEthKrakenBefore: BEK,
                          balanceEthKrakenAfter: (BEK + parseFloat(LAK_v)),
                          highestBidPricePolo: HBP_p,
                          highestBidVolumePolo: LAK_v,
                          tradeRevenuePolo: revenue,
                          balanceBtcPoloBefore: BBP,
                          balanceBtcPoloAfter: (BBP + revenue),
                          balanceEthPoloBefore: BEP,
                          balanceEthPoloAfter: (BEP - parseFloat(LAK_v)),
                          tradeProfit: profit
                      };

                      Meteor.call("saveTrade", tradeData, function(error, result){
                        if(error){
                          console.log("error", error);
                        }
                        if(result){
                           console.log("Trade Successfuly Saved");
                        }
                      });

                      semafor_LAK_HBP = 0;
                      semafor_LAP_HBK = 1;

                      console.log("SET semafor_LAK_HBP (opoosite exchange flow) to: " + semafor_LAK_HBP);
                      console.log("SET semafor_LAP_HBK (current exchange flow) to: " + semafor_LAP_HBK);

                    }







      }
      else {
        console.log("THERE IS NOT ENOUGH BTC BALANCE");
      }



    }
    else if(HBP_v <= BEP){ // VOLUME ON POLO IS LOWER THEN ETH BALANCE ON POLO
      console.log("VOLUME ON KRAKEN IS BIGGER THEN VOLUME ON POLO");

      //========= buy ETH at lowest ask(SELLING) on KRAKEN but for the volume from POLO (HBP_v) because it is surely lower than volume on KRAKEN=========

      cost =(LAK_p * HBP_v) + (LAK_p * HBP_v * TFK);  // cost of the trade in BTC with the fees
      cost = cost.toFixed(8)*1;


      // if the cost of the trade is less then the BTC balance on Kraken and there is enought ETH balance on POLONIEX then do the trade
      if (cost < BBK){
        console.log("Price: " + LAK_p + " - Volume: " + HBP_v + " - Cost in BTC + Fees: " + cost);




                    //========= sell ETH at highest bid(BUYING) on POLO =========

                    // neki timeout
                    console.log("API CALL FOR TRADE 2sec");
                    // setTimeout(function(){
                    //   console.log("TRADE EXECUTED");
                    // }, 2000);

                    revenue = (HBP_p * HBP_v) - (HBP_p * HBP_v * TFP); // revenue of the trade in BTC with the fees
                    revenue = revenue.toFixed(8)*1;


                    console.log("Price: " + HBP_p + " - Volume: " + HBP_v + " - Revenue in BTC + Fees: " + revenue);






                    var profit = revenue - cost;
                    profit = profit.toFixed(8)*1;


                    if (profit > 0) {

                      console.log("PROFIT: " + profit);
                      console.log("=================");
                      console.log("TRADE SUCCESFUL");


                      Session.set("balance_btc_kraken", BBK - cost);
                      Session.set("balance_eth_kraken", BEK + parseFloat(HBP_v));

                      console.log("Updated balance_btc_kraken: " + (BBK - cost));
                      console.log("Updated balance_eth_kraken: " + (BEK + parseFloat(HBP_v)));


                      Session.set("balance_btc_polo", BBP + revenue); // UPDATE POLO BTC BALANCE - add bitcoin
                      Session.set("balance_eth_polo", BEP - parseFloat(HBP_v)); // UPDATE POLO ETH BALANCE - subtract ether

                      console.log("Updated balance_btc_polo: " + (BBP + revenue));
                      console.log("Updated balance_eth_polo: " + (BEP - parseFloat(HBP_v)));


                      var tradeData = {
                          tradeTime: new Date().getTime(),
                          tradeDetails: "Volume on Kraken is bigger then volume on Polo",
                          tradeFlow: "LAK -> HBP",
                          lowestAskPriceKraken: LAK_p,
                          lowestAskVolumeKraken: HBP_v,
                          tradeCostsKraken: cost,
                          balanceBtcKrakenBefore: BBK,
                          balanceBtcKrakenAfter: (BBK - cost),
                          balanceEthKrakenBefore: BEK,
                          balanceEthKrakenAfter: (BEK + parseFloat(HBP_v)),
                          highestBidPricePolo: HBP_p,
                          highestBidVolumePolo: HBP_v,
                          tradeRevenuePolo: revenue,
                          balanceBtcPoloBefore: BBP,
                          balanceBtcPoloAfter: (BBP + revenue),
                          balanceEthPoloBefore: BEP,
                          balanceEthPoloAfter: (BEP - parseFloat(HBP_v)),
                          tradeProfit: profit
                      };

                      Meteor.call("saveTrade", tradeData, function(error, result){
                        if(error){
                          console.log("error", error);
                        }
                        if(result){
                           console.log("Trade Successfuly Saved");
                        }
                      });

                      semafor_LAK_HBP = 0;
                      semafor_LAP_HBK = 1;

                      console.log("SET semafor_LAK_HBP (opoosite exchange flow) to: " + semafor_LAK_HBP);
                      console.log("SET semafor_LAP_HBK (current exchange flow) to: " + semafor_LAP_HBK);



                    }







      }
      else {
        console.log("THERE IS NOT ENOUGH BTC BALANCE");
      }


    }
    else {
      console.log("VOLUME ON KRAKEN IS BIGGER THEN VOLUME ON POLO AND THERE IS NOT ENOUGH ETHER BALANCE ON POLO");
    }
  }
  else {
    console.log("NOT ENOUGH SPREAD");
  }


}

function automateTrades() {

var LAP_v = Session.get("lowestAsk_volume");
var HBP_v = Session.get("highestBid_volume");

var LAK_v = Session.get("lowestAsk_volume_kraken");
var HBK_v = Session.get("highestBid_volume_kraken");

if ((LAP_v >= 1) && (HBK_v => 1)) {

  if (semafor_LAP_HBK) {
      initiateTrade_LAP_HBK();
  }

}else {
  console.log("The volume on the exchange flow LAP -> HBK  is not sufficient");
}

if ((LAK_v >= 1) && (HBP_v >= 1)) {

  if (semafor_LAK_HBP) {
      initiateTrade_LAK_HBP()
  }

}
else {
  console.log("The volume on the exchange flow LAK -> HBP is not sufficient");
}


}


Meteor.setInterval(automateTrades, 2000);
