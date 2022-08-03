import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { generateToken } from '../utils/generate-token.util.js'

export function showForm(req, res) {
  // case: если есть jwt и он валидный - редирект на профиль
  // или, может быть такое решение,
  // если пользователь перешел на такую страницу, то разлогинивать, удаляя куки

  // невалидный - удалять куки и показывать форму
  res.clearCookie('access_token');

  res.render('login.njk');
}

export async function handlePost(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Данные неполные');
  }

  // find user by email
  const user = await User.findOne({ email: email });

  // если такого нет, будет null, то не зарегистрирован
  if (!user) {
    return res.status(404).send('Incorrect email, пользователь не найден');
  }

  console.log(user);

  // проверка пароля

  const trimmedPassword = password.trim();

  const isPasswordCorrect = await bcrypt.compare(trimmedPassword, user.password);
  console.log('isAuthenticated', isPasswordCorrect);

  if (!isPasswordCorrect) {
    return res.status(400).send('Ошибка авторизации, неверный пароль');
    // return throw new Error('Incorrect password');
  }

  const payload = {
    userId: user._id
  };

  // TODO: вынести в функцию (util) генерации токена - применяется в двух местах (login, sign up)
  // const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1800s' });
  const token = await generateToken(payload, process.env.JWT_SECRET);

  // add cookie
  res.cookie('access_token', token);

  // пользователь авторизован
  res.redirect('/profile');
}
