const express = require('express')
const Session = require('./model')
const openAIChat = require('./utils/openai')
const router = express.Router()
const cors = require('cors');


const app = express();
app.use(cors());

const corsOptions = {
  origin: '*', // 指定前端的地址
  methods: 'GET,POST',
  credentials: true, // 启用发送认证信息
};

router.use(cors(corsOptions));

router.post('/sessions', async (req, res) => {
  const { user, content } = req.body;

  if (!user || !content) {
    return res.status(400).json({ error: 'User ID and content are required' });
  }

  try {
    
    const session = new Session({
      user,
      content: [content], 
      AIresponse: '',
    });

    const savedSession = await session.save();

    const response = {
      Diaryid: savedSession._id,
      user: savedSession.user,
      AIresponse: savedSession.AIresponse,
      content: savedSession.content,
      createdAt: savedSession.createdAt,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the content of a Session by session ID
router.get('/sessions/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = {
      Diaryid: session._id,
      user: session.user,
      AIresponse: session.AIresponse,
      content: session.content,
      createdAt: session.createdAt,
    };

    res.status(200).json(sessionData);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError' || error.name === 'DocumentNotFoundError') {
      res.status(404).json({ error: 'Session not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


router.post('/sessions/:sessionId/content', async (req, res) => {
  const { user, content } = req.body;

  if (!user || !content) {
    return res.status(400).json({ error: 'User ID and content are required' });
  }

  try {
    const AIresponse = await openAIChat([content]);

    const session = new Session({
      user,
      content: content, 
      AIresponse: AIresponse,
    });

    const savedSession = await session.save();

    const response = {
      AIresponse: savedSession.AIresponse,
    };

    res.status(201).json(AIresponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message });
  }
});

module.exports = router;