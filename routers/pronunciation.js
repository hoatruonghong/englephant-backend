import express from "express";
//import models
import learnerpl from '../models/learnerpl.js';
import learnersound from '../models/learnersound.js';
import pl from '../models/pl.js';
import pquiz from '../models/pquiz.js';
import panswer from '../models/panswer.js';
import sound from '../models/sound.js';

const router = express.Router();

//to shuffle quizzes
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

//Learner: Get quizzes of a lesson
router.get('/quiz/:type/:sound1/:sound2', async (req, res) => {
    try {
        const { type, sound1, sound2 } = req.params;
        const category = (type == 2)? "Phân biệt": "Luyện tập";
        const quizzes1 = await pquiz.find({sound: sound1, category: category});
        const quizzes2 = await pquiz.find({sound: sound2, category: category});
        const quizzes = shuffle(quizzes1.concat(quizzes2));
        return res.status(200).json({ quiz: quizzes});
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
});  

router.post('/create/quiz', async (req, res) => {
  const { question, word, audio, type, soundId } = req.body;
  try {
    const existedSound = await sound.findById(soundId);
    if (!existedSound)
      return res.status(400).json({ message: "Sound doesn't exist!" });

    const quiz = await pquiz.create({ question, word, audio, type, sound: existedSound });
    return res.status(200).json({ message: "Create successfully", data: quiz });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });  
  }
});

//Admin: Post answer for pquiz
router.post('/create/answer/:quizId', async (req, res) => {
  const { quizId } = req.params;
  const { content, isCorrect } = req.body;
  try {
    const existedQuiz = await pquiz.findById(quizId);
    if (!existedQuiz)
      return res.status(400).json({ message: "Quiz doesn't exist!" });

    const answer = await panswer.create({ content: content, isCorrect: isCorrect, quizId: existedQuiz });
    return res.status(200).json({ message: "Create successfully", data: answer });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });  
  }
});

//Learner: Get answers
router.get('/answer/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const answers = await panswer.find({quizId: quizId});   
    return res.status(200).json({ data: answers });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Get lesson
router.get('/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await pl.findById(lessonId);
    return res.status(200).json({ data: lesson });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Get all lessons status
router.get('/learner/:learnerId', async (req, res) => {
    try {
        const { learnerId } = req.params;
        const alllessons = await pl.find();
        const data = await Promise.all(alllessons.map(async lesson => {
        const activelesson = await learnerpl.findOne({learnerId: learnerId, plId: lesson._id});
        if (activelesson){
            lesson._doc.active = true;
            lesson._doc.progress = activelesson.progress;
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

//Learner: Get all video instruction
router.get('/video/:sound1Id/:sound2Id', async (req, res) => {
  try {
    const { sound1Id, sound2Id } = req.params;
    console.log(sound1Id, sound2Id)
    const sound1 = await sound.findById(sound1Id);
    const sound2 = await sound.findById(sound2Id);
    const data = {sound1: sound1, sound2: sound2};
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
      const isUnlocked = await learnerpl.exists({learnerId: learnerId, plId: lessonId});
      if (isUnlocked) 
        return res.status(200).json({ message: "Already unlocked!" });
      const unlockedlr = await learnerpl.create({learnerId: learnerId, plId: lessonId, status: 0});
      return res.status(200).json({ data: unlockedlr });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });  
  }
});

//Learner: Send result
router.get('/result/:lessonId', async (req, res) => {
  const { lessonId } = req.params;
  const { learnerId, sound1, accuracy1, sound2, accuracy2, pass } = req.body;
  try {
    console.log(1)
    const alearnerpl = await learnerpl.findOne({plId: lessonId, learnerId: learnerId});
    if (!alearnerpl)
      await learnerpl.create({lessonId: lessonId, learnerId: learnerId, progress: pass? 3: 2});
    const result1 = await learnersound.findOne({learnerId: learnerId, soundId: sound1})
    console.log(result1)
    await learnersound.findByIdAndUpdate( result1._id, { accuracy: accuracy1 });
    const result2 = await learnersound.findOne({learnerId: learnerId, soundId: sound2})
    console.log(result2)
    await learnersound.findByIdAndUpdate( result2._id, { accuracy: accuracy2 });
    console.log(point)
    res.status(200).json({ message: "Update result result successfully!" })
  } catch (error) {
      return res.status(500).json({ message: JSON.stringify(error) });
  }
});


export default router;