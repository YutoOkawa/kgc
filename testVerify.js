const coreUtils = require('./public/core/coreUtils');
const crypto = require('crypto');
const e = require('express');
var rng = coreUtils.initRng(coreUtils.ctx);
var r = new coreUtils.ctx.BIG(0);
r.rcopy(coreUtils.ctx.ROM_CURVE.CURVE_Order);
var integerList = []
for (var i=0; i<6; i++) {
    integerList[i] = new coreUtils.ctx.BIG(i);
}
var digest = crypto.createHash('sha512').update(Buffer.from('hello')).digest();
var mu = coreUtils.ctx.BIG.fromBytes(digest);
mu.mod(r);
var msp = [[0],[1],[0],[1]];

// tpk
var g = coreUtils.generateG1Element(rng);
var h = [];
for (var i=0; i<5; i++) {
    h[i] = coreUtils.generateG2Element(rng);
}

// ask
var a =  coreUtils.ctx.BIG.randtrunc(r, 16*coreUtils.ctx.ECP.AESKEY, rng);
var b =  coreUtils.ctx.BIG.randtrunc(r, 16*coreUtils.ctx.ECP.AESKEY, rng);
var c =  coreUtils.ctx.BIG.randtrunc(r, 16*coreUtils.ctx.ECP.AESKEY, rng);

// apk
var A = [];
for (var i=0; i<4; i++) {
    A[i] = coreUtils.ctx.PAIR.G2mul(h[i+1], a);
}
var B = [];
for (var i=0; i<4; i++) {
    B[i] = coreUtils.ctx.PAIR.G2mul(h[i+1], b);
}
var C = coreUtils.ctx.PAIR.G1mul(g, c);

// ska
var Kbase = coreUtils.generateG1Element(rng);
var exp = coreUtils.ctx.BIG.modmul(b, integerList[5], r);
exp = coreUtils.ctx.BIG.modadd(exp, a, r);
// var exp = new coreUtils.ctx.BIG(0); // これは失敗
// exp.copy(b);
// exp.imul(5);
// exp.add(a);
exp.invmodp(r);
var K5 = coreUtils.ctx.PAIR.G1mul(Kbase, exp);

// Signature
var rlist = [];
for (var i=0; i<5; i++) {
    rlist[i] = coreUtils.ctx.BIG.randtrunc(r, 16*coreUtils.ctx.ECP.AESKEY, rng);
}
var Y = coreUtils.ctx.PAIR.G1mul(Kbase, rlist[0]);
var S = [];
for (var i=0; i<4; i++) {
    var gmu = coreUtils.ctx.PAIR.G1mul(g, mu);
    gmu.add(C);
    S[i] = coreUtils.ctx.PAIR.G1mul(gmu, rlist[i+1]);

    if (i==3) {
        var Ku = coreUtils.ctx.PAIR.G1mul(K5, rlist[0]);
        S[i].add(Ku);
    }
}

var P1; // (A1B1^3)^r2 + (A1B1^5)^r4
for (var i=0; i<4; i++) {
    var A1B1i = coreUtils.ctx.PAIR.G2mul(B[0], integerList[i+2]);
    A1B1i.add(A[0]);
    var Mi1ri= coreUtils.ctx.BIG.modmul(integerList[msp[i][0]], rlist[i+1], r);
    var multi = coreUtils.ctx.PAIR.G2mul(A1B1i, Mi1ri);
    if (i == 0) {
        P1 = multi;
    } else if (!multi.is_infinity()) {
        P1.add(multi);
    } else {
        console.log('infinity.');
    }
}

// check 
// e(Kbase, P1) = e(Kbase, r2(a+3b)h1 + r4(a+5b)h1) = e(Kbase, r2(a+3b)h1) * e(Kbase, r4(a+5b)h1)
var eKbaseP1 = coreUtils.ctx.PAIR.ate(P1, Kbase);
var vKbaseP1 = coreUtils.ctx.PAIR.fexp(eKbaseP1);
var a3br2 = coreUtils.ctx.BIG.modmul(b, integerList[3], r); //r2(a+3b)
a3br2 = coreUtils.ctx.BIG.modadd(a3br2, a, r);
var a5br4 = coreUtils.ctx.BIG.modmul(b, integerList[5], r); //r4(a+5b)
a5br4 = coreUtils.ctx.BIG.modadd(a5br4, a, r);
var er2 = coreUtils.ctx.PAIR.ate(coreUtils.ctx.PAIR.G2mul(h[1], a3br2), coreUtils.ctx.PAIR.G1mul(Kbase, rlist[2])); // e(r2*Kbase, (a+3b)h1)
var er4 = coreUtils.ctx.PAIR.ate(coreUtils.ctx.PAIR.G2mul(h[1], a5br4), coreUtils.ctx.PAIR.G1mul(Kbase, rlist[4])); // e(r4*Kbase, (a+5b)h1)
er2.mul(er4);
var vr2 = coreUtils.ctx.PAIR.fexp(er2); // ate * ateをfexpで通すことで成功！->ate同士をかけてfexpに通すことでいける？
console.log('e(Kbase, P1)?:',vKbaseP1.equals(vr2));

// Verify
var prod;
for (var i=0; i<4; i++) {
    var A1B1i = coreUtils.ctx.PAIR.G2mul(B[0], integerList[i+2]);
    A1B1i.add(A[0]);
    var ecp2_elem = coreUtils.ctx.PAIR.G2mul(A1B1i, integerList[msp[i][0]]);
    var eprod = coreUtils.ctx.PAIR.ate(ecp2_elem, S[i]); // fexpするかどうか？
    if (i==0) {
        prod = eprod;
    } else {
        prod.mul(eprod);
    }
    
}
prod = coreUtils.ctx.PAIR.fexp(prod);

var emul;
var cgmu = coreUtils.ctx.PAIR.G1mul(g, mu);
cgmu.add(C);
var eCguP = coreUtils.ctx.PAIR.ate(P1, cgmu);
var eYh1 = coreUtils.ctx.PAIR.ate(h[1], Y);
emul = eCguP;
emul.mul(eYh1);
emul = coreUtils.ctx.PAIR.fexp(emul);

console.log(prod.equals(emul));
