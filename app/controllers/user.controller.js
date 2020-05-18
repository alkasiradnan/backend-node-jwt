const db = require("../models");
const User = db.user;

module.exports = {
getAll: (req, res) => {
    User.find({}, (err, users) => {
    if (!err) {
      res.send(users);
    } else {
      console.log('Error', err);
    }
  });
}
}