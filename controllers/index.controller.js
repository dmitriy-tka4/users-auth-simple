import User from '../models/user.model.js'

export async function getAllUsers(req, res, next) {

  // из payload токена получить id пользователя и по нему найти пользователя и вернуть в шаблон
  // const user = await User.findById(id);

  try {
    const countUsers = await User.countDocuments();
    const users = await User.find();

    res.render('index.njk', { users, countUsers }); // , user
  } catch (e) {
    next(e);
  }
}
