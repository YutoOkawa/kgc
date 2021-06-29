const coreUtil = require('./coreUtils');

/**
 * ユーザ秘密鍵を生成する
 * @param {*} ask 
 * @param {*} attriblist 
 * @param {*} rng 
 * @returns ユーザ秘密鍵ska
 */
exports.generateattributes = function(ask, attriblist, rng){
    var ska = {};

    var KBase = coreUtil.generateG1Element(rng);
    coreUtil.setOpt(ska, "KBase", KBase);

    var r = new coreUtil.ctx.BIG(0);
    r.rcopy(coreUtil.ctx.ROM_CURVE.CURVE_Order);

    // invA0 := 1/a0
    var invA0 = new coreUtil.ctx.BIG(0);
    invA0.copy(ask["a0"]);
    invA0.invmodp(r);

    var K0 = coreUtil.ctx.PAIR.G1mul(KBase, invA0);
    coreUtil.setOpt(ska, "K0", K0);

    for(var i=0; i<attriblist.length; i++) {
        var attrNum = ask["atr"][attriblist[i]]
        var exp = new coreUtil.ctx.BIG(0);
        exp.copy(ask["b"]);
        exp.imul(attrNum);
        exp.add(ask["a"]);
        exp.invmodp(r);
        var Ku = coreUtil.ctx.PAIR.G1mul(KBase, exp);
        coreUtil.setOpt(ska, "K"+String(attrNum), Ku);
    }

    return ska;
};