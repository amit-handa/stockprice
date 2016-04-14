# Instructions

* untar the tarball
* cd <untarred-directory>
* install deps
```
npm install
```

* configure the mongodb url in ./server/config/config.js
```
#start server
node app
```

+ load homepage
  curl -i "http://localhost:9950"
+ test server
	curl -i http://localhost:9950/v1/stockprice -X POST --data-urlencode 'Body=Symbol goog'

For any issue, please email me at : amit.handa@gmail.com
