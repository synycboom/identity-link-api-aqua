## Preparation
- Set up the environment by following the steps in this https://doc.fluence.dev/docs/tutorials_tutorials/recipes_setting_up

## Build
- go to a service directory and run the build script
```shell
$ cd services/identity-link-router
$ ./build.sh
```

## Interact with services
- after building the service, we can interact it by running the mrepl command
```shell
$ cd services/identity-link-router
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
- try calling a function
```shell
1> call identity-link-router update_service [{"payload": "{\"service_id\":\"github-identity-link-service\",\"peer_id\":\"12D3KooWQPoCq92fUHuRvwGixttc9PscHMKD7yEpmtqxEVk6PY9v\",\"relay_peer_id\":\"12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e\"}", "signature": "cda63bd12c1716939605d550608f98e82c0ef3728c5b56502ac8d5b1e26d532eedd3bca3d34b15a550353c30b5f86e9b15380598130322184462ef085ec4fe04"}]
```
