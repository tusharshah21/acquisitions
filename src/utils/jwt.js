import logger from '#config/logger.js';
import jwtPkg from 'jsonwebtoken';
const { sign, verify } = jwtPkg;

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Failed to authenticate token:', error);
      throw new Error('Failed to authenticate token');
    }
  },
  verify: token => {
    try {
      return verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Failed to authenticate token:', error);
      throw new Error('Failed to authenticate token');
    }
  },
};
