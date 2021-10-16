#!/usr/bin/env node
const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync(
  'ec', 
  {
    namedCurve: 'secp256k1',
    privateKeyEncoding: { format: 'pem', type: 'sec1' }, 
    publicKeyEncoding: { format: 'pem', type: 'spki' }
  },
)

const cleanedPrivateKey = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .trim();

const cleanedPublicKey = publicKey
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .trim();

console.log(`Private Key: ${cleanedPrivateKey}`);
console.log(`Public Key: ${cleanedPublicKey}`);

const base64PrivateKey = Buffer.from(cleanedPrivateKey).toString('base64');
const base64PublicKey = Buffer.from(cleanedPublicKey).toString('base64');

console.log(`Base64 Private Key: ${base64PrivateKey}`);
console.log(`Base64 Public Key: ${base64PublicKey}`);
