const coreUtil = require('./coreUtils');
var tpk = {};

/**
 * Trustee Setupを実行する
 * @param {Array} attributes 属性集合の配列
 * @param {*} rng 乱数生成関数
 * @returns Trustee Public Key
 */
exports.trusteesetup = function(attributes, rng) {
    var tmax = 2 * attributes.length;
    var G = coreUtil.generateG1Element(rng);
    coreUtil.setOpt(tpk, "g", G);

    for (var i=0; i<tmax+1; i++) {
        var h = coreUtil.generateG2Element(rng);
        coreUtil.setOpt(tpk, "h"+String(i), h);
    }

    var attriblist = {};
    counter = 2;
    for(var i=0; i<attributes.length; i++) {
        attriblist[attributes[i]] = counter;
        counter++;
    }
    coreUtil.setOpt(tpk, "atr", attriblist);

    return tpk;
};

exports.tpk = tpk;