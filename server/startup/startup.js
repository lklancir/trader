Meteor.publish("arbtrades", function(){
    return arbTrades.find();

});

SyncedCron.add({
      name: 'GetTickerInfo cron',
      schedule: function(parser) {
        return parser.text('every 20 seconds');
      },
      job: function() {
        Meteor.call('GetTickerInfo');
          }
        });



 Meteor.startup(function () {
     // code to run on server at startup
    //  SyncedCron.start();

     // Stop jobs after 15 seconds
    //  Meteor.setTimeout(function() { SyncedCron.stop(); }, 15 * 1000);


  });
