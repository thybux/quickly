echo "nettoyage des gestionnaire de paquet"

cd ./js/ && npm run clean && cd ../
cargo clean

echo "build de rust ..."
wasm-pack build --target nodejs --out-dir pkg

echo "copie des fichier wasm de build"
cp -r ./pkg ./js/pkg

echo "build ts ..."
cd ./js/ && npm run build:ts



