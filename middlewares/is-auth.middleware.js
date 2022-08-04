import jwt from 'jsonwebtoken';

export default async function isAuth(req, res, next) {
  if (!req.cookies || req.cookies && !req.cookies['access_token']) {
    return res.status(403).send('Has no cookie');
    // redirect to login
    // res.redirect('/login');
  }

  const token = req.cookies['access_token'];

  // verify
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedPayload);

    req.userData = decodedPayload;

    return next();
  } catch (e) {
    console.log(e);

    // очистить куки с невалидным токеном
    res.clearCookie('access_token');

    return res.status(403).send('Invalid token');
    // redirect to login
    // res.redirect('/login');
  }
}
