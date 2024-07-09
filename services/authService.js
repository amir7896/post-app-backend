const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET;

class AuthService {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }
  async generateHashPassword(password) {
    try {
      const saltRounds = 12;
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (error) {
      throw new Error("Error generating hash password");
    }
  }

  async comparePasswords(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error("Error comparing passwords");
    }
  }

  generateJwtToken(payload, expiresIn) {
    try {
      const token = jwt.sign(payload, this.secretKey, { expiresIn });
      return token;
    } catch (error) {
      throw new Error("Error generating JWT token", error);
    }
  }
}

module.exports = new AuthService(jwtSecretKey);
