var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , user = require('./user')
  , config
  , successRedirect = geddy.config.passport.successRedirect
  , failureRedirect = geddy.config.passport.failureRedirect
  , cryptPass = require('./index').cryptPass;

passport.use(new LocalStrategy(function(username, password, done) {
    geddy.model.User.first({username: username}, function (err, user) {
      var crypted;
      if (err) {
        done(err, null);
      }
      if (user) {
        crypted = cryptPass(password);
        if (user.password == crypted) {
          done(null, user);
        }
        else {
          done({message: 'Not found'}, null);
        }
      }
    });
}));

config = {
  callbackURL: geddy.config.fullHostname + '/auth/twitter/callback'
};
config = geddy.mixin(config, geddy.config.passport.twitter);
passport.use(new TwitterStrategy(config,
    function(token, tokenSecret, profile, done) {
  done(null, profile);
}));

config = {
  callbackURL: geddy.config.fullHostname + '/auth/facebook/callback'
};
config = geddy.mixin(config, geddy.config.passport.facebook);
passport.use(new FacebookStrategy(config,
    function(accessToken, refreshToken, profile, done) {
   done(null, profile);
}));

var actions = new (function () {

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
      , handler = function (badCredsError, user, noCredsError) {
          if (badCredsError || noCredsError) {
            self.redirect(failureRedirect);
          }
          else {
            self.session.set('userId', user.id);
            self.session.set('authType', 'local');
            self.redirect(successRedirect);
          }
        };
    // FIXME: Passport wants a request body or query
    req.body = {
      username: params.username
    , password: params.password
    };
    passport.authenticate('local', function () {
      handler.apply(null, arguments);
    })(req, resp, handler);
  };

  this.twitter = _createInit('twitter');

  this.twitterCallback = _createCallback('twitter');

  this.facebook = _createInit('facebook');

  this.facebookCallback = _createCallback('facebook');

})();

module.exports = actions;
