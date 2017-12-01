import * as express from 'express';
import * as dotenv from 'dotenv';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import mongoose = require('mongoose');
import UserRoutes from './controllers/user';
import User from './models/user';
import { MongoError } from 'mongodb';
import * as jwt from 'jsonwebtoken';
import * as cors from 'cors';

const app = express();
dotenv.config({ path: '.env' });
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGO_CONNECTION, {
  useMongoClient: true
});

app.set('superSecret', 'DOCKET'); // secret variable
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3010' }));
app.get('/', (req, res) => {
  res.send('Hellow World Again');
});

UserRoutes.use((req, res, next) => {
  const token =
    req.body.token || req.param('token') || req.headers['x-access-token'];
  if (token) {
    jwt.verify(
      token,
      app.get('superSecret'),
      (err: jwt.JsonWebTokenError, decoded: jwt.DecodeOptions) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          next();
        }
      }
    );
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.use('/api', UserRoutes);

app.get('/createuser', (req, res, next) => {
  const nick = new User({
    name: 'Nick Cerminara',
    password: 'password',
    admin: true
  });
  nick.save().then(() => res.json({ success: true }));
});

app.listen(3010, () => console.log('Example Server listening on port 3010!'));
