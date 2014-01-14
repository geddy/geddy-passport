var passport = require('../helpers/passport')
  , generateHash = passport.generateHash
  , requireAuth = passport.requireAuth;


var Users = function () {

  // Set this to false if you don't need e-mail activation
  // for local users
  var EMAIL_ACTIVATION = true
    , msg;

  if (EMAIL_ACTIVATION) {
    if (!geddy.mailer) {
      msg = 'E-mail activation requires a mailer. ' +
          'Please configure a mailer for your app.';
      throw new Error(msg);
    }
    if (!geddy.config.fullHostname) {
      msg = 'E-mail activation requires a hostname for the ' +
          'activation URL. Please set "hostname" in your app config.';
      throw new Error(msg);
    }
  }

  this.before(requireAuth, {
    except: ['add', 'create', 'activate']
  });

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.User.all(function(err, users) {
      self.respond({params: params, users: users});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , user = geddy.model.User.create(params)
      , sha;

    // Non-blocking uniqueness checks are hard
    geddy.model.User.first({username: user.username}, function(err, data) {
      var conflictErr
        , activationUrl;
      if (err) {
        throw err;
      }
      if (data) {
        conflictErr = {
          username: 'This username is already in use.'
        };
        self.respondWith(user, {status: conflictErr});
      }
      else {
        if (user.isValid()) {
          user.password = generateHash(user.password);

          if (EMAIL_ACTIVATION) {
            user.activationToken = generateHash(user.email);
          }
          else {
            user.activatedAt = new Date();
          }
          user.save(function(err, data) {
            var options = {};
            if (err) {
              throw err;
            }

            if (EMAIL_ACTIVATION) {

            activationUrl = geddy.config.fullHostname + '/users/activate?token=' +
                encodeURIComponent(user.activationToken);
            options.status = 'You have successfully signed up. ' +
                'Check your e-mail to activate your account.';

              geddy.mailer.sendMail({
                from: 'noreply@' + geddy.config.hostname
              , to: user.email
              , text: activationUrl
              }, function (err, data) {
                if (err) {
                  throw err;
                }
                self.respondWith(user, options);
              });
            }

            else {
              self.respondWith(user);
            }
          });
        }
        else {
          self.respondWith(user, {status: err});
        }
      }
    });

  };

  this.activate = function (req, res, params) {
    console.log(params.token);
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        user.password = '';
        self.respondWith(user);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(user);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      // Only update password if it's changed
      var skip = params.password ? [] : ['password'];

      user.updateAttributes(params, {skip: skip});

      if (!user.isValid()) {
        self.respondWith(user);
      }
      else {
        if (params.password) {
          user.password = generateHash(user.password);
        }

        user.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(user, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.User.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(user);
        });
      }
    });
  };

};

exports.Users = Users;
