## Preparation
- Set up the environment by following the steps in this https://doc.fluence.dev/docs/tutorials_tutorials/recipes_setting_up

## Generate Key Pair
```
openssl genpkey -algorithm ED25519 -out ed25519-private.pem
openssl pkey -in ed25519-private.pem -pubout -out ed25519-public.pem
```
- Copy the public key and paste it to identity-link-router/src/main.rs to the variable TODO

## Run identity-link-service
- Create identity-link-service/.env file (use .env.example as a reference) 
- Copy the private key generated in the previous step and paste it to identity-link-service/.env to the variable PRIVATE_KEY
- Fill other variables in identity-link-service/.env

For the first time, run commands below
```
$ cd identity-link-service
$ npm ci
$ npm run build:dev
```
After the first build
```
$ npm run start
```
