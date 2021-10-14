## Preparation
- Set up the environment by following the steps in this https://doc.fluence.dev/docs/tutorials_tutorials/recipes_setting_up

## Build
- go to a service directory and run the build script
```shell
$ cd services/{service}
$ ./build.sh
```

## Interact with services
- after building the service, we can interact it by running the mrepl command
```shell
$ cd services/{service}
$ mrepl Config.toml
```
- your screen should show something like this
```shell
Welcome to the Marine REPL (version 0.9.1)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 642582a5-2423-4633-bf42-39cadada4e5a
elapsed time 1.1987778s
1>
```
- try calling a github request
```shell
1> call github request [{"did": "some-did-1", "username": "some-user-1"}]
```
