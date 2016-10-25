Meteor.startup(function () {






    Session.setDefault('spread_1', 0);
    Session.setDefault('spread_2', 0);


    Session.setDefault('balance_btc_polo', 0.5);
    Session.setDefault('balance_eth_polo', 40);
    Session.setDefault('balance_btc_kraken', 0.5);
    Session.setDefault('balance_eth_kraken', 40);

    


    Session.setDefault("currencyPairPolo", "BTC_ETH");
    Session.setDefault("currencyPairKraken", "ETHXBT");


    Session.setDefault('last', 0);
    Session.setDefault('lowestAsk', 0);
    Session.setDefault('lowestAsk_volume', 0);

    Session.setDefault('highestBid', 0);
    Session.setDefault('highestBid_volume', 0);

    Session.setDefault('percentChange', 0);
    Session.setDefault('baseVolume', 0);
    Session.setDefault('quoteVolume', 0);

    Session.setDefault('last_kraken', 0);
    Session.setDefault('lowestAsk_kraken', 0);
    Session.setDefault('lowestAsk_volume_kraken', 0);

    Session.setDefault('highestBid_kraken', 0);
    Session.setDefault('highestBid_volume_kraken', 0);

    Session.setDefault('percentChange_kraken', 0);
    Session.setDefault('baseVolume_kraken', 0);
    Session.setDefault('quoteVolume_kraken', 0);




    dataChart = null;



    sAlert.config({
        effect: '',
        position: 'top-right',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });

});
