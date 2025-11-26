const Dog = require('../models/Dog');

exports.createDog = async (req, res) => {
  try {
    const dog = await Dog.create({ ...req.body, ownerId: req.user.id });
    return res.status(201).json(dog);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to create dog' });
  }
};

exports.getDogsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId || req.user.id;
    const dogs = await Dog.find({ ownerId });
    return res.status(200).json(dogs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to fetch dogs' });
  }
};

