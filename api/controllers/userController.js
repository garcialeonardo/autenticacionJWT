'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  axios = require('axios'),
  User = mongoose.model('User');

exports.list_all_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.register = function(req, res) {
  var newUser = new User(req.body);
  var domain = req.body.email.split('@', 2)[1];
  axios.get(`https://dns-api.org/MX/${domain}`)
  .then(resp => {
    var responseDomain = resp.data;
    if (responseDomain.error != 'NXDOMAIN') {
      newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
      newUser.save(function(err, user) {
        if (err) {
          return res.status(400).send({
            message: err
          });
        } else {
          user.hash_password = undefined;
          return res.json(user);
        }
      });
    } else {
      res.status(400).json({
        ok: false,
        error: "Dominio inexistente"
      });
    }
  })
  .catch(e => {
    res.status(400).json({
      ok: false,
      error: e
    });
  });
};

exports.sign_in = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};
