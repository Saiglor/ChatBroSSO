# ChatBroSSO

### Development

Clone the repository
```shell
$ git clone https://github.com/SviatoIa/ChatBroSSO.git && cd ChatBroSSO
```

Install dependencies
```shell
$ npm install
```

Run
```shell
$ node chatbro_test.js
```

Test app listening on port 3000!

### Nginx

Add to nginx.conf:
```
http {
  ...
  server {
    listen 91;

    location / {
      proxy_pass http://localhost:3000;
      proxy_set_header Host $host;
    }

    location /styles/ {
      root .../ChatBroSSO; #path to the repository
    }
    location /images/ {
      root .../ChatBroSSO; #path to the repository
    }
  }
  ...
}
```
