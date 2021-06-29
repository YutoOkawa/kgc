const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const base64url = require('base64url');
const coreUtil = require('../public/core/coreUtils');
const authoritySetup = require('../public/core/authoritySetup');
const router = express.Router();

router.post('/',function(req,res) {
    // 保存ファイル名の生成(IDのSHA256ハッシュ値)
    userid = req.body.userid;
    console.log(req.body);
    var sha256 = crypto.createHash('sha256');
    sha256.update(userid);
    var credentialId = sha256.digest();
    // 鍵の保存ファイル名作成
    filepath = './public/key/'+credentialId.toString('hex');
    // 鍵が既に存在しているかを確認
    if(!(fs.existsSync(filepath+'.apk') && fs.existsSync(filepath+'.ask'))) {
        const tpk = coreUtil.readKey('./public/key/localhost.tpk');
        /* authoritySetupの実行 */
        var rng = coreUtil.initRng(coreUtil.ctx);
        var keypair = authoritySetup.authoritysetup(tpk, rng);
        /* 鍵情報の保存 */
        coreUtil.writeKey(keypair['apk'], filepath+'.apk');
        coreUtil.writeKey(keypair['ask'], filepath+'.ask');
        /* 鍵情報の送信 */
        res.send({
            message: '鍵を生成しました。',
            credentialId: base64url.encode(credentialId)
        });
    } else {
        res.send({
            message:'既に鍵が存在しています。',
            credentialId: base64url.encode(credentialId)
        });
    }
});

module.exports = router;