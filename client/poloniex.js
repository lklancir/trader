wsuri = "wss://api.poloniex.com";
connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
});


function tickerEvent (args,kwargs) {

  var pair = Session.get("currencyPairPolo");

  if (args[0]==pair) {


    Session.set('last', args[1]);
    Session.set('lowestAsk', args[2]);
    Session.set('highestBid', args[3]);
    Session.set('percentChange', args[4]);
    Session.set('baseVolume', args[5]);
    Session.set('quoteVolume', args[6]);


    Session.set("spread_1", parseFloat(args[2] - (Session.get("highestBid_kraken"))).toFixed(8) );

    Session.set("spread_2", parseFloat((Session.get("lowestAsk_kraken")) - args[3]).toFixed(8) );





    dataChart.series[0].data[0].update(args[2]*1);
    dataChart.series[0].data[1].update(args[3]*1);
    dataChart.series[0].data[2].update(Session.get("spread")*1);




    if ((Session.get('spread_1')) < 0) {
      $('h4').css({"color":"green"});
    }
    else {
      $('h4').css({"color":"red"});
    }

    if ((Session.get('spread_2')) < 0) {
      $('h5').css({"color":"green"});
    }
    else {
      $('h5').css({"color":"red"});
    }




  }

}

function marketEvent (args,kwargs) {
  if (args[0].type == "orderBookModify" && args[0].data.type == "ask" && args[0].data.rate == Session.get('lowestAsk')) {

    Session.set("lowestAsk_volume", args[0].data.amount);

  }

  if (args[0].type == "orderBookModify" && args[0].data.type == "bid" && args[0].data.rate == Session.get('highestBid')) {
    Session.set("highestBid_volume", args[0].data.amount);
  }
}

// function trollboxEvent (args,kwargs) {
//         console.log(args);
// }



connection.onopen = function (session) {
  console.log("Websocket connection opened");

        session.subscribe(Session.get("currencyPairPolo"), marketEvent);
        session.subscribe('ticker', tickerEvent);
        // session.subscribe('trollbox', trollboxEvent);
}

connection.onclose = function () {
  console.log("Websocket connection closed");
}

connection.open();







$(function () {
    $(document).ready(function () {


    dataChart = new Highcharts.Chart({
        chart: {
            renderTo : 'container',
            type: 'column',
            events:{
              load: tickerEvent
            }
        },
        title: {
            text: 'Column chart with negative values'
        },

        plotOptions: {
            series: {
                minPointLength: 3
            }
        },


        xAxis: {
            categories: ['Lowest Ask', 'Highest Bid', "Spread Polo vs Kraken"]
        },

        yAxis: {
          labels: {
              format: '{value:.5f}'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Poloniex',
            data: [0,0,0]
        }, {
            name: 'Kraken',
            data: [0,0,0]
        }]
    });
  });

});
