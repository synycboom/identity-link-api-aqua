## Flows
https://swimlanes.io/u/MySoPpvG0
https://swimlanes.io/u/PtF3s142_

## Preparation
- Set up the environment by following the steps in this https://doc.fluence.dev/docs/tutorials_tutorials/recipes_setting_up
- Make sure that you have openssl, Rust, and NodeJS (version >= 14) installed
- Redis is needed in case you don't use docker-compose.yaml for identity-link-service

## Generate key pairs (**only need to run once**)
- This will generate private/public keys in various formats and they are copied to identity-link-service and identity-link-router
```
$ scripts
$ ./gen-keypairs.sh
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
1. the identity-link-router needs to be deployed first to make the identity-link-service fully functions
2. create services/identity-link-service/.env file (use .env.example as a reference) 
3. fill other variables in identity-link-service/.env

In case you don't have Redis, you can run Redis service in docker-compose.yaml
```
$ cd services/identity-link-service
$ docker-compose up -d redis
```

After Redis is running
```
$ cd services/identity-link-service
$ npm ci
$ npm run start
```
if the `npm run start` fails, try running it again.

In case you only want to run it without development, you can simply run `docker-compose up`. Both Redis and Identity-link-service will be run.

## Run application client
1. create client/.env file (use .env.example as a reference)
```
$ cd client
$ npm ci
$ npm run start
```
