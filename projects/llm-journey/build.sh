#!/bin/sh
# Compile src/*.jsx → dist/*.js (JSX → React.createElement; nothing else changes).
# Run after editing src/, then COMMIT dist/ — the live server has no build pipeline.
# @babel/standalone (bundles the react preset) is cached in .build-cache/ (gitignored).
set -e
cd "$(dirname "$0")"
CACHE=.build-cache
[ -d "$CACHE/node_modules/@babel/standalone" ] || npm install --prefix "$CACHE" --no-save --silent @babel/standalone
NODE_PATH="$CACHE/node_modules" node -e '
const Babel=require("@babel/standalone"),fs=require("fs"),path=require("path");
fs.mkdirSync("dist",{recursive:true});
for(const f of fs.readdirSync("src").filter(f=>f.endsWith(".jsx"))){
  const code=fs.readFileSync(path.join("src",f),"utf8");
  const out=Babel.transform(code,{presets:["react"],sourceType:"script"}).code;
  fs.writeFileSync(path.join("dist",f.replace(/\.jsx$/,".js")),out);
  console.log("  src/"+f+" → dist/"+f.replace(/\.jsx$/,".js"));
}'
echo "✓ compiled src/ → dist/"
