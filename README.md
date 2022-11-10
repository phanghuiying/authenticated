This is a simple authentication app build with Nextjs, Typescript, MUI, Express, and Mysql.

## Setting up

1. Clone all the files from this repo 

2. Create Dockerfiles and build the Docker images

- change directory into authenticated (front end)
```
cd authenticated
```
- create a Dockerfile with the following content
```
 # syntax=docker/dockerfile:1
  FROM node:19-alpine
  WORKDIR /app
  COPY . .
  RUN npm install
  CMD ["npm", "run", "dev"]
  EXPOSE 3000
```
- build the front end docker image with this script
```
docker build -t authenticated .
```
- change directory into authenticated-server (back end)
```
cd ..
cd authenticated
```
- create a Dockerfile with the following content
```
 # syntax=docker/dockerfile:1
  FROM node:19-alpine
  WORKDIR /app
  COPY . .
  RUN npm install
  CMD ["npm", "run", "start"]
  EXPOSE 3001
```
- build the front end docker image with this script
```
docker build -t authenticated-server .
```
- run the docker images in a container
```
docker run -dp authenticated
docker run -dp authenticated-server
```

3. Install nginx
  
nginx is a all in one tool that handles web requests. When a user makes a requests to the server, nginx will redirect it to the appropriate place to be processed
````
sudo apt-get update
sudo apt-get install nginx
````

4. Change nginx configuration to the following
````
vi /etc/nginx/sites-available/default
````
    
````
server {
    listen 80;
    server_name student-7.sutdacademytools.net;
    location / {
        proxy_pass http://student-7.sutdacademytools.net:3000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
````
close with esc + :wq

5. Restart and run nginx
````
sudo systemctl restart nginx
sudo service nginx start
````

