const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/users');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.findAll();
  } catch (err) {
    return next(
      new HttpError('Fetching users failed, please try again later.'),
      500
    );
  }

  res.json({ users: users.map((user) => user.userData.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findAll({
      where: {
        id: userId
      }
    });
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find user.', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user with the provided id', 404));
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  const {
    userName,
    email,
    phone,
    password
  } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError('Could not create user, please try again', 500));
  }

  const userToCreate = {
    userName,
    email,
    phone,
    password: hashedPassword,
    role: "internal"
  }

  let createdUser;
  try {
    createdUser = await User.create({data: userToCreate});
  } catch (err) {
    const error = new HttpError('Signing up user to DB failed.', 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.data.email,
        role: createdUser.data.role
      },
      process.env.TOKEN_ENCRYPTION,
      { expiresIn: '8h' }
    );
  } catch (err) {
    const error = new HttpError('Signing up user failed.', 500);
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.data.email,
    userName: createdUser.data.userName,
    token
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findAll({
      where: {
        "data.email": {
          [Op.is]: email
        }
      }
    });
  } catch (err) {
    const error = new HttpError('Login failed, please try again', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid email addres, could not log you in',
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.data.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid password, could not log you in',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.data.email,
        role: existingUser.data.role
      },
      process.env.TOKEN_ENCRYPTION,
      { expiresIn: '6h' }
    );
  } catch (err) {
    const error = new HttpError('Logging in failed.', 500);
    return next(error);
  }

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.data.email,
    userName: existingUser.data.userName,
    token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
