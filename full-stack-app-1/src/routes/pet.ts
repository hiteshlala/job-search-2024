import express from 'express';
import Pet from '../models/Pet';

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

pet.post('/pet', (req, res) => {
  const { name, age, description } = req.body;
  if (name) {
    Pet.create({
      userId: req.session.userId,
      name: name,
      age: age || 0,
      description: description || 0,
      // images to come
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

pet.put('/pet/:id', (req, res) => {
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
