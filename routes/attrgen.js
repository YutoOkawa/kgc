const express = require('express');
const fs = require('fs');
const base64url = require('base64url');
const coreUtil = require('../public/core/coreUtils');
const generateAttributes = require('../public/core/generateAttributes');
const router = express.Router();

router.post('/',function(req,res) {
    var credentialId = base64url.toBuffer(req.body.credentialId).toString('hex');
    var attributes = req.body.attributes;
    var filepath = './public/key/'+credentialId;
    console.log(filepath);
    console.log(attributes);
    if((fs.existsSync(filepath+'.apk') && fs.existsSync(filepath+'.ask'))) {
        var ask = coreUtil.readKey(filepath+'.ask');
        var rng = coreUtil.initRng(coreUtil.ctx);
        var ska = generateAttributes.generateattributes(ask, attributes, rng);
        var tpk = coreUtil.readKey('./public/key/localhost.tpk');
        var apk = coreUtil.readKey(filepath+'.apk');
        ska = coreUtil.KeyToCBOR(ska);
        tpk = coreUtil.KeyToCBOR(tpk);
        apk = coreUtil.KeyToCBOR(apk);
        console.log(tpk, apk, ska);
        res.send({
            tpk: tpk,
            apk: apk,
            ska: ska,
            credentialId: credentialId
        });
    } else {
        res.send()
    }
});

module.exports = router;