module.exports = {
  getToken: (req) => {
    return req.headers.authorization.replace("Bearer ", "");
  },
  isLogedIn: (req, res, next) => {
    require("dotenv").config();
    const jwt = require("jsonwebtoken");
    const secret = process.env.secret;

    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const verify = jwt.verify(token, secret);

      if (verify != null) {
        next();
      }
    } catch (error) {
      res.status(401).send("authorize failed with " + error.message);
    }
  },
  getMemberId: (req) => {
    const jwt = require("jsonwebtoken");
    const token = req.headers.authorization.replace("Bearer ", "");
    const payload = jwt.decode(token);
    return payload.id;
  },
};
