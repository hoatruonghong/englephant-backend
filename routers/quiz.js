import express from "express";
//import models
import node from '../models/node.js';
import flashcard from '../models/flashcard.js';
import quiz from "../models/quiz.js";
import answer from "../models/answer.js";
import lesson from "../models/lesson.js";

const router = express.Router();

//Admin: Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await quiz.find();  
    return res.status(200).json({ data: quizzes });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Admin: Add a quiz
router.post('/add/', async (req, res) => {
  try {
      const { image, question, video, audio, node, flashcard } = req.body;
  
      const dbQuiz = new quiz({
        image: image,
        question: question,
        video: video,
        audio: audio,
        node: node,
        flashcard: flashcard
      });
      await dbQuiz.save();
      res.status(200).json({ message: "Create quiz successfully!" });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Admin: Edit a quiz
router.put('/edit/:quizId', async (req, res) => {
    try {
        const {quizId} = req.params;
        const { image, question, video, audio, node, flashcard } = req.body;
    
        await quiz.findByIdAndUpdate( quizId,{
          image: image,
          question: question,
          video: video,
          audio: audio,
          node: node,
          flashcard: flashcard
        });
        res.status(200).json({ message: "Update quiz successfully!" });
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
  });

//Admin: Delete a quiz
router.delete('/delete/:quizId', async (req, res) => {
    try {
        const {quizId} = req.params;
        await quiz.findByIdAndDelete( quizId );
        res.status(200).json({ message: "Delete quiz successfully!" });
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
  });

//Admin, Learner: Get all answers of a quiz
router.get('/answer/:quizId', async (req, res) => {
  try {
    const { quizId, numOptions } = req.params;
    const answers = await answer.find({quizId: quizId});  
    console.log(answers)
    res.status(200).json({ data: answers });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Admin: Add an answer to a quiz
router.post('/answer/add/:quizId', async (req, res) => {
  try {
      const { quizId } = req.params;
      const { content, audio, image, isCorrect } = req.body;
      const dbAnswer = new answer({
        content: content,
        audio: audio,
        image: image,
        isCorrect: isCorrect,
        quizId: quizId
      });
      await dbAnswer.save();
      res.status(200).json({ message: "Create answer successfully!" });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Admin: Edit an answer of a quiz
router.put('/answer/edit/:quizId/:answerId', async (req, res) => {
    try {
        const { quizId, answerId } = req.params;
        const { content, audio, image, isCorrect } = req.body;
        await answer.findByIdAndUpdate( answerId,{
            content: content,
            audio: audio,
            image: image,
            isCorrect: isCorrect,
            quizId: quizId
        });
        res.status(200).json({ message: "Update answer successfully!" });
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
  });

//Admin: Delete an answer of a quiz
router.delete('/answer/delete/:answerId', async (req, res) => {
    try {
        const { answerId } = req.params;
        await answer.findByIdAndDelete( answerId );
        res.status(200).json({ message: "Delete answer successfully!" });
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
  });

//Learner: Get quiz and flashcard of a node
router.get('/node/:mapId/:position', async (req, res) => {
  try {
    console.log(1)
    const { mapId, position } = req.params;
    const quizzesPerCard = 3;
    const numofquiz = 5;
    const anode = await node.findOne({mapId: mapId, position: position});
    let quizzes = [];
    if (position % 2 == 1){
      let lessons = [];
      const flashcards = await flashcard.find({nodeId: anode._id});
      for (let c in flashcards){
        let aflashcard = flashcards[c]._id;
        let newlesson = await lesson.findOne({node: anode._id, flashcard: aflashcard});
        lessons.push(newlesson);
        let count = await quiz.countDocuments({node: anode._id, flashcard: aflashcard});
        
        //Take a fix number of quizzes per flashcard 
        const arr = [...Array(count).keys()];
        let shuffled = [...arr].sort(() => 0.5 - Math.random());
        shuffled = shuffled.slice(0, quizzesPerCard);
        for (let i = 0; i < quizzesPerCard; i++){
          const newquiz = await quiz.findOne({node: anode._id, flashcard: aflashcard}).skip(shuffled[i]);
          quizzes.push(newquiz);
        }
      }
      console.log(2)
      return res.status(200).json({ nodeId: anode._id, lesson: lessons, quiz: quizzes, flashcard: flashcards});
    }
    else {
      const arr = [...Array(numofquiz).keys()];
        let shuffled = [...arr].sort(() => 0.5 - Math.random());
        for (let i = 0; i < numofquiz; i++){
          const newquiz = await quiz.findOne({node: anode._id}).skip(shuffled[i]);
          quizzes.push(newquiz);
        }
      return res.status(200).json({ nodeId: anode._id, quiz: quizzes});
    }
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

export default router;