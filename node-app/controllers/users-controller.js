const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('../db');
const { Op } = Sequelize;
const HttpError = require('../models/http-error');
const User = require('../models/user');

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
  console.log(users)
  res.json(users);
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

  res.json(user);
};

const signup = async (req, res, next) => {
  const {
    userName,
    email,
    phone,
    password
  } = req.body;

  // check for already existing email address
  let existingUsers;
  try {
    existingUsers = await User.findAll({
      where: {
        "data.email": {
          [Op.eq]: email
        }
      }
    });
  } catch (err) {
    const error = new HttpError('Signup failed with error:\n' + err , 500);
    return next(error);
  }

  if (existingUsers.length === 1) {
    const error = new HttpError(
      'Email addres is already used, please signup with another email address.',
      401
    );
    return next(error);
  }

  // encrypt password before saving it into
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
    const error = new HttpError('Signing up user to DB failed with error' + err, 500);
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

  let existingUsers;
  try {
    existingUsers = await User.findAll({
      where: {
        "data.email": {
          [Op.eq]: email
        }
      }
    });
  } catch (err) {
    const error = new HttpError('Login failed with error:\n' + err , 500);
    return next(error);
  }

  if (existingUsers.length !== 1) {
    const error = new HttpError(
      'Invalid email addres, could not log you in',
      401
    );
    return next(error);
  }

  const existingUser = existingUsers[0].dataValues;
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.data.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials. ' + err,
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

// ------- available only for internal users -----

const createUser = async (req, res, next) => {
  const {
    userName,
    email,
    phone,
    password
  } = req.body;

  // check for already existing email address
  let existingUsers;
  try {
    existingUsers = await User.findAll({
      where: {
        "data.email": {
          [Op.eq]: email
        }
      }
    });
  } catch (err) {
    const error = new HttpError('Signup failed with error:\n' + err , 500);
    return next(error);
  }

  if (existingUsers.length === 1) {
    const error = new HttpError(
      'Email addres is already used, please create with another email address.',
      401
    );
    return next(error);
  }

  // encrypt password before saving it into
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
    role: "external"
  }

  let createdUser;

  try {
    createdUser = await User.create({data: userToCreate});
  } catch (err) {
    const error = new HttpError('Signing up user to DB failed with error' + err, 500);
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
    phone: createdUser.data.phone,
    token
  });
};

const deleteUserById = async (req, res, next) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.destroy({
      where: {
        id: userId,
        "data.role": {
          [Op.eq]: "external"
        }
      }
    });
  } catch (err) {
    return next(new HttpError('Something went wrong while dropping user. ' + err, 500));
  }

  if (!user) {
    return next(new HttpError('Could not delete user with the provided id', 404));
  }

  res.json(`User with id ${userId} was successfuly deleted.`);
};

const getUsersInternal = async (req, res, next) => {
  let users;
  try {
    users = await User.findAll({
      where: {
        "data.role": {
          [Op.eq]: "external"
        }
      }
    });
  } catch (err) {
    return next(
      new HttpError('Fetching users failed, please try again later.'),
      500
    );
  }
  
  res.json(users.map(user => {
    "userId": user.id,
    email: user.data.email,
    phone: user.data.phone
  }));
};

module.exports = { getUsers, getUserById, deleteUserById, signup, login, createUser, getUsersInternal }
