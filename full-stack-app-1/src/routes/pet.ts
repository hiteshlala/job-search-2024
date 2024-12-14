import express from 'express';
import multer from 'multer';
import path from 'node:path';
import Pet from '../models/Pet';

const imageFolderPath = 'images';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolderPath);
  },

  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const filename = `${originalName}-${crypto.randomUUID()}${extension}`;
    cb(null, filename);
  }
});

const multyPartFile = multer({ storage });

export const pet = express.Router();

pet.use((req, res, next) => {
  if (!req.session) {
    res.send({
      message: 'Only logged in users can access this resource',
    });
  } else {
    next();
  }
});

pet.post('/pet', multyPartFile.single('image'), (req, res) => {
  const { name, age, description } = req.body;
  if (name) {
    Pet.create({
      userId: req.session.userId,
      name: name,
      age: age || 0,
      description: description || 0,
      image: req.file?.path || '',
    })
    .then(pet => {
      res.send({
        message: 'Pet created successfully',
        success: true,
      });
    })
    .catch(error => {
      console.log(`Error - Pet not created! - ${error.message}`);
      res.send({
        message: `Error - Pet not created! - ${error.message}`,
        success: false,
      });
    })
  } else {
    res.send({
      message: 'Pet name required to add create a pet',
      success: false,
    });
  }
});

pet.get('/pet/:id', (req, res) => {
  Pet.findOne({
    where: {
      id: req.params.id
    }
  })
  .then((pet: Pet) => {
    res.send(pet);
  })
  .catch(error => {
    console.log( 'Error geting pet', error.message);
    res.send({
      error: `Error geting pet ${error.message}`,
    });
  });
});

pet.put('/pet/:id', multyPartFile.single('image'), (req, res) => {
  const { name, age, description } = req.body;
  Pet.findOne({
    where: {
      id: req.params.id
    }
  })
  .then((pet: Pet) => {
    pet.name = name;
    pet.age = age || 0;
    pet.description = description || '';
    if (req.file) {
      pet.image = req.file.path;
    }
    return pet.save();
  })
  .then(() => {
    res.send({ success: true, message: 'Pet updated.' });
  })
  .catch(error => {
    console.log( 'Error geting pet', error.message);
    res.send({
      error: `Error geting pet ${error.message}`,
    });
  });
});
