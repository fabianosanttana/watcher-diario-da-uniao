# Nest service to watch brazilian Diario da União
Service starter using NestJS, Puppeteer, MongoDB, React with Vite.


## Dependencies & Services
- MongoDB - https://www.mongodb.com/
- Chromium - https://www.geeksforgeeks.org/how-to-install-chromium-web-browser-on-linux/
- Docker - https://docker.com/

## Run in local

1. first start all deps from `docker-compose.development.yml`
```
docker-compose -f docker-compose.development.yml up -d
```

2. install chromium

```
sudo apt install -y chromium-browser
```

3. then you can access service endpoint directly using localhost.
```
http://localhost:3000/api
```
