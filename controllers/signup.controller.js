import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { generateToken } from '../utils/generate-token.util.js';

export function showForm(req, res) {
  // case: если есть jwt и он валидный - редирект на профиль
  // или, может быть такое решение,
  // если пользователь перешел на такую страницу, то разлогинивать, удаляя куки

  // невалидный - удалять куки и показывать форму
  res.clearCookie('access_token');

  res.render('signup.njk');
}

export async function handlePost(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  const { email, password } = req.body;

  // нужно добавить строгую валидацию
  if (!email || !password) {
    return res.status(400).send('Данные неполные');
  }

  // проверка на существование уже такого пользователя by email

  const isEmailExisted = await User.exists({ email: email });

  if (isEmailExisted) {
    return res.status(401).send('Такой email уже существует');
  }

  // password must be min 6 symbols

  const trimmedPassword = password.trim();

  if (trimmedPassword.length < 6) {
    return res.status(401).send('Пароль слишком простой, должен быть не менее 6 символов');
  }

  const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

  const user = new User({
    email,
    password: hashedPassword
  });

  // обработать ошибку валидации базы
  try {
    const savedUser = await user.save();
    console.log('savedUser', savedUser)

    // create jwt with payload savedUser._id
    const payload = {
      userId: savedUser._id,
    }

    // TODO: вынести в функцию (util) генерации токена - применяется в двух местах (login, sign up)
    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1800s' });
    const token = await generateToken(payload, process.env.JWT_SECRET);

    // add jwt to cookies
    res.cookie('access_token', token); // , { httpOnly: true, secure: true }

    return res.status(201).send('User saved');
    // user saved, редирект на профиль
    // res.redirect('/profile');
  } catch (e) {
    next(e);
  }
}
