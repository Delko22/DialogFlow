const functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
var db = admin.database();
var ref = db.ref("telenet/test/");

module.exports = {
    
    storeCustomersInDB: function () {
        var usersRef = ref.child("customers");
        usersRef.set({
          "1": {
            date_of_birth: "June 23, 1912",
            full_name: "Alan Turing",
            address: "Mechelsesteenweg 53, Edegem",
            phone: "034558829"
          },
          "2": {
            date_of_birth: "December 9, 1906",
            full_name: "Grace Hopper",
            address: "Edegemseseteenweg 34, Mortsel",
            phone: "034568322"
          },
          "3": {
            date_of_birth: "October 4, 1983",
            full_name: "Tom Franckx",
            address: "Kloosterstraat 22, Antwerpen",
            phone: "034570283"
          },
          "4": {
            date_of_birth: "Februari 23, 1978",
            full_name: "Francine Dekoninckx",
            address: "Sint-Augustusstraat 99, Antwerpen",
            phone: "034569854"
          },
          "5": {
            date_of_birth: "March 15, 1991",
            full_name: "Guido Vandegaselle",
            address: "Ludovicxstraat 125, Antwerpen",
            phone: "0488993385"
          }
        });
      },

      storeProductsInDB: function() {
        var productRef = ref.child("products");
        productRef.set({
          "Internet": [
              {
                name: "Basic internet",
                monthly_price: 27.80,
                additional_cost: 50,
                specifications: "50 Mbps down / 5 Mbps up",
                site: "https://www2.telenet.be/nl/internet-en-tv/internet/bestel-basic-internet/",
                image: "https://image.ibb.co/gkW7He/Screen_Shot_2018_08_22_at_09_03_58.png"
              },
              {
                name: "Internet Fiber 100",
                monthly_price: 41.50,
                additional_cost: 50,
                specifications: "100 Mbps down / 10 Mbps up",
                site: "https://www2.telenet.be/nl/internet-en-tv/internet/bestel-internet-fiber-100/",
                image: "https://image.ibb.co/cGLCiK/Screen_Shot_2018_08_22_at_09_04_17.png"
              },
              {
                name: "Internet Fiber 200",
                monthly_price: 54.00,
                additional_cost: 0,
                specifications: "200 Mbps down / 20 Mbps up",
                site: "https://www2.telenet.be/nl/internet-en-tv/internet/bestel-internet-fiber-200/",
                image: "https://image.ibb.co/hKtyOK/Screen_Shot_2018_08_22_at_09_04_23.png"
              }
            ],
          "Mobile": [
              {
                name: "King",
                monthly_price: 10,
                additional_cost: 0,
                specifications: "1.5 GB, 150 minuten en ongelimiteerd sms'en",
                site: "https://www2.telenet.be/nl/mobiel/abonnementen/king-en-kong/king-kong/bestel-king/",
                image: "https://image.ibb.co/mOxxdU/Screen_Shot_2018_08_27_at_15_04_40.png"
              },
              {
                name: "Kong",
                monthly_price: 15,
                additional_cost: 0,
                specifications: "4 GB, 500 minuten en ongelimiteerd sms'en",
                site: "https://www2.telenet.be/nl/mobiel/abonnementen/king-en-kong/king-kong/bestel-kong/",
                image: "https://image.ibb.co/i1ZcdU/Screen_Shot_2018_08_27_at_15_05_08.png"
              }
            ],
          "FixedLinePhone": [
              {
                name: "Freephone Europe",
                monthly_price: 22.60,
                additional_cost: 50,
                specifications: "Onbeperkt bellen tijdens daluren naar vaste BE nummers, 2000 minuten tijdens daluren naar mobiele nummers en internationaal",
                site: "https://www2.telenet.be/nl/internet-en-tv/vaste-telefonie/bestel-freephone/",
                image: "https://image.ibb.co/c7SKsp/Screen_Shot_2018_08_27_at_15_03_24.png"
              }
            ],
          "TV": [
              {
                name: "Digitale TV",
                monthly_price: 27.10,
                additional_cost: 50,
                specifications: "83 zenders, waarvan 40 in HD",
                site: "https://www2.telenet.be/nl/internet-en-tv/digitale-tv/bestel-digitale-tv/",
                image: "https://image.ibb.co/n2oQXp/Screen_Shot_2018_08_27_at_15_01_54.png"
              }
            ]
        });
      },
    
      readFromDB: function () {
        ref.once("value", function(snapshot) {
          console.log(snapshot.val());
        });
      },
    
      queryProductFromDB: function (products, cb) {
        var productsRef = ref.child("products");
        var productContents = [];

        console.log(products);

        productsRef.orderByKey().on("child_added", function(snapshot) {
            console.log("Entered the productsRef CB");
            console.log("snapshot.key and snapshot.val(): " + snapshot.key + " : " + snapshot.val());

            if ( products.includes(snapshot.key) ) {
                console.log("Inside the if");

                productContents.push(                        
                    {
                        "text": {
                            "text": [
                                snapshot.key
                            ]   
                        }
                    }
                );
                
                snapshot.forEach(function(productSnapshot){
                    console.log("Entered the snapshot foreach");
                    // console.dir(productSnapshot.key + " : " + productSnapshot.val(), {depth: null});
                    console.log("productSnapshot.key: " + productSnapshot.key);
                    console.log("productSnapshot.val().name: " + productSnapshot.val().name);


                    productContents.push(
                        {
                            "card": {
                            "title": productSnapshot.val().name,
                            "subtitle": productSnapshot.val().specifications,
                            "imageUri": productSnapshot.val().image,
                            "buttons": 
                                [
                                    {
                                    "text":"Meer info",
                                    "postback": productSnapshot.val().site
                                    }
                                ]
                            }
                        }
                    );
                });                
            }
      });

      cb(productContents);
    }
}