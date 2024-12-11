import express from 'express';
import { hashPassword } from '../middleware/setSession';
import User from '../models/User';

export const user = express.Router();

// no session for new users
user.post('/user', (req, res) => {
  const { userName, password } = req.body;
  if (userName && password) {
    User.create({
      name: userName,
      password: hashPassword(password),
    })
    .then(user => {
      res.send({
        message: 'User created successfully',
        success: true,
      });
    })
    .catch(error => {
      console.log(`Error - User not created! - ${error.message}`);
      res.send({
        message: `Error - User not created! - ${error.message}`,
        success: false,
      });
    })
  } else {
    res.send({
      message: 'User name and password required to created account',
      success: false,
    });
  }
});

user.get('/user', (req, res) => {
  if (req.session) {
    let user: User;
    User.findOne({
      where: {
        id: req.session.userId
      }
    })
    .then((_user: User) => {
      user = _user;
      return _user.getPets();
    })
    .then((_pets) => {
      user.password = undefined;
      const pets = _pets.map((pet) => ({ 
        id: pet.id,
        images: pet.images,
        name: pet.name,
        age: pet.age,
        description: pet.description,
        checkedOutBy: pet.checkedOutBy,
      }));
      res.send({ user: {...user.dataValues, pets } });
    })
    .catch(error => {
      console.log( 'Error geting user', error.message);
      res.send({
        error: `Error geting user ${error.message}`,
      });
    })
  } else {
    res.send({
      message: 'Only logged in users can access this resource',
    });
  }
});
