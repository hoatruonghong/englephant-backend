import express from "express"
const flashcardRouter = express.Router();

import learnermap from "../models/learnermap.js";
import flashcard from "../models/flashcard.js";
import learnercard from "../models/learnercard.js";
import node from "../models/node.js";

/**
 * @route GET /api/card/learner/:learnerId
 * @description Learner: Get all having flashcards
 * @access public
 */
flashcardRouter.get('/learner/:learnerId', async (req, res) => {
    try {
      const { learnerId } = req.params;
      const flashcards = await learnercard.find({learnerId: learnerId}).count()
      return res.status(200).json({ data: flashcards });
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
});

/**
 * @route GET /api/card/node/:nodeId
 * @description Learner: Get all having flashcards of a node
 * @access public
 */
flashcardRouter.get('/node/:nodeId/:learnerId', async (req, res) => {
  try {
    const { nodeId, learnerId } = req.params;
    const flashcards = await learnercard.find({learnerId: learnerId, nodeId: nodeId})
    const ret = flashcards.map((i)=>i.cardId)
    return res.status(200).json({ data: ret });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

/**
 * @route GET /api/card/:cardId
 * @description Learner: Get flashcard information
 * @access public
 */
flashcardRouter.get('/:cardId', async (req, res) => {
    try {
      const { cardId } = req.params;
      const aflashcard = await flashcard.findById(cardId);
      return res.status(200).json({ data: aflashcard });
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
});

/**
 * @route POST /api/card/learner/:learnerid
 * @description Learner: Save gets flashcard relationship
 * @access public
 */
flashcardRouter.post('/learner/:learnerid', async (req, res) => {
    try {
        const { learnerid } = req.params;
        const { cards, nodeId } = req.body;
        const cur_node = await node.findById(nodeId);
        for (let i in cards){
            let dbLearnerCard = new learnercard({
                learnerId: learnerid,
                cardId: cards[i],
                nodeId: nodeId,
                map: cur_node.mapId
            })
            await dbLearnerCard.save();
        }
        res.status(200).json({ message: "Add flashcard successfully!" });
    } catch (err) {
        return res.status(500).json({ message: JSON.stringify(err) });  
    }
});

/**
 * @route PUT /api/learner/:id
 * @description Update flashcard status
 * @access public
 */
flashcardRouter.put('/learner/:learnerid', async (req, res) => {
    try {
        const { cardId } = req.params;
        const { learnerId, status } = req.body;
        await learnercard.findOneAndUpdate( {
          cardId: cardId,
          learnerId: learnerId
        },{
          status: status
        });
        res.status(200).json({ message: "Update card successfully!" });
    } catch (err) {
      return res.status(500).json({ message: JSON.stringify(err) });
    }
});

/**
 * @route GET /api/card/learner/:learnerId
 * @description Learner: Get all having flashcards
 * @access public
 */
flashcardRouter.delete('/delete/:learnerId', async (req, res) => {
  try {
    const { learnerId } = req.params;
    await learnercard.deleteMany({learnerId: learnerId})
    return res.status(200).json({ message: "Delete all!" });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

/**
 * @route GET /api/card/archive/:learnerId
 * @description Learner: Get all having flashcards for Archive screen
 * @access public
 */
flashcardRouter.get('/archive/:learnerId', async (req, res) => {
  try {
    const { learnerId } = req.params;
    const activemaps = await learnermap.find({learnerId: learnerId});
    const data = await Promise.all(activemaps.map(async map => {
      const flashcards = await learnercard.find({learnerId: learnerId, mapId: map.mapId});
      await Promise.all(flashcards.map(async card =>{
        const cardimg = await flashcard.findById(card.cardId);
        card._doc.img = cardimg.image;
      }))
      return {mapId: map.mapId, map: map.name, flashcards: flashcards};
    }));
    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

export default flashcardRouter
