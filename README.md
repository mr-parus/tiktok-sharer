[![Heroku App Status](http://heroku-shields.herokuapp.com/tiktok-sharer)](https://tiktok-sharer.herokuapp.com)


<br />
<div align="center">
<h3 align="center">Tiktok Sharer</h3>
<p align="center">
  Web app for sharing highlights to TikTok (test task)
  <br />
  <a href="https://tiktok-sharer.herokuapp.com/">View Demo</a>
</p>
</div>


## About The Project
### Built With
* ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) + ![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)
* ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) + ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
* ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
* ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
* ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
* ![TikTok](https://img.shields.io/badge/TikTok-%23000000.svg?style=for-the-badge&logo=TikTok&logoColor=white)


## Getting started
#### Start in Docker
1) Create config file
```yaml
  # .env 
  MONGO_CONNECTION_URI=mongodb+srv://...
  PORT=3000
  # SERVER_BASE_URL should match with TikTok OAuth uri
  SERVER_BASE_URL=...
  SERVER_JWT_SECRET=...
  SERVER_SESSION_SECRET=...
  TIKTOK_CLIENT_KEY=...
  TIKTOK_CLIENT_SECRET=...
  # Used for creating a tunnel via https://dash.cloudflare.com/
  TUNNEL_TOKEN=...
```
2) Run the container
```shell
docker-compose up 
```

### Start locally (dev)
```shell
# create config file in the /back-end/.env
# /back-end
npm install
npm run start:dev

# /front-end
npm install
npm run start
```

## Documentation
### REST API
```
- Serve static
    - GET /*

- Get highlight's video source
    - GET  /api/v1/highlights/:highlightId

- Get JWT token
    - GET /api/v1/auth/jwt

- Share highlight to TikTok
    - POST /api/v1/highlights/:highlightId/share-to-tiktok
    - requires Authorization header

- Start auth with TikTok
    - GET /api/v1/auth/tiktok
 
- Handle TikTok OAuth callback
    - GET /api/v1/auth/tiktok
```

### Modules architecture
![Architecture diagram](https://drive.google.com/uc?id=1AptOEx5wJ9Vyfuw9EK3B5t1dvvMMPeXI)

## Tests
### Back-end
- [auth.controller.spec.ts](./back-end/apps/tiktok-sharer/src/auth/controllers/auth.controller.spec.ts)
- [auth.guard.spec.ts](./back-end/apps/tiktok-sharer/src/auth/guards/auth.guard.spec.ts)
- [highlights.controller.spec.ts](./back-end/apps/tiktok-sharer/src/highlights/controllers/highlights.controller.spec.ts)

### Front-end
- [auth.service.test.ts](./front-end/src/services/auth.service.test.ts)
- [Button.test.tsx](./front-end/src/components/Button/Button.test.tsx)
- [AuthPage.test.tsx](./front-end/src/pages/AuthPage/AuthPage.test.tsx)
- [HomePage.test.tsx](./front-end/src/pages/HomePage/HomePage.test.tsx)

## Tests
### Back-end
- [auth.controller.spec.ts](./back-end/apps/tiktok-sharer/src/auth/controllers/auth.controller.spec.ts)
- [auth.guard.spec.ts](./back-end/apps/tiktok-sharer/src/auth/guards/auth.guard.spec.ts)
- [highlights.controller.spec.ts](./back-end/apps/tiktok-sharer/src/highlights/controllers/highlights.controller.spec.ts)

### Frontend
- [auth.service.test.ts](./front-end/src/services/auth.service.test.ts)
- [Button.test.tsx](./front-end/src/components/Button/Button.test.tsx)
- [AuthPage.test.tsx](./front-end/src/pages/AuthPage/AuthPage.test.tsx)
- [HomePage.test.tsx](./front-end/src/pages/HomePage/HomePage.test.tsx)
