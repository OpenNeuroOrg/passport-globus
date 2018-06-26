var express = require('express')
var session = require('express-session')
var passport = require('passport')
var jwt = require('jsonwebtoken')
var GlobusStrategy = require('../lib').Strategy

// these are needed for storing the user in the session
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

// add the GLOBUS authentication strategy
passport.use(new GlobusStrategy({
  state: true, // remove this if not using sessions
  clientID: process.env.GLOBUS_CLIENT_ID,
  clientSecret: process.env.GLOBUS_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/globus/callback'
}, function (accessToken, refreshToken, params, profile, done) {
  // `profile` is empty as Globus has no generic profile URL,
  // but rather returns a json web token in the params. so we
  // set the profile to a decoded params.id_token
  profile = jwt.decode(params.id_token)

  return done(null, profile)
}))

var app = express()

app.use(session({ secret: 'foo', resave: false, saveUninitialized: false }))
app.use('/files', express.static('files'))

app.use(passport.initialize())
app.use(passport.session())

// show sign in or sign out link
app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.send('<a href="/auth/logout">Sign out</a>')
  } else {
    res.send('<a href="/auth/globus/login">Sign in with GLOBUS</a>')
  }
})

// start authenticating with ORCID
app.get('/auth/globus/login', passport.authenticate('globus', {
  scope: ['email', 'profile', 'openid']
}))

// finish authenticating with ORCID
app.get('/auth/globus/callback', passport.authenticate('globus', {
  successRedirect: '/profile',
  failureRedirect: '/'
}))

// sign out
app.get('/auth/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// show the authenticated user's profile data
app.get('/profile', checkAuth, function (req, res) {
  res.json(req.user)
})

function checkAuth (req, res, next) {
  if (!req.isAuthenticated()) res.redirect('/auth/globus/login')
  return next()
}

app.listen(5000, function (err) {
  if (err) return console.log(err)
  console.log('Listening at http://localhost:5000/')
})
