import express from 'express';

export const image = express.Router();

image.use((req, res, next) => {
  if (!req.session) {
    res.send({
      message: 'Only logged in users can access this resource',
    });
  } else {
    next();
  }
});

image.use(express.static('images'));
