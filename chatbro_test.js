const pug = require('pug');
const express = require('express');
const gettext = require('express-gettext');
const crypto = require('crypto');
const app = express();
const bodyParser = require('body-parser');

app.use(gettext(app, {
    directory: __dirname + '/public/locales',
    useAcceptedLanguageHeader: true
}));

app.use(express.static(__dirname + '/public'));

//Chat domain
const domain = 'localhost';
//The secret key from the site
const key = 'a06992ba-70b6-4fad-aaa9-588dc8b6890b';
//Your site user id
let userId = Math.floor((Math.random() * 100) + 1);
//User name
let userName;
//User avatar url
const urlAvatar = '/' + domain + ':3000/images/cat_avatar.jpeg';
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
  let permStr = permissions.toString();

  let hash = crypto.createHash('md5').update(domain + userId + userName +
    urlAvatar + urlProfile + permStr.replace(',', '') + key).digest('hex');

  if (permissions.length > 0) {
    permStr = '\'' + permStr + '\'';
    permStr = permStr.replace(',', '\', \'');
  }
  permStr = '[' + permStr + ']';

  res.render('logbox.pug', {
    domain,
    userId,
    userName,
    urlAvatar,
    urlProfile,
    permStr,
    hash
  });
});

app.get('/profile', function(req, res) {
  let permStr = 'No permissions';

  if (permissions.length > 0) {
    permStr = permissions.toString();
  }

  res.render('profile.pug', {
    userId,
    userName,
    permStr
  });
});

app.listen(3000, () => {
    console.log('Test app listening on port 3000!');
});
