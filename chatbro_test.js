const pug = require('pug');
const express = require('express')
const crypto = require('crypto');
const app = express();
const bodyParser = require('body-parser');

//Домен, на котором установлен чат
const domain = 'localhost';
//Секретный ключ, полученный на сайте
const key = '12b028c2-95e6-4297-8afd-0eb612c3d8fd';
//Id пользователя на сайте установившем чат
let userId = Math.floor((Math.random() * 100) + 1);
//Имя пользователя на сайте установившем чат
let userName;
//Url аватара пользователя на сайте установившем чат
const urlAvatar = 'http://localhost:91/images/cat_avatar.jpeg';
//Ссылка на профиль пользователя на сайте установившем чат
const urlProfile = 'http://localhost:91/profile';
//Массив допустимых методов модерации
let permissions = [];

app.set('view engine','pug');

app.get('/', function(req, res) {
  let hash = crypto.createHash('md5').update(domain + key).digest('hex');

  res.render('main.pug', {
    domain,
    hash
  });
});

app.use('/LogIn', bodyParser.urlencoded({
    extended: true
}));

app.post('/LogIn', function(req, res, next) {
      userName = req.body.full_name;
      permissions = [];
      if (req.body.ban_check == 'on')
        permissions.push('ban');
      if (req.body.del_check == 'on')
        permissions.push('delete');

      res.redirect('/logbox');
});

app.get('/logbox', function(req, res) {
  let hash = crypto.createHash('md5').update(domain + userId + userName +
    urlAvatar + urlProfile + permissions + key).digest('hex');

  let permissionsStr = '[';
  for (let i = 0; i < permissions.length; i++) {
    permissionsStr += '\'' + permissions[i] + '\', ';
  }
  permissionsStr += ']';

  res.render('logbox.pug', {
    domain,
    userId,
    userName,
    urlAvatar,
    urlProfile,
    permissionsStr,
    hash
  });
});

app.get('/profile', function(req, res) {
  let permissionsStr = 'Нет разрешений';

  if (permissions.length > 0) {
    permissionsStr = '';

    if (permissions.indexOf('ban') != -1) {
      permissionsStr += 'Банить пользователей, ';
    }
    if (permissions.indexOf('delete') != -1) {
      permissionsStr += 'Удалять пользователей, ';
    }

    permissionsStr = permissionsStr.substring(0, permissionsStr.length - 2);
  }

  res.render('profile.pug', {
    userId,
    userName,
    permissionsStr
  });
});

app.listen(3000);
