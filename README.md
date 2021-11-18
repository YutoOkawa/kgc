# Project Setyp
```bash
npm install 
npm install --save /path_to_core/javascript
```

# Usage
```bash
node index.js
```

# Caution
## 鍵ファイルについて
各鍵生成局ごとにTPKを生成し、各IDに対してAPKを生成しています。

TPKはGitに上がっているため、そのまま利用してください。

APKとASKはRPアプリケーションからのアクセスで生成されます。

## coreライブラリについて
暗号ライブラリcoreはnpmで直接インストールすることができず、ライブラリをダウンロードして自分でnpm installする必要があります。

適当な場所にcoreをダウンロードしていただいて、
```bash
npm install --save /path_to_core/javascript
```
とすることでcoreを利用することができます。