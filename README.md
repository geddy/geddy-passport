# Geddy-Passport

## DEPRECATION NOTICE
**Geddy is no longer actively maintained, and therefore it is not recommended to be used for any new projects.**

Geddy provides built-in authentication which integrates with
[Passport](http://passportjs.org/) to allow auth against either local accounts
or third-party social services like Facebook and Twitter.

#### Using the generator

To set up a new Geddy app with built-in authentication, create your application
like normal, then run the `geddy auth` command inside, like so:

```
$ geddy app by_tor
$ cd by_tor
$ geddy auth
```

This will pull down [Geddy-Passport](https://github.com/mde/geddy-passport)
using NPM, and install all the needed code into your app. This includes the
needed Passport libraries, and the Geddy models and controllers for the local
User accounts and the login process.

#### Danger, Warning, etc.

The `geddy auth` generator should only be used in a new Geddy app. If you
run it inside an existing app, it may overwrite existing files that you wanted
to keep.

If you need to add auth to an existing app, you can take a look at the
Geddy-Passport project, which is itself a Geddy app scaffold, and use the pieces
you need.

#### Configuring Passport

You'll need to add the settings for Passport in your app's environment.js file.
That includes the redirect locations for after an auth failure or success, and
the OAuth keys for your app. The setting will look something like this:

```javascript
  passport: {
    successRedirect: '/'
  , failureRedirect: '/login'
  , twitter: {
      consumerKey: 'XXXXXXX'
    , consumerSecret: 'XXXXXXX'
    }
  , facebook: {
      clientID: 'XXXXXXX'
    , clientSecret: 'XXXXXXX'
    }
  }
```

#### Local users

Local User accounts just go through the usual RESTful actions you'd get in a
normal Geddy resource. Start at "/users/add" to create a new User. You can
modify "/app/models/user.js" to add any other properties you want.

#### Login with third-party services

A successful login with a third-party service like Facebook or Twitter will
create a linked local User account if one does not exist.

#### Authenticated users

After a user successfully authenticates, she will end up redirected to the
`successRedirect` you've specified, and there will be two new items in the
user's session:

 * userId -- the id for the local User account
 * authType -- the method of authentication (e.g., 'local', 'twitter')
