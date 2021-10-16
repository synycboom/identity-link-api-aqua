#!/bin/sh

seed=$(cat ./keys/ed25519-private.base58)

fldist deploy_app --log info --env krasnodar -s $seed --node-id 12D3KooWD7CvsYcpF9HE9CCV9aY3SJ317tkXVykjtZnht2EbzDPm -i config.json -o identity-link-router.json

cp identity-link-router.json ../identity-link-service/src/identity-link-router.json
mv identity-link-router.json ../../client/src
