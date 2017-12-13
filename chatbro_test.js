const pug = require('pug');
const express = require('express');
const gettext = require('express-gettext');
const crypto = require('crypto');
const app = express();
const bodyParser = require('body-parser');

// Gettext configuration
app.use(gettext(app, {
    directory: __dirname + '/locales',
    useAcceptedLanguageHeader: true
}));

app.use(express.static(__dirname + '/public'));

//Chat domain
const domain = 'localhost';
//The secret key from the site
const key = '12b028c2-95e6-4297-8afd-0eb612c3d8fd';
//Your site user id
let userId = Math.floor((Math.random() * 100) + 1);
//User name
let userName;
//User avatar url
const urlAvatar = '//localhost:91/images/cat_avatar.jpeg';
//User profile url
const urlProfile = '/profile';
//An array of allowed moderation methods
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
  let permissionsStr = permissions.toString();

  let hash = crypto.createHash('md5').update(domain + userId + userName +
    urlAvatar + urlProfile + permissionsStr.replace(',', '') + key).digest('hex');

  permissionsStr = '[' + permissionsStr + ']';

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
  let permissionsStr = 'No permissions';

  if (permissions.length > 0) {
    permissionsStr = permissions.toString();
  }

  res.render('profile.pug', {
    userId,
    userName,
    permissionsStr
  });
});

app.listen(3000, () => {
    console.log('Test app listening on port 3000!');
});
