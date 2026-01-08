import logger from '#config/logger.js';
import { formatValidationsEroor } from '#validations/format.js';
import { SignupSchema } from '#validations/auth.validation.js';
import { createUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = SignupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationsEroor(validationResult.error),
      });
    }
    const { name, email, password, role } = validationResult.data;
    //AUTH Service
    const user = await createUser({ name, email, password, role });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    logger.info(`User signed up: ${email} with role: ${role}`);
    res.status(201).json({
      message: 'User signed up successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    logger.error('Error in signup controller:', e);
    if (e.message === 'User already exists') {
      return res.status(409).json({ error: e.message });
    }
    next(e);
  }
};
