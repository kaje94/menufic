<br>
<h1 align="center"> <b>Menufic</b> </h1> 
<h4 align="center">A digital menu generator for restaurants, built using <a href="https://create.t3.gg" target="_blank">T3 stack</a></h4>

<p align="center">
  <a href="https://gitter.im/Menufic/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge">
    <img src="https://badges.gitter.im/Menufic/community.svg">
  </a>
  <a href="https://saythanks.io/to/a.kajendran">
    <img src="https://img.shields.io/badge/Say%20Thanks-!-1EAEDB.svg">
  </a>
</p>

<p align="center">
  <img src="https://api.checklyhq.com/v1/badges/checks/b9184fcc-aba1-47be-ab53-6a6e44bfe47c?style=flat&theme=default">
</p>

<p align="center">
  <a href="https://github.com/kaje94/menufic/actions/workflows/checks.yml">
    <img src="https://github.com/kaje94/menufic/actions/workflows/checks.yml/badge.svg?branch=main">
  </a>
  <a href="https://github.com/kaje94/menufic/actions/workflows/tests.yml">
    <img src="https://github.com/kaje94/menufic/actions/workflows/tests.yml/badge.svg?branch=main">
  </a>
  <a href="https://sonarcloud.io/component_measures?metric=Maintainability&id=kaje94_menufic">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=kaje94_menufic&metric=sqale_rating">
  </a>
  <a href="https://sonarcloud.io/component_measures?metric=bugs&id=kaje94_menufic">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=kaje94_menufic&metric=bugs">
  </a>
  <a href="https://sonarcloud.io/component_measures?metric=vulnerabilities&id=kaje94_menufic">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=kaje94_menufic&metric=vulnerabilities">
  </a>
  <a href="https://sonarcloud.io/component_measures?metric=code_smells&id=kaje94_menufic">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=kaje94_menufic&metric=code_smells">
  </a>
  <a href="https://sonarcloud.io/component_measures?metric=Reliability&id=kaje94_menufic">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=kaje94_menufic&metric=reliability_rating">
  </a>
</p>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#prerequisite">Prerequisite</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>
<p align="center">
  <a href="https://menufic.com">
    <img alt="Menufic-Preview-Image" src="public/menufic_banner.jpg" width="1024">
  </a>
</p>
<br />

## Introduction

[Menufic](https://menufic.com) is a digital menu generator for restaurants that makes it simple and easy for anyone to create and share their restaurant menus. Menufic is built using [Next.js](https://nextjs.org), [NextAuth.js](https://next-auth.js.org), [Prisma](https://prisma.io), [tRPC](https://trpc.io), [Neon](https://neon.tech) & [Imagekit](https://imagekit.io). Following are some of the features that Menufic provides.

-   Simple & intuitive UI to create & manage restaurant menus
-   Generate menus that are optimized for search engines and social media crawlers
-   Support for both light and dark themes
-   Attach multiple banner images to menus
-   Share generated menu using URL or QR code
-   Responsive UI design that works well on all devices

## Prerequisite

General:
-   [Imagekit account](https://imagekit.io) for managing all the uploaded images.
-   [Google](https://next-auth.js.org/providers/google) / [GitHub](https://next-auth.js.org/providers/github) for authenticating users

Barebone Installation:
-   [Git](https://git-scm.com)
-   [Node.js 16+](https://nodejs.org/en/download/)
-   [NPM 7+](http://npmjs.com)
-   [PostgreSQL](https://www.postgresql.org/) for persisting data.

Docker Installation:
- Docker CE
- Docker Compose

## How To Use

### Docker

````
# copy env file and adjust to your needs
cp .env.example .env

# spawn the docker stack
docker compose up
````

The web application will be accessible on http://127.0.0.1:3000.

If you do not trust our externally hosted Docker Images, feel free to build the Docker Image locally yourself:

````
docker build -t menufic .
````

### Barebone

From your command line:

```bash
# Clone this repository
$ git clone https://github.com/kaje94/menufic

# Go into the repository
$ cd menufic

# Install dependencies
$ npm install
```

> You need to create a `.env` file at the root folder with the keys defined in `.env.example` before running any of the following commands.

Scripts related to the Next.js app:

```bash
# To migrate the Database (Make sure that you have a valid DATABASE_URL in your .env file). 
# This is needed if you are planning to run Menufic locally
$ npx prisma db push

# Start the app in development mode with hot-code reloading by running:
$ npm run dev

# Create an optimized production build of the application by running
$ npm run build

# After building the app start it in production mode by running:
$ npm start
```

Scripts related to linting and formatting:

```bash
# Check if there are any linting issues by running:
$ npm run lint

# Check & fix fixable linting issues by running:
$ npm run lint:fix

# Format other files types such as .json, .md & .css by running:
$ npm run format-rest
```

Scripts related to playwright tests:
> Before running playwright tests, make sure that you have added TEST_MENUFIC_USER_LOGIN_KEY and TEST_MENUFIC_BASE_URL to your .env file 

```bash
# Start dev server(If its not already running) & run all e2e tests
$ npm run test:e2e
```


## Contributing

Please refer the [Contributing.md](.github/CONTRIBUTING.md) in order to contribute towards this project

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> [a.kajendran@gmail.com](mailto:a.kajendran@gmail.com) &nbsp;&middot;&nbsp;
> GitHub [@kaje94](https://github.com/kaje94) &nbsp;&middot;&nbsp;
