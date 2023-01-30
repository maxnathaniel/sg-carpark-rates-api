# SG Carpark Rates API

## Description

This API provides a list of 400+ carpark rates categorized by the major regions (Orchard, Centra, North & North East, East, West, South & CBD, Attractions, Hotels) in Singapore.

The initial set of data is scraped from the Singapore Land Transport Authority (LTA) website. Subsequently, the plan for keeping this data updated is primarly through crowdsourcing.

## To develop on local machine

- Create a `.env` file from `.env.template` and fill in empty fields
- Run `yarn install` in root directory
- Ensure that Docker desktop is installed and running
- Run `docker compose up` to spin up the `PostgresSQL` database and `PgAdmin`
- Run `nodemon` in root directory to start NodeJS server

## Generate Salt

- GET `http://localhost:{PORT}/api-keys/salt`
- Fill up the `.env` file with this salt value

## Population of data

- POST `http://localhost:{PORT}/carpark-rates`

## Generate API Key

- POST `http://localhost:${PORT}/api-keys`
- Save API key in a secured location

## Get Carpark Rates

- GET `http://localhost:${PORT}/carpark-rates`
- Header to include `{ Authorization: apiKey {your-api-key} }` for authentication
