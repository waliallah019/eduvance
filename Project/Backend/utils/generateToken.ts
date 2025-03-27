const jwt = require('jsonwebtoken');

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;
export default generateToken;