const admin = require("firebase-admin");
const _ = require("lodash");
const mathjs = require('mathjs');
const localDBanalysis = () => {
    let db = admin.database();

    db.ref('ONTARIO-OCS/cartridges')
        .orderByChild("dateAdded")
        .limitToLast(1)
        .once("child_added").then((snapshot) => {
        let val = snapshot.val();
        // let today = val['Thu Apr 23 2020 08:18:18 GMT+0000 (Coordinated Universal Time)'];

        // determine number of products
        let arrOfProducts = val.products;
        let variantCounter = 0;
        let avgMlPerBottle = [];
        let thcArray = [];
        let cbdArray = [];
        let median;

        for (let i = 0; i < arrOfProducts.length; i++) {
            // determine number of variants
            let numberOfVariants = arrOfProducts[i].variants.length;
            variantCounter += numberOfVariants;

            // push millilitre amnts into an array
            for (let j = 0; j < numberOfVariants; j++) {
                let replaceVal = arrOfProducts[i].variants[j].option1.slice(0, -1);
                replaceVal = parseFloat(replaceVal);
                avgMlPerBottle.push(replaceVal)
            }

            // get median price
            let sortedMedianArray = _.sortBy(avgMlPerBottle);
            const len = sortedMedianArray.length;
            const mid = Math.ceil(len / 2);
            median = len % 2 == 0 ? (sortedMedianArray[mid] + sortedMedianArray[mid - 1]) / 2 : sortedMedianArray[mid - 1];


        }
        // average amount of THC
        for (let k = 0; k < arrOfProducts.length; k++) {
            let replaceVal = arrOfProducts[k].tags;
            let thc = _.filter(replaceVal, (s) => {
                return s.indexOf('thc_content_max') !== -1;
            });
            let thcVal = thc[0].replace("thc_content_max--", "");
            thcArray.push(parseInt(thcVal));
            thcArray = _.sortBy(thcArray);
        }

        // median amount of THC
        const thcLen = thcArray.length;
        const midThc = Math.ceil(thcLen / 2);
        let medianThc = thcLen % 2 == 0 ? (thcArray[midThc] + thcArray[midThc - 1]) / 2 : thcArray[midThc - 1];

        // average amount of CBD
        for (let l = 0; l < arrOfProducts.length; l++) {
            let replaceVal = arrOfProducts[l].tags;
            let cbd = _.filter(replaceVal, (s) => {
                return s.indexOf('cbd_content_max--') !== -1;
            });
            let cbdVal = cbd[0].replace("cbd_content_max--", "");
            cbdArray.push(parseInt(cbdVal));
            cbdArray = _.sortBy(cbdArray);
        }

        // median amount of CBD
        const cbdLen = thcArray.length;
        const midCbd = Math.ceil(cbdLen / 2);
        let medianCbd = cbdLen % 2 == 0 ? (cbdArray[midCbd] + cbdArray[midCbd - 1]) / 2 : cbdArray[midCbd - 1];

        const mlPerBottleMean =_.mean(avgMlPerBottle)
        // general product
        console.log('GENERAL PRODUCT');
        console.log('Today there are ' + val.products.length + ' vape cartridges on OCS.ca');
        console.log('Today there is ' + variantCounter + ' variants available. These include different sizes and flavours');
        // cartridge volume
        console.log('');
        console.log('BOTTLE SIZE');
        console.log('The mean liquid volume per cartridge is ' + parseInt(mlPerBottleMean*1000) + ' mg of liquid per vape');
        console.log('The median liquid volume per catridge is ' + median*1000 + ' mg of liquid per vape');
        console.log('The mode liquid volume per cartridge is ' + mathjs.mode(avgMlPerBottle)*1000 + ' mg of liquid per vape');
        // THC data
        console.log('');
        console.log('THC DATA');
        console.log('The mean THC percentage is ' + parseInt(_.mean(thcArray)) + '%');
        console.log('The median amount of THC is ' + medianThc + '%');
        console.log('The mean amount of THC in a vape is ' + parseInt(mlPerBottleMean*1000) * (parseInt(_.mean(thcArray))/100) + ' mg of THC')
        console.log('The mode amount of THC in a vape is ' + parseInt(mathjs.mode(thcArray)) + '%');
        // CBD data
        console.log('');
        console.log('CBD DATA');
        console.log('The mean CBD percentage is ' + parseInt(_.mean(cbdArray)) + '%');
        console.log('The median amount of CBD is ' + medianCbd + '%');
        console.log('The mean amount of CBD in a vape is ' + parseInt(mlPerBottleMean*1000) * (parseInt(_.mean(cbdArray))/100) + ' mg of CBD')
        console.log('The mode amount of CBD in a vape is ' + parseInt(mathjs.mode(cbdArray)) + '%');

    });

    db.ref('ONTARIO-OCS/driedFlowerCannabis')
        .orderByChild("dateAdded")
        .limitToLast(1)
        .once("child_added").then((snapshot) => {

    });
};
module.exports = localDBanalysis;
