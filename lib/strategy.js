var util = require('util')
var OAuth2Strategy = require('passport-oauth2')

/**
 * First, register an Globus API client:
 * https://developers.globus.org/
 *
 * Options:
 *   - `clientID`      your Globus application's client id
 *   - `clientSecret`  your Globus application's client secret
 *   - `callbackURL`   URL to which Globus will redirect the user after granting authorization
 *
 * Example:
 *
 *     var jwt = require('jsonwebtoken')
 *
 *     passport.use(new GlobusStrategy({
 *         sandbox: process.env.NODE_ENV !== 'production',
 *         state: true, // remove this if not using sessions,
 *         clientID: process.env.GLOBUS_CLIENT_ID,
 *         clientSecret: process.env.GLOBUS_CLIENT_SECRET,
 *         callbackURL: 'https://your.host/auth/globus/callback',
 *       },
 *       function(accessToken, refreshToken, params, profile, done) {
 *         // NOTE: `profile` is empty, but `params` contains `id_token` which
 *         // is a json web token that needs to be decoded
 *         profile = jwt.decode(params.id_token)
 *
 *         User.findOrCreate(profile, function (err, user) {
 *           done(err, user)
 *         })
 *       }
 *     ))
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy (options, verify) {
  options.scope = options.scope || null
  options.authorizationURL = 'https://auth.globus.org/v2/oauth2/authorize'
  options.tokenURL = 'https://auth.globus.org/v2/oauth2/token'

  OAuth2Strategy.call(this, options, verify)
  this.name = 'globus'
}

util.inherits(Strategy, OAuth2Strategy)

module.exports = Strategy
