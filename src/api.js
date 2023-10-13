const express = require('express')
const Session = require('./model')
const OpenAIChat = require('./utils/openai')

const router = express.Router()

router.get("/test", (req, res) => {
  res.send({ msg: "you are amazing!" });
})

// Create session.
router.post('/users/:userId/sessions', (req, res) => {
	// 從 request 中獲取 'userId' 參數
	const userId = req.params.userId;

	// 檢查 'postId' 參數是否存在
	if (!userId) {
		res.status(400).send({
			message: 'User ID is required',
		});
		return;
	}

  try {
    const newSession = new Session({
      user: userId,
      title: ""
    });
    console.log(newSession);

    newSession.save().then(data => {
      const savedDocument = {
        _id: data._id,
        user: data.user,
        title: data.title,
        createdAt: data.createdAt,
        messages: data.messages
      };
      res.send(savedDocument);
    })
  } catch (error){
    console.error(error);
    res.status(500).send({
      message: 'Internal Server Error'
    });
  }
  
})

// Use userId to search for all corresponding sessions.
router.get('/users/:userId/sessions', (req, res) => {
  const userId = req.params.userId;

	if (!userId) {
		res.status(400).send({
			message: 'User ID is required',
		});
		return;
	}

  (async () => {
    try {
      const ses = await Session.find({ user: userId }).select('_id user title createdAt');
      res.send(ses);
    } catch (error){
      console.error(error);
      res.status(500).send({
        message: 'Internal Server Error'
      });
    }
  })();
})

// Use sessionId to search for a Session object.
router.get('/session/:sessionId', (req, res) => {
	// 從 request 中獲取 'sessionId' 參數
	const sessionId = req.params.sessionId;

	// 檢查 'sessionId' 參數是否存在
	if (!sessionId) {
		res.status(400).send({
			message: 'Session ID is required',
		});
		return;
	}

  (async () => {
    try {
      const ses = await Session.findById(sessionId).select('_id user title messages createdAt');
      if (!ses) {
        res.status(404).send({
          message: 'Session not found',
        });
        return;
      }
      res.send(ses)
    } catch (error){
      console.error(error);
      if (error.name === 'CastError' || error.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: 'Session not found'
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error'
        });
      }
    }
  })();
})

// Use sessionId to delete a Session object.
router.delete('/session/:sessionId/', (req, res) => {
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    res.status(400).send({
      message: 'Session ID is required',
    });
    return;
  }

  (async () => {
    try {
      const ses = await Session.findByIdAndDelete(sessionId);
      if (!ses) {
        res.status(404).send({
          message: 'Session not found',
        });
        return;
      }
      res.send({
        message: 'Session deleted'
      });
    } catch (error){
      console.error(error);
      if (error.name === 'CastError' || error.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: 'Session not found'
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error'
        });
      }
    }
  })();

})

// Update the title of a Session.
router.put('/session/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  const title = req.query.title

  if (!sessionId || !title) {
    res.status(400).send({
      message: 'Session ID and title is required',
    });
    return;
  }

  console.log(title);

  (async () => {
    try {
      const ses = await Session.findByIdAndUpdate(sessionId, { $set: {title} }, {new: true}).select('_id user title messages createdAt');
      if (!ses) {
        res.status(404).send({
          message: 'Session not found',
        });
        return;
      }
      res.send(ses);
    } catch (error){
      console.error(error);
      if (error.name === 'CastError' || error.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: 'Session not found'
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error'
        });
      }
    }
  })();

})

// Update the messages of a Session by OpenAI API.
router.put('/session/:sessionId/messages', (req, res) => {
  const sessionId = req.params.sessionId;
  const content = req.body.content;

  if (!sessionId || !content) {
    res.status(400).send({
      message: 'Content and sessionId is required',
    });
    return;
  }

  console.log(content);

  (async () => {
    try {
      var ses = await Session.findByIdAndUpdate(sessionId, { $push: {messages: content} }, {new: true});
      if (!ses) {
        res.status(404).send({
          message: 'Session not found',
        });
        return;
      }

      OpenAIChat(ses.messages).then((value) => {
        return Session.findByIdAndUpdate(sessionId, { $push: {messages: value.message.content} }, {new: true}).select('_id user title messages createdAt');
      }).then((session) => res.send(session));

    } catch (error){
      console.error(error);
      if (error.name === 'CastError' || error.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: 'Session not found'
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error'
        });
      }
    }
  })();

})

module.exports = router;