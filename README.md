# passport-globus

[Passport](http://passportjs.org/) strategy for authenticating with [Globus](https://globus.org/) using the OAuth 2.0 API.

This module lets you authenticate using Globus in your Node.js applications. By plugging into Passport, Globus authentication can be easily and unobtrusively integrated into any application or framework that supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

This module was forked from the [passport-orcid](https://github.com/hubgit/passport-orcid) package which is copyrighted under an MIT License. 

## Install

```bash
$ npm install passport-globus
```

## Usage

#### Create an Application

Before using `passport-globus`, you must register an application with Globus. If you have not already done so, a new project can be created using [Globus's Developer Tools](https://developers.globus.org/). Your application will be issued a client ID and client secret, which need to be provided to the strategy. You will also need to configure a redirect URI which matches the route in your application.

#### Configure Strategy

The Globus authentication strategy authenticates users using a Globus account and OAuth 2.0 tokens.  The client ID and secret obtained when creating an application are supplied as options when creating the strategy.  The strategy also requires a `verify` callback, which receives the access token and optional refresh token, as well as `params` which contains the authenticated user's Globus identifier and name. The `verify` callback must call `done` providing a user to complete authentication.

```javascript
var jwt = require('jsonwebtoken')
var GlobusStrategy = require('passport-globus').Strategy;

passport.use(new GlobusStrategy({
    clientID: GLOBUS_CLIENT_ID,
    clientSecret: GLOBUS_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/globus/callback"
  },
  function(accessToken, refreshToken, params, profile, done) {
    // NOTE: `profile` is empty, use `params` instead
    User.findOrCreate(jwt.decode(params.id_token), function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'globus'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```javascript
app.get('/auth/globus',
  passport.authenticate('globus'));

app.get('/auth/globus/callback', 
  passport.authenticate('globus', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  ```