const express = require('express');
const cors = require('cors');
const fs = require('fs');
const CTX = require('amcl-js').CTX;
const ctx = new CTX('BN254');

const utils = require('./public/js/utils.js');
const trusteeSetup = require('./public/core/trusteeSetup');
const coreUtil = require('./public/core/coreUtils');

require('dotenv').config();
const env = process.env;

const app = express();
app.use(express.json());
app.use(cors());

const setup = require('./routes/setup');
const attrgen = require('./routes/attrgen');
app.use('/setup',setup);
app.use('/attrgen',attrgen);

app.get('/',function(req,res) {
    res.send({"test":"Hello"});
});

app.listen(4000,function() {
    console.log('Listening on port 4000');
    var filepath = './public/key/localhost';
    if (!fs.existsSync(filepath+'.tpk')) {
        var rng = coreUtil.initRng(ctx);
        const tpk = trusteeSetup.trusteesetup(["Aqours", "AZALEA", "GuiltyKiss", "CYaRon"], rng);
        console.log(tpk);
        coreUtil.outputBytes(tpk['g']);
        coreUtil.writeKey(tpk, filepath+".tpk");
        console.log("鍵を生成しました。");
    } else {
        console.log('既に鍵が生成されています。');
    }
});