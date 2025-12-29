const express = require('express');
const { ObjectId } = require('mongodb');
const natural = require('natural');
const connectDB = require('../mongo');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const premiumMiddleware = require('../middleware/premium');

const router = express.Router();

// Middleware to get DB and collections
const getCollections = async (req, res, next) => {
  try {
    const db = await connectDB();
    req.newsCollection = db.collection('news');
    req.commentsCollection = db.collection('comments');
    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to connect to database' });
  }
};

router.use(getCollections);

// --- Public Routes ---

router.get('/', async (req, res) => {
  const news = await req.newsCollection.find({}).toArray();
  res.json(news);
});

router.get('/:id', async (req, res) => {
  try {
    const event = await req.newsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'News event not found' });
    }
  } catch (error) {
     res.status(400).json({ message: 'Invalid event ID' });
  }
});

router.get('/:articleId/comments', async (req, res) => {
    try {
        const comments = await req.commentsCollection.find({ articleId: new ObjectId(req.params.articleId) }).toArray();
        res.json(comments);
    } catch (error) {
        res.status(400).json({ message: 'Invalid article ID' });
    }
});


// --- User Routes ---

router.post('/:articleId/like', authMiddleware, async (req, res) => {
    // In a real app, you would store likes. For now, just a success message.
    res.json({ message: `Successfully recorded your action.` });
});

router.post('/:articleId/comments', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }
  const newComment = {
    articleId: new ObjectId(req.params.articleId),
    userId: new ObjectId(req.user.id),
    username: req.user.username,
    text,
    date: new Date(),
  };
  await req.commentsCollection.insertOne(newComment);
  res.status(201).json(newComment);
});


// --- Premium User Routes ---

router.get('/:articleId/summary', authMiddleware, premiumMiddleware, async (req, res) => {
    // ... NLP logic will be added back later
    res.json({ summary: "This is a premium summary." });
});

router.get('/:articleId/bias', authMiddleware, premiumMiddleware, async (req, res) => {
    // ... NLP logic will be added back later
    res.json({ bias: { level: 'Premium Bias Analysis' } });
});


// --- Admin Routes ---

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { event } = req.body;
  const newEvent = { event, articles: [] };
  const result = await req.newsCollection.insertOne(newEvent);
  res.status(201).json(result.ops[0]);
});

router.put('/:eventId', authMiddleware, adminMiddleware, async (req, res) => {
    const { event } = req.body;
    const result = await req.newsCollection.updateOne(
        { _id: new ObjectId(req.params.eventId) },
        { $set: { event } }
    );
    res.json(result);
});

router.delete('/:eventId', authMiddleware, adminMiddleware, async (req, res) => {
    await req.newsCollection.deleteOne({ _id: new ObjectId(req.params.eventId) });
    res.status(204).send();
});

router.post('/:eventId/articles', authMiddleware, adminMiddleware, async (req, res) => {
    const { source, headline, content } = req.body;
    const newArticle = { _id: new ObjectId(), source, headline, content, date: new Date() };
    await req.newsCollection.updateOne(
        { _id: new ObjectId(req.params.eventId) },
        { $push: { articles: newArticle } }
    );
    res.status(201).json(newArticle);
});

router.put('/:eventId/articles/:articleId', authMiddleware, adminMiddleware, async (req, res) => {
    const { source, headline, content } = req.body;
    await req.newsCollection.updateOne(
        { "articles._id": new ObjectId(req.params.articleId) },
        { $set: { 
            "articles.$.source": source,
            "articles.$.headline": headline,
            "articles.$.content": content,
        } }
    );
    res.status(200).send();
});

router.delete('/:eventId/articles/:articleId', authMiddleware, adminMiddleware, async (req, res) => {
    await req.newsCollection.updateOne(
        { _id: new ObjectId(req.params.eventId) },
        { $pull: { articles: { _id: new ObjectId(req.params.articleId) } } }
    );
    res.status(204).send();
});

module.exports = router;