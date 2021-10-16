#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

# This script builds all subprojects and puts all created Wasm modules in one dir
cargo update --aggressive
marine build --release

mkdir -p artifacts
rm -f artifacts/*.wasm
cp target/wasm32-wasi/release/identity-link-router.wasm artifacts/
wget https://github.com/fluencelabs/sqlite/releases/download/v0.15.0_w/sqlite3.wasm
mv sqlite3.wasm artifacts/

# generate aqua file to the identity-link-service and client
identityLinkServicePath="../identity-link-service/aqua"
clientPath="../../client/aqua"
aquaFile="identity-link-router.aqua"

mkdir -p $identityLinkServicePath
mkdir -p $clientPath

rm -f "${identityLinkServicePath}/${aquaFile}"
rm -f "${clientPath}/${aquaFile}"

marine aqua artifacts/identity-link-router.wasm > "${identityLinkServicePath}/${aquaFile}"
marine aqua artifacts/identity-link-router.wasm > "${clientPath}/${aquaFile}"
