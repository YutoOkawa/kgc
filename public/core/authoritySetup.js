const coreUtil = require('./coreUtils');

/**
 * 
 * @param {*} tpk Trustee Public Key
 * @param {*} rng 乱数生成関数
 * @returns ask(Master Key)とapk(Publc Key)を返す
 */
exports.authoritysetup = function(tpk, rng) {
    var keypair = {};
    var ask = {};
    var apk = {};
    var tmax = Object.keys(tpk["atr"]).length;

    var r = new coreUtil.ctx.BIG(0);
    r.rcopy(coreUtil.ctx.ROM_CURVE.CURVE_Order);

    var a0 = coreUtil.ctx.BIG.randtrunc(r, 16*coreUtil.ctx.ECP.AESKEY, rng);
    var a = coreUtil.ctx.BIG.randtrunc(r, 16*coreUtil.ctx.ECP.AESKEY, rng);
    var b = coreUtil.ctx.BIG.randtrunc(r, 16*coreUtil.ctx.ECP.AESKEY, rng);
    
    coreUtil.setOpt(ask, "a0", a0);
    coreUtil.setOpt(ask, "a", a);
    coreUtil.setOpt(ask, "b", b);
    coreUtil.setOpt(ask, "atr", tpk["atr"]);

    var A0 = coreUtil.ctx.PAIR.G2mul(tpk["h0"], a0);
    coreUtil.setOpt(apk, "A0", A0);

    for (var i=1; i<tmax+1; i++) {
        var A = coreUtil.ctx.PAIR.G2mul(tpk["h"+String(i)], a);
        coreUtil.setOpt(apk, "A"+String(i), A);
    }

    for (var i=1; i<tmax+1; i++) {
        var B = coreUtil.ctx.PAIR.G2mul(tpk["h"+String(i)], b);
        coreUtil.setOpt(apk, "B"+String(i), B);
    }

    var c = coreUtil.ctx.BIG.randtrunc(r, 16*coreUtil.ctx.ECP.AESKEY, rng);
    var C = coreUtil.ctx.PAIR.G1mul(tpk["g"], c);
    coreUtil.setOpt(apk, "C", C);

    coreUtil.setOpt(keypair, "ask", ask);
    coreUtil.setOpt(keypair, "apk", apk);

    return keypair;
};