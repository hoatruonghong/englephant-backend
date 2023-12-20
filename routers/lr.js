import express from "express";
//import models
import learnerlrl from '../models/learnerlrl.js';
import lrl from '../models/lrl.js';
import lrquiz from '../models/lrquiz.js';
import lranswer from '../models/lranswer.js';

const router = express.Router();

//Learner: Get quizzes of a lesson
router.get('/quiz/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const quizzes = await lrquiz.find({lesson: lessonId})
        return res.status(200).json({ quiz: quizzes});
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
});  

//Learner: Get answers
router.get('/answer/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const answers = await lranswer.find({quizId: quizId});   
    return res.status(200).json({ data: answers });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Get lesson
router.get('/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await lrl.findById(lessonId);
    return res.status(200).json({ data: lesson });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Get all lessons status
router.get('/learner/:learnerId', async (req, res) => {
    try {
        const { learnerId } = req.params;
        const alllessons = await lrl.find();
        const data = await Promise.all(alllessons.map(async lesson => {
        const activelesson = await learnerlrl.findOne({learnerId: learnerId, lrlId: lesson._id});
        if (activelesson){
            lesson._doc.active = true;
            lesson._doc.point = activelesson.point;
            lesson._doc.total = activelesson.total;
            lesson._doc.isDone = activelesson.point/activelesson.total>=0.5? true : false;
        } else {
            lesson._doc.active = false;
        }
        return lesson;
      }));
      return res.status(200).json({ data: data });
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
  });

//Learner: Unlock Lesson
router.post('/:lessonId', async (req, res) => {
  const {lessonId} = req.params;
  const {learnerId} = req.body;
  try {
      const isUnlocked = await learnerlrl.exists({learnerId: learnerId, lrlId: lessonId});
      if (isUnlocked) 
        return res.status(200).json({ message: "Already unlocked!" });
      const unlockedlr = await learnerlrl.create({learnerId: learnerId, lrlId: lessonId, status: 0});
      return res.status(200).json({ data: unlockedlr });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });  
  }
});

//Learner: Send result
router.get('/result/:lessonId', async (req, res) => {
  const { lessonId } = req.params;
  const { learnerId, point, totalnumofquiz } = req.body;
  try {
    const result = await learnerlrl.findOne({lrlId: lessonId, learnerId: learnerId});
    if (point> result.point)
      await learnerlrl.findByIdAndUpdate( result._id, { point: point, total: totalnumofquiz });
    res.status(200).json({ message: "Update Node result successfully!" })
  } catch (error) {
      return res.status(500).json({ message: JSON.stringify(error) });
  }
});


export default router;