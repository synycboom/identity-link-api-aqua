## Flows
https://swimlanes.io/u/MySoPpvG0
https://swimlanes.io/u/PtF3s142_

## Preparation
- Set up the environment by following the steps in this https://doc.fluence.dev/docs/tutorials_tutorials/recipes_setting_up

## Generate secp256k1 Keypair used for JWT signing
```
$ openssl ecparam -name secp256k1 -genkey -noout | openssl ec -text -noout
```

which should produce a keypair like the format below

```
read EC key
Private-Key: (256 bit)
priv:
    1c:cc:e1:7e:aa:32:b2:2c:9a:4b:15:6f:b9:49:84:
    3d:0e:c6:9f:ee:41:83:84:e8:ce:00:7a:79:ea:94:
    09:9a
pub:
    04:80:50:b9:51:40:50:af:d5:0b:7b:1a:c3:2e:6a:
    f7:72:0b:f9:36:3e:4e:de:74:22:5d:b2:6a:40:35:
    81:43:e9:9b:9f:1b:94:b1:91:b6:60:9d:1d:bb:eb:
    eb:ad:65:70:80:fb:35:2f:f9:4e:e4:eb:fd:f1:fa:
    62:54:40:a4:ec
ASN1 OID: secp256k1
```

we will use the HEX format of the private/public keys. In this example, the private key is

```
1ccce17eaa32b22c9a4b156fb949843d0ec69fee418384e8ce007a79ea94099a
```

The public key is 

```
048050b9514050afd50b7b1ac32e6af7720bf9363e4ede74225db26a40358143e99b9f1b94b191b6609d1dbbebebad657080fb352ff94ee4ebfdf1fa625440a4ec
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
