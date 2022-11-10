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

## Possible Security Vulnerabilities
1. Security Misconfiguration
  - The database username and password is stored in the code without any encryption. Attackers can easily find out how to gain access to these information and read the data in the database
  - The fix to this is to create environment variables that would not be stored in repositories and attackers will then not be able to access these information at all hence lower the chances of them gaining full access to the databases.

2. "SQL" Injection
  - Currently, there isn't any data validation done when a user edits or inserts data. It allows an attacker to alter backend SQL statements by manipulating the user supplied data, e.g in a POST request. User input is then sent to an interpreter as part of command or query and trick the interpreter into executing unintended commands and gives access to unauthorized data.
  - To prevent this, we can whitelist input fields by validating the data from the user input such as data type, data length, expected data content etc. Other preventive measures can also be giving vague error messages such that the attacker will not be able to easily figure out what he needs to change in order to gain access of the user's data or account.

