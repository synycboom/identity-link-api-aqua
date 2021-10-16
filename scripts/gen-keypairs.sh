#!/usr/bin/env bash

# PEM format
openssl ecparam -name secp256k1 -genkey -noout -out secp256k1-private.pem
openssl ec -in secp256k1-private.pem -pubout -out secp256k1-public.pem

# PEM format
openssl genpkey -algorithm Ed25519 -out ed25519-private.pem
openssl pkey -in ed25519-private.pem -pubout -out ed25519-public.pem

# Extract hex
node extract-hex.js

# Create directories
mkdir -p ../services/identity-link-service/keys
mkdir -p ../services/identity-link-router/keys

# Remove unsed secp256k1 pem
rm secp256k1-private.pem
rm secp256k1-public.pem

# Remove unused ed25519 pem
rm ed25519-public.pem

# secp256k1 hex to identity-link-service
mv secp256k1-private.hex ../services/identity-link-service/keys
mv secp256k1-public.hex ../services/identity-link-service/keys

# ed25519 pem to identity-link-service
mv ed25519-private.pem ../services/identity-link-service/keys

# ed25519 hex to identity-link-router
mv ed25519-public.hex ../services/identity-link-router/keys
mv ed25519-private.base58 ../services/identity-link-router/keys
