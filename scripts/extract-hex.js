// The ANSI parser is from https://git.coolaj86.com/coolaj86/asn1-parser.js
const parser = require('./ansi-parser');
const base58 = require('./base58');
const path = require('path');
const fs = require('fs');

const parseKey = (fileName) => {
    const content = fs.readFileSync(path.join(__dirname, fileName), { encoding: 'ascii' });
    const pem = parser.PEM.parseBlock(content.toString());
    return parser.ASN1.parse(pem.der);
};

const extractEd25519PrivateKeyBase58 = (fileName) => {
    const json = parseKey(fileName);
    const item = json.children[2].children[0];

    return base58.encode(item.value);
}

const extractEd25519PublicKeyHex = (fileName) => {
    const json = parseKey(fileName);
    const item = json.children[1];

    return item.value.toString('hex');
}

const extractSecp256k1PrivateKeyHex = (fileName) => {
    const json = parseKey(fileName);
    const item = json.children[1];

    return item.value.toString('hex');
}

const extractSecp256k1PublicKeyHex = (fileName) => {
    const json = parseKey(fileName);
    const item = json.children[1];

    return item.value.toString('hex');
}

fs.writeFileSync(
    path.join(__dirname, 'ed25519-private.base58'),
    extractEd25519PrivateKeyBase58('ed25519-private.pem'),
    { encoding: 'ascii' },
);

fs.writeFileSync(
    path.join(__dirname, 'ed25519-public.hex'),
    extractEd25519PublicKeyHex('ed25519-public.pem'),
    { encoding: 'ascii' },
);

fs.writeFileSync(
    path.join(__dirname, 'secp256k1-private.hex'),
    extractSecp256k1PrivateKeyHex('secp256k1-private.pem'),
    { encoding: 'ascii' },
);

fs.writeFileSync(
    path.join(__dirname, 'secp256k1-public.hex'),
    extractSecp256k1PublicKeyHex('secp256k1-public.pem'),
    { encoding: 'ascii' },
);
