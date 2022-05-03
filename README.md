# QR Mirror

## Overview

This is a web server that can be used to encode a short message in a URL, and serves a page at that URL with the message and a QR code to that page. Because the URL contains the full message there is no need to store relations between messages and URLs server-side, and any URL that can be uncompressed to a message is automatically served.

There is a live instance of this server at [qr.samflam.com](https://qr.samflam.com).

## Running

This project requires node and yarn. First, do

```
yarn install
```

to install dependencies.

Then do

```
yarn start
```

to run the server. You can also do

```
yarn dev
```

to run with nodemon, which automatically restarts the server if the source code changes.

By default the server generates QR codes for and runs on `http://localhost:8000`. You can change this with environment variables:

| Variable | Description |
|:-|:-|
|`QRMIRROR_PORT`| The port the server should listen on. Defaults to 8000. |
|`QRMIRROR_PREFIX` | The first part of the public URL including protocol and domain. Change this to match the URLs you want the QR codes to point to. Defaults to `http://localhost:${QRMIRROR_PORT}`.|
