## Overview


## Docker
```
docker pull samuraitruong/mockserver

docker run -name mockserver -p 8080:80 -v ~/mockserver/configs:/data/configs samuraitruong/mockserver

```
### Persit response to using volume

```

docker run -name mockserver -p 8080:80 -v ~/mockserver/configs:/data/configs -v ~/mockserver/responses:/data/responses samuraitruong/mockserver

```


Also, you can mount /data that will have config and response together.


### Volumes
- /data/configs: Place to read all the routes config
- /data/respones: Folder to store response data



## Route Configurations

The forward routes configuration are in json format that can be located in any json file put under config folder. 
Config folder can be set using environment name CONFIG_PATH , default to ./configs folder in the same level with application

### Absolute Routes 
```
[
  {
        "reqUrl": "demo/posts",
        "method": ["get", "post"],
        "proxyUrl": "https://my-json-server.typicode.com/typicode/demo/posts"
  }
]
```

### Forward request path

```
[
  {
    "reqUrl": "typicode/",
    "method": ["get", "post"],
    "proxyUrl": "https://my-json-server.typicode.com",
    "forwardPath": true
  }
]

````
