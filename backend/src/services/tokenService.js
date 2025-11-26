const jwt = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '7d' }
  );

module.exports = { signToken };

