import User from '../models/user.model.js'

export async function renderPage(req, res) {


  // TODO: вынести получение пользоватля в attachCurrentUser middleware - будет добавлять в req.currentUser
  // можно будет добавлять к любому запросу, где нужен пользователь, например, на главной
  console.log('req.userData', req.userData);

  const id = req.userData.userId;

  // из payload токена получить id пользователя и по нему найти пользователя и вернуть в шаблон
  // вторым параметром ограничиваем выборку полей, нельзя передавать на клиент пароль
  // const user = await User.findById(id, ['email', 'createdAt']);
  // or exclude password, include other fields
  const user = await User.findById(id, ['-password']);
  console.log(user);

  // брать из req.currentUser

  // хотя сейчас с Nunjucks данные и так не передаются на клиента, отдается заполненная отрендеренная страница,
  // данные в ней только те, что указаны в шаблоне
  res.render('profile.njk', { user });
}
