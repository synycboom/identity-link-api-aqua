## Flows
https://swimlanes.io/u/MySoPpvG0
https://swimlanes.io/u/PtF3s142_

## Preparation
- Set up the environment by following the steps in this https://doc.fluence.dev/docs/tutorials_tutorials/recipes_setting_up
- Make sure that you have openssl, Rust, and NodeJS (version >= 14) installed

## Generate key pairs
- This will generate private/public keys in various formats and they are copied to identity-link-service and identity-link-router
```
$ scripts
$ ./gen-keyparis.sh
```

## Build identity-link-router
- go to the service directory and run the build script
```shell
$ cd services/identity-link-router
$ ./build.sh
```

## Deploy identity-link-router
- go to the service directory and run the build script
```shell
$ cd services/identity-link-router
$ ./deploy.sh
```

## Run identity-link-service
- the identity-link-router needs to be deployed first to make the identity-link-service fully functions
- create identity-link-service/.env file (use .env.example as a reference) 
- fill other variables in identity-link-service/.env

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
