# Server

## Start server

Once the server is started, you can access it on `http://127.0.0.1:3000`, the port can be configured setting the `PORT` env variable

### Without Docker

Clone this repo, then install sources with `yarn`, build the app using `yarn build` and run with `yarn start`

### With Docker

Clone this repo, then run `docker compose up --build`

## Try requests

You can open the `bruno` folder using [Bruno](https://www.usebruno.com/). If you don't want to install Bruno, you may just check `.bru` files to see some request examples

## Develop

If you need to modify the server, create a copy or a fork, then install sources using `yarn` and run the development server using `yarn dev`, now everytime you it Ctrl+S, your server will restart automatically!

If needed, you can check files in `data` folder (db and uploads), you may remove the `db.sqlite` file and restart your server if you want to erase all data!
