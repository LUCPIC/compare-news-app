const connectDB = require('../mongo');
const { ObjectId } = require('mongodb');

const premiumMiddleware = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });

    if (user && user.subscription && user.subscription.type === 'premium') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Premium subscription required.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during premium check.' });
  }
};

module.exports = premiumMiddleware;