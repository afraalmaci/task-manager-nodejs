const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Yetkisiz' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token geçersiz' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token yok' });
  }
};

module.exports = { protect };