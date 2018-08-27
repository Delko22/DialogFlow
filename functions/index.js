
const functions = require('firebase-functions');
var dbAccess = require('./databaseAccess');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.webhook = functions.https.onRequest((request, response) => {

  function overviewProducts() {
      var message = {
        "fulfillmentMessages": []
      };

      switch (request.body.queryResult.languageCode) {
        case 'nl':

        var outputContexts = request.body.queryResult.outputContexts;
        var parameters;

        for ( var i = 0; i < outputContexts.length; i++ ) {
          if ( outputContexts[i].name.indexOf("newsubscription-followup" > -1))
          {
            parameters = outputContexts[i].parameters;
            break;
          }
        }

        var products = parameters.subscription;
        
        dbAccess.queryProductFromDB(products, function(productMessage) {
          console.log(productMessage);

          message.fulfillmentMessages = productMessage;
          response.send(message);

        });

      // break;
    }

      // storeInDB();
  }


  switch (request.body.queryResult.action) {
    case 'NewSubscription.OverviewProducts':
      dbAccess.storeProductsInDB();
      dbAccess.storeCustomersInDB();
      overviewProducts();
      break;

    default:
      break;
  }

});
