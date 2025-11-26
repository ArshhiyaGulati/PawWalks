const Walk = require('../models/Walk');

exports.bookWalk = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      ownerId: req.user.id,
      status: 'requested',
    };
    const walk = await Walk.create(payload);
    return res.status(201).json(walk);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to book walk' });
  }
};

exports.getOwnerWalks = async (req, res) => {
  try {
    const ownerId = req.params.id || req.user.id;
    const walks = await Walk.find({ ownerId }).sort({ createdAt: -1 });
    return res.status(200).json(walks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to fetch walks' });
  }
};

exports.getWalkerWalks = async (req, res) => {
  try {
    const walkerId = req.params.id || req.user.id;
    const walks = await Walk.find({
      $or: [{ status: 'requested' }, { walkerId }],
    }).sort({ createdAt: -1 });
    return res.status(200).json(walks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to fetch walks' });
  }
};

exports.acceptWalk = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.walkId);
    if (!walk) return res.status(404).json({ message: 'Walk not found' });
    if (walk.status !== 'requested') {
      return res.status(400).json({ message: 'Walk not available' });
    }
    walk.status = 'accepted';
    walk.walkerId = req.user.id;
    await walk.save();
    return res.status(200).json(walk);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to accept walk' });
  }
};

exports.rejectWalk = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.walkId);
    if (!walk) return res.status(404).json({ message: 'Walk not found' });
    if (walk.walkerId?.toString() === req.user.id) {
      walk.walkerId = null;
    }
    walk.status = 'requested';
    await walk.save();
    return res.status(200).json(walk);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to reject walk' });
  }
};

exports.startWalk = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.walkId);
    if (!walk) return res.status(404).json({ message: 'Walk not found' });
    if (walk.walkerId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to this walk' });
    }
    walk.status = 'ongoing';
    if (req.body.location) {
      walk.locationUpdates.push(req.body.location);
    }
    await walk.save();
    return res.status(200).json(walk);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to start walk' });
  }
};

exports.endWalk = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.walkId);
    if (!walk) return res.status(404).json({ message: 'Walk not found' });
    if (walk.walkerId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to this walk' });
    }
    walk.status = 'completed';
    walk.summary = req.body.summary;
    walk.photos = req.body.photos || [];
    if (req.body.location) {
      walk.locationUpdates.push(req.body.location);
    }
    await walk.save();
    return res.status(200).json(walk);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to end walk' });
  }
};

exports.appendLocation = async (walkId, location) => {
  try {
    await Walk.findByIdAndUpdate(walkId, {
      $push: { locationUpdates: location },
    });
  } catch (err) {
    console.error('Socket location error', err);
  }
};

