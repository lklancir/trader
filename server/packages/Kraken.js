var KrakenClient = Meteor.npmRequire('kraken-api');
var kraken = new KrakenClient('taiYR79Ogdc004+P5VbM2GwwN8EwlUxXBSQPNz0BvsfDIwz10tbR40D9', '94O69mm2X6DA9aDe7X/bAd5hS2/Vmm7SnulhwpOV8NjHMK5yGi2+27v4wpxzYnw0kH9nPX2oQ6gDk14cOcb8NA==');

// Display user's balance
// kraken.api('Balance', null, function(error, data) {
//     if(error) {
//         console.log(error);
//     }
//     else {
//         console.log(data.result);
//     }
// });



// Get Ticker Info
Meteor.methods({
  GetTickerInfo: function(currencyPair){



    Future = Npm.require('fibers/future');
    var myFuture = new Future();

    kraken.api('Ticker', {"pair": currencyPair}, function(error, data) {
        if(error) {
            console.log(error);
            myFuture.return(error.result);
        }
        else {
            switch (currencyPair) {
              case "ETHXBT":

                myFuture.return(data.result.XETHXXBT);
                break;
              case "XBTUSD":
                myFuture.return(data.result.XXBTZUSD);
                break;
              default:

            }


        }
    });

    result = myFuture.wait();

    console.log("EHEHEHEHEHHEEH");
    console.log(result);


    return result;


  }
});


// SyncedCron.add({
//     name: 'Crunch some important numbers for the marketing department',
//     schedule: function(parser) {
//       // parser is a later.parse object
//       return parser.text('every 5 seconds');
//     },
//     job:
//   });
