## Overview
Inspired by some thing we need at project work. I created a simple docker that can act as proxy and cache data using body payload & URL & header information. 

When the upstream server is down, the mock server will response the cache data that match with request information.



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

```


## Run development

```
npm run dev 

```

- The app will run on default port 4040 if PORT not set in environment variables.
- Default configure folder will be ./configs including to some sample rest api 
- Default data folder will be set to ./.cache

You can also run development using docker by below command

```
npm run dev:docker

```
### Test local development

```bash

 curl http://localhost:4040/demo/comments

```
this will response ⬇️
```json
  [{"id":1,"body":"some comment","postId":1},{"id":2,"body":"some comment","postId":1}
```

OR 

```bash
 curl http://localhost:4040/api/users

```
Response  ⬇️
```json
  {"page":1,"per_page":6,"total":12,"total_pages":2,"data":[{"id":1,"email":"george.bluth@reqres.in","first_name":"George","last_name":"Bluth","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"},{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},{"id":3,"email":"emma.wong@reqres.in","first_name":"Emma","last_name":"Wong","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"},{"id":4,"email":"eve.holt@reqres.in","first_name":"Eve","last_name":"Holt","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"},{"id":5,"email":"charles.morris@reqres.in","first_name":"Charles","last_name":"Morris","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"},{"id":6,"email":"tracey.ramos@reqres.in","first_name":"Tracey","last_name":"Ramos","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"}],"ad":{"company":"StatusCode Weekly","url":"http://statuscode.org/","text":"A weekly newsletter focusing on software development, infrastructure, the server, performance, and the stack end of things."}}
```

OR 

```

 curl http://localhost:4040/restapiexample/api/v1/employees

```

## Build
### Build source

```
npm run build
```
this will output to ./dist folder that require to run in production with npm run start later

### Build docker

```
npm run build:docker

```
This will build the docker image name mockserver

