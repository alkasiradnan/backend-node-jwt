const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

module.exports = {
signup: (req, res) => {
    let result = {};
    let status = 201;
      const {username,password} = req.body;
      const user = new User({
        username: username,
        password: bcrypt.hashSync(password, 8)
      });
      user.save((err, user) => {
        if (!err) {
          result.status = status;
          result.result = user;
          result.message = "User was registered successfully!";
        } else {
          status = 500;
          result.status = status;
          result.error = err;
        }
        res.status(status).send(result);
      });
   

},
signin:(req, res)=>{
    const { username, password } = req.body;
    let result = {};
    let status = 200;
      User.findOne({username}, (err, user) => {
        if (!err && user) {
          bcrypt.compare(password, user.password).then(match => {
            if (match) {
                const payload = { username: user.username };
                const options = { expiresIn: '2d', issuer: 'https://scotch.io' };
                const secret = config.secret;
                const token = jwt.sign(payload, secret, options);
                result.token = token;
              result.status = status;
              result.result = user;
            } else {
              status = 401;
              result.status = status;
              result.error = 'Authentication error';
            }
            res.status(status).send(result);
          }).catch(err => {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          });
        } else {
          status = 404;
          result.status = status;
          result.error = "Username or password doesn't exist";
          res.status(status).send(result);
        }
      });
    },

}