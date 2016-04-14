# Stock Price

Server based on nodejs, koa(web framework)

## Live Example on *localhost:9950*

## Running
### server
```bash
# edit server/config/config.js
node app.js
```

## Testing

### Stock price

#### Get
```bash
curl -i http://localhost:9950/v1/stockprice -X POST --data-urlencode 'Body=Symbol goog'
```

## Code layout

### config
./server/config/config.js

### middleware config
./server/config/koa.js  <general middlewares>

### controllers
refer ./server/controllers

## Credits
Server side simply utilizes generally accepted Koa middleware and Node.js best practices.

## The Name
The project name is Stock Price

## License
Copyright, Amit Handa
