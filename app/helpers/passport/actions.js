var passport = require('passport')
  , user = require('./user')
  , config = geddy.config.passport
  , successRedirect = config.successRedirect
  , failureRedirect = config.failureredirect
  , bcrypt = require('bcrypt')
  , cryptPass;

var SUPPORTED_SERVICES = [
      'twitter'
    , 'facebook'
    , 'yammer'
    ];

SUPPORTED_SERVICES.forEach(function (item) {
  var config = {
        callbackURL: geddy.config.fullHostname + '/auth/' +
            item + '/callback'
      }
    , Strategy = require('passport-' + item).Strategy;

  geddy.mixin(config, geddy.config.passport[item]);
  passport.use(new Strategy(config,
      function(token, tokenSecret, profile, done) {
    done(null, profile);
  }));
});

var actions = new (function () {
  var self = this;

  var _createInit = function (authType) {
        return function (req, resp, params) {
          var self = this;
          req.session = this.session.data;
          // FIXME: hack until Passport defers to resp.redirect
          resp.end = function () {};
          resp.setHeader = function (headerName, val) {
            resp.redirect(val);
          };
          passport.authenticate(authType)(req, resp);
        };
      }

    , _createCallback = function (authType) {
        return function (req, resp, params) {
          var self = this;
          req.session = this.session.data;
          // FIXME: hack until Passport defers to resp.redirect
          resp.end = function () {};
          resp.setHeader = function (headerName, val) {
            resp.redirect(val);
          };
          passport.authenticate(authType, function (err, profile) {
            if (!profile) {
              self.redirect(failureRedirect);
            }
            else {
              try {
                user.lookupByPassport(authType, profile, function (err, user) {
                  if (err) {
                    self.error(err);
                  }
                  else {
                    self.session.set('userId', user.id);
                    self.session.set('authType', authType);
                    self.redirect(successRedirect);
                  }
                });
              }
              catch (e) {
                self.error(e);
              }
            }
          })(req, resp, function (e) {
            if (e) {
              self.error(e);
            }
          });
        };
      };

  this.local = function (req, resp, params) {
    var self = this
      , username = params.username
      , password = params.password;

    geddy.model.User.first({username: username}, {nocase: ['username']},
        function (err, user) {
      var crypted;
      if (err) {
        self.redirect(failureRedirect);
      }
      if (user) {
        if (!cryptPass) {
          cryptPass = require('./index').cryptPass;
        }

        if (bcrypt.compareSync(password, user.password)) {
          self.session.set('userId', user.id);
          self.session.set('authType', 'local');
          self.redirect(successRedirect);
        }
        else {
          self.redirect(failureRedirect);
        }
      }
      else {
        self.redirect(failureRedirect);
      }
    });
  };

  SUPPORTED_SERVICES.forEach(function (item) {
    self[item] = _createInit(item);
    self[item + 'Callback'] = _createCallback(item);
  });

})();

module.exports = actions;
