const fetch = require('node-fetch');
const admin = require("firebase-admin");
const date = new Date();
let settings = { method: "Get" };

// this function is called first => from app.js
const getResults = () => {
    // Get a database reference to our blog
    // create db path reference
    let db = admin.database();
    let refOCSfull = db.ref("ONTARIO-OCS");
    let refBCfull = db.ref("BC-BCCS");

    let dateToString = date.toString();

    let pathArray = ['driedFlowerCannabis',
        'preRolls',
        'vapeKitsCartridges',
        'oilProducts',
        'capsules',
        'bakedGoodsSnacks',
        'chocolate',
        'candy',
        'driedFlowerCannabis',
        'preRolled',
        'capsules',
        'oilProducts',
        'bestSellers',
        'cartridges',
        'confectionary',
        'beverages',
        'baked-goods'];
    let urlArray = ["https://www.bccannabisstores.com/collections/flower/product.json",
        "https://www.bccannabisstores.com/collections/pre-rolls/products.json",
        "https://www.bccannabisstores.com/collections/vape-kits-cartridges/products.json",
        "https://www.bccannabisstores.com/collections/oil-products/products.json",
        "https://www.bccannabisstores.com/collections/capsules/products.json",
        "https://www.bccannabisstores.com/collections/baked-goods-snacks/products.json",
        "https://www.bccannabisstores.com/collections/chocolate/products.json",
        "https://www.bccannabisstores.com/collections/chews-candy/products.json",

        "https://www.ocs.ca/collections/dried-flower/products.json",
        "https://www.ocs.ca/collections/pre-rolls/products.json",
        "https://www.ocs.ca/collections/capsules/products.json",
        "https://www.ocs.ca/collections/oils/products.json",
        "https://www.ocs.ca/collections/best-sellers/products.json",
        "https://www.ocs.ca/collections/cartridges/products.json",
        "https://www.ocs.ca/collections/confectionary/products.json",
        "https://www.ocs.ca/collections/beverages/products.json",
        "https://www.ocs.ca/collections/baked-goods/products.json",
    ];

    let albertaUrlArray = [
        'albertaBeverages',
        'albertaCapsule',
        'albertaFlower',
        'albertaEdibles',
        'albertaExtracts',
        'albertaOilsAndSprays',
        'albertaPreRolls',
    ];
    let albertaPathArray = [
        'https://albertacannabis.org/shop/Cannabis=aglc_cannabis-cannabis?f=format%3DBeverage%7CIced%20Tea%7CSparkling%20Beverages%7CSodas%7CDistillate%20Liquid%7CDistillate%20Powder%7CTea%20Bags%7CCoffee%20Pods',
        'https://albertacannabis.org/shop/Cannabis=aglc_cannabis-cannabis?f=format%3DCapsules%7CSoft%20Gel',
        'https://albertacannabis.org/shop/Cannabis=aglc_cannabis-cannabis?f=format%3DDried%20Flower',
        'https://albertacannabis.org/shop/Cannabis=aglc_cannabis-cannabis?f=format%3DBrownies%7CChews%2FGummies%7CSoft%20Chews%7CChocolate%7CCookies%7CGum%7CHard%20Candy%7COral%20Strips%7CSalty%20Snacks%7CPet%20Edibles',
        'https://albertacannabis.org/shop/Cannabis=aglc_cannabis-cannabis?f=format%3DShatter%7CWax%7CCaviar%7CBidder%7CCrumble%7CHigh%20Terpene%20Concentrate%7CTerpene%20Extract%7CLive%20Resin%7CResin%7CLive%20Ice%20Hash%7CIce%20Hash%7CLive%20Rosin%7CRosin%7CKief',
        'https://albertacannabis.org/shop/Cannabis=aglc_cannabis-cannabis?f=format%3DOil%7COral%20Spray',
    ];

    for (let i = 0; i < urlArray.length; i++) {
        if (pathArray.length === urlArray.length) {
            let jsonURL = urlArray[i];
            let provinceRef = i <= 7 ? refBCfull : refOCSfull;
            let pathFromShopify = pathArray[i];
            let pageRef = provinceRef.child(pathFromShopify + "/" + dateToString);
            fetch(jsonURL, settings)
                .then(res => res.json())
                .then((JSONproductList) => {
                    pageRef.set(JSONproductList);
                    return;
                })
        }
    }
    console.log('ended scraper');
};

module.exports = getResults;
