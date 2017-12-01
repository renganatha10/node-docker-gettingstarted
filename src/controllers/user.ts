import * as express from 'express';
import User from './../models/user';
import { MongoError } from 'mongodb';
import * as jwt from 'jsonwebtoken';

const apiRoutes = express.Router();

apiRoutes.get('/users', (req, res) => {
  User.find().exec((error, users) => {
    if (error) {
      res.send({ message: 'Connot Load Users', err: error });
    } else {
      res.json(users);
    }
  });
});

apiRoutes.post('/authenticate', (req, res) => {
  User.findOne(
    {
      name: req.body.name
    },
    (err, user: any) => {
      if (err) {
        throw err;
      }
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        // check if password matches
        if (user.password !== req.body.password) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {
          // if user is found and password is right
          // create a token
          var payload = {
            admin: user.admin
          };
          var token = jwt.sign(payload, 'superSecret', {
            expiresIn: 86400 // expires in 24 hours
          });

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    }
  );
});

export default apiRoutes;
