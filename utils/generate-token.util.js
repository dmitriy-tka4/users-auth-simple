import jwt from 'jsonwebtoken';

const generateToken = async (payload, secret) => {
  const token = await jwt.sign(payload, secret, { expiresIn: '1800s' });

  return token;
};

export { generateToken };
