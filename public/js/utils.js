const fs = require('fs');
/**
 * データをファイルに書き込む
 * @param {String} filename 保存ファイル名
 * @param {*} data 保存データ
 */
exports.writeKeyFile = function(filename,data) {
    try {
        fs.writeFileSync(filename,data,{flag:'a'});
        console.log(filename+",writeEnd");
    } catch(e) {
        console.log(e);
    }
};

exports.readKeyFile = function(filename) {
    try {
        var data = fs.readFileSync(filename,'utf-8');
        console.log(filename+',readEnd');
        return data
    } catch(e) {
        console.log(e);
        return e
    }
};

exports.toArrayBuffer = function(buf,name) {
    if (!name) {
        throw new TypeError("name not specified in toArrayBuffer");
    }

    if (typeof buf == "string") {
        // base64url to base64
        buf = buf.replace(/-/g,"+").replace(/_/g,"/");
        // base64 to Buffer
        buf = Buffer.from(buf,"base64");
    }

    // Buffer or Array to Uint8Array
    if (buf instanceof Buffer || Array.isArray(buf)) {
        buf = new Uint8Array(buf);
    }

    // Uint8Array to ArrayBuffer
    if (buf instanceof Uint8Array) {
        buf = buf.buffer;
    }

    // error if none of the above worked
    if (!(buf instanceof ArrayBuffer)) {
        throw new TypeError(`could not coerce '${name}' to ArrayBuffer`);
    }

    return buf;
};