var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , config;

passport.use(new LocalStrategy(function(username, password, done) {
    //User.findOne({ username: username, password: password }, function (err, user) {
    //  done(err, user);
    //});
    if (username == 'foo' && password == 'bar') {
      done(null, {foo: 'bar'});
    }
    else {
      done({msg: 'shit'}, null);
    }
}));

config = {
  callbackURL: geddy.config.fullHostname + '/auth/twitter/callback'
, skipExtendedUserProfile: true
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

  this.local = function (req, resp, params) {
    var self = this
      , handler = function (badCredsError, user, noCredsError) {
          console.log(arguments);
          if (badCredsError || noCredsError) {
            self.redirect('/bad_login');
          }
          else {
            self.respond('ok', {format: 'txt'});
          }
        };
    passport.authenticate('local', function () {
      handler.apply(null, arguments);
    })(req, resp, handler);
  };

  this.twitter = function (req, resp, params) {
    var self = this;
    req.session = this.session.data;
    // FIXME: hack until Passport defers to resp.redirect
    resp.end = function () {};
    resp.setHeader = function (headerName, val) {
      resp.redirect(val);
    };
    passport.authenticate('twitter')(req, resp);
  };

  this.twitterCallback = function (req, resp, params) {
    var self = this;
    req.session = this.session.data;
    // FIXME: hack until Passport defers to resp.redirect
    resp.end = function () {};
    resp.setHeader = function (headerName, val) {
      resp.redirect(val);
    };
    passport.authenticate('twitter', function (err, profile) {
      console.log(arguments);
      self.respond('ok', {format: 'txt'});
    })(req, resp);
  };

  this.facebook = function (req, resp, params) {
    var self = this;
    req.session = this.session.data;
    // FIXME: hack until Passport defers to resp.redirect
    resp.end = function () {};
    resp.setHeader = function (headerName, val) {
      console.log(val);
      resp.redirect(val);
    };
    passport.authenticate('facebook')(req, resp);
  };

  this.facebookCallback = function (req, resp, params) {
    var self = this;
    req.session = this.session.data;
    // FIXME: hack until Passport defers to resp.redirect
    resp.end = function () {};
    resp.setHeader = function (headerName, val) {
      resp.redirect(val);
    };
    passport.authenticate('facebook', function (err, profile) {
      console.log(arguments);
      self.respond('ok', {format: 'txt'});
    })(req, resp);
  };

})();

module.exports = {actions: actions};
