import express from 'express';
import session from 'express-session';

import connectMongo from 'connect-mongo';
import connectFlash from 'connect-flash';

import compression from 'compression';

import morgan from 'morgan';
import winston from 'winston';

import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import multer from 'multer';
import methodOverride from 'method-override';

// import csurf from 'csurf';
import cors from 'cors';

import config from './';

const env = process.env.NODE_ENV || 'development';

const upload = multer();
const mongoStore = connectMongo(session);

export default function(app, passport) {

  app.use(compression({
    threshold: 512,
  }));

  app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
  }));

  // app.use(express.static(config.staticFiles));

  let log = 'dev';
  if (env !== 'development') {
    log = {
      stream: {
        write: message => winston.info(message)
      }
    };
  }

  if (env !== 'test') app.use(morgan(log));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(upload.single('image'));
  app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  app.use(cookieParser());
  app.use(cookieSession({ secret: 'secret' }));
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'tagit',
    store: new mongoStore({
      url: config.db,
      collection: 'sessions',
    })
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(connectFlash());

  if (env === 'development') {
    app.locals.pretty = true;
  }

}
