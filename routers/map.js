import express from "express";
//import models
import map from '../models/map.js';
import learner from "../models/learner.js";
import learnermap from '../models/learnermap.js';
import learnernode from '../models/learnernode.js';
import learnercard from '../models/learnercard.js';
import node from '../models/node.js';
import flashcard from '../models/flashcard.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const maps = await map.find();  
    return res.status(200).json({ data: maps });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});


router.post('/add/', async (req, res) => {
  try {
      const { _id, name, mode, price, image } = req.body;
  
      const dbMap = new map({
        _id: _id, 
        name: name, 
        mode: mode, 
        price: price, 
        image:image
      })
  
      await dbMap.save();
      res.status(200).json({ message: "Create map successfully!" })
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Show Map Selecting screen
router.get('/learner/:learnerId/:mode', async (req, res) => {
  try {
    const { learnerId, mode } = req.params;
    const maps = await map.find();
    const data = await Promise.all(maps.map(async map => {
      const activemap = await learnermap.findOne({learnerId: learnerId, mapId: map._id});
      if (activemap){
        map._doc.active = true;
        map._doc.status = activemap.status;
      } else {
        map._doc.active = false;
        map._doc.status = 0;
      }
      return map;
    }));
    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Show chosen Map
router.get('/learn/:learnerId/:mapId', async (req, res) => {
  try {
    const { learnerId, mapId } = req.params;
    const nodes = await node.find({mapId: mapId});
    const data = await Promise.all(nodes.map(async node => {
      const activenode = await learnernode.findOne({learnerId: learnerId, nodeId: node._id});
      if (activenode){
        node._doc.active = true;
        node._doc.point = activenode.point;
      } else {
        node._doc.active = false;
        node._doc.status = 0;
      }
      return node;
    }));
    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Unlock Map
router.post('/unlock/:learnerId/:mapId', async (req, res) => {
  const {learnerId, mapId} = req.params;
  try {
    const amap = await map.findById(mapId);
    const isUnlocked = await learnermap.exists({learnerId: learnerId, mapId: mapId});
    if (isUnlocked) 
      return res.status(200).json({ message: "Already unlocked!" });
    const unlockedmap = await learnermap.create({learnerId: learnerId, mapId: mapId, status: 0, name: amap.name});
    const node1st = await node.find({mapId: mapId, position: 1});
    const unlockednode = await learnernode.create({learnerId: learnerId, nodeId: node1st._id});
    console.log(unlockedmap, unlockednode)
    return res.status(200).json({ message: "Unlock successfully!" });
  } catch (err) {
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Get unlock Map conditions
router.get('/lock/:learnerId/:mapId', async (req, res) => {
  const {learnerId, mapId} = req.params;
  try {
      const lockedmap = await map.findById(mapId);
      const previousmap = await learnermap.findOne({learnerId: learnerId, mapId: lockedmap.previousmap});
      let isFree = true;
      let condition = "";
      if (previousmap.status<=1)
        condition = 'Hoàn thành map '+previousmap.name+' từ 2* trở lên để mở khoá';
      else {
        if (lockedmap.price>0){
          isFree = lockedmap.price;
          condition = 'Dùng '+lockedmap.price+' đậu để mở khoá';
        }
        else return res.status(200).json({ action: "Mở map" });
      }
      return res.status(200).json({ isFree: isFree, condition: condition });
  } catch (error) {
      return res.status(500).json({ message: JSON.stringify(error) });
  }
});

//Admin: Show Map information
router.get('/:mode/topic/:name', async (req, res) => {
  try {
    const { mode, name } = req.params;
    const map0 = await map.findOne({ mode: mode, name: name });
    const nodes = await node.find({ mapId: map0._id });
    const data = await Promise.all(nodes.map(async node => {
      const flashcards = await flashcard.find({ nodeId: node._id });
      node._doc.flashcards = [];
      for (card in flashcards){
        node._doc.flashcards.push(card._id)
      }
      return node;
    }));
    return res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Admin: Show Node information
router.get('/node/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const node0 = await node.findById(nodeId);
    if(node0){
      return res.status(200).json({ data: data });
    } else {
      return res.status(500).json({ message: "Cannot find node with given id" });
    }
  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Admin: Update Node in chosen Map
router.put('/update-node/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { position, type } = req.body;

    // Save Node
    await node.findByIdAndUpdate(nodeId, { position: position, type: type });

    res.status(200).json({ message: "Update node successfully!" })
  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Admin: Update Flashcard in a Node
router.put('/update-card/:flcId', async (req, res) => {
  try {
    const { flcId } = req.params;
    const { nodeId } = req.body;

    // Save Flashcard
    await flashcard.findByIdAndUpdate(flcId, { nodeId: nodeId });

    res.status(200).json({ message: "Update flashcard successfully!" })
  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Admin: Delete Map
router.delete('/delete-map/:mode/topic/:name', async (req, res) => {
  try {
    const { mode, name } = req.params;
    const map0 = await map.findOne({ mode: mode, name: name });
    const nodes = await node.find({ mapId: map0._id });
    await Promise.all(nodes.map(async node => {
      await flashcard.updateMany({ nodeId: node._id }, {nodeId: None});
    }));
    await node.deleteMany({ mapId: map0._id });
    await map.findByIdAndRemove(map0._id);
    res.status(200).json({ message: "Delete map successfully!" })

  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Update Node Point
router.put('/node-result/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { learnerId, point, totalnumofquiz, time } = req.body;
    const node_result = await learnernode.findOne({nodeId: nodeId, learnerId: learnerId});
    if (point>= node_result.point)
      await learnernode.findByIdAndUpdate( node_result._id, { point: point, totalnumofquiz: totalnumofquiz, time: time });
    res.status(200).json({ message: "Update Node result successfully!" })
  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Unlock new Node
router.post('/node/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const {learnerId} = req.body;
    const cur_node = await node.findById(nodeId);
    if(cur_node.next){
      const next_node = await learnernode.findOne({nodeId : cur_node.next});
      if (!next_node){
        const dbLearnerNode = new learnernode({
          learnerId: learnerId,
          nodeId: cur_node.next
        })
        await dbLearnerNode.save();
      }
      return res.status(200).json({ message: "Unlock new Node successfully!", nodeId: cur_node.next });
    } else {
      return res.status(500).json({ message: "Cannot find node with given id" });
    }
  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
});

//Learner: Check Node State
router.get('/check-node/:mapId/:learnerId', async (req, res) => {
  try {
    const {mapId, learnerId} = req.params;
    const nodes = await node.find({mapId: mapId});
    let stateRet = [];
    let starRet = [];
    for (let i in nodes){
      let nodestate = await learnernode.findOne({learnerId: learnerId, nodeId: nodes[i]._id});
      stateRet.push(nodestate? "Unlock" : "Lock");
      let result = nodestate.totalnumofquiz>0? nodestate.point/nodestate.totalnumofquiz: 0;
      starRet.push(result>=0.6? result>=0.8? result==1? 3 : 2 : 1 : 0);
      if (i>=1 && stateRet[i-1] == "Unlock" && stateRet[i] == "Lock") stateRet[i]="Next";
    }
    return res.status(200).json({ state: stateRet, star: starRet });
  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
})

//Learner: Get Summary of Map
router.get('/sum/:mapId/:learnerId', async (req,res) => {
  try {
    const {mapId, learnerId} = req.params;
    const nodes = await node.find({mapId: mapId});
    let length = nodes.length;
    let learnernoderesults = [];
    let sumpoint = 0;
    let sumtotalnumofquiz = 0;
    let totalgotcards = 0;
    let totalcards = 0;
    let totaltime = 0;
    let totaltimecontent = "";

    //Get results of all nodes in map
    for (let i = 0; i < length; i++){
      let newLearnerNode = await learnernode.findOne({nodeId: nodes[i]._id, learnerId: learnerId});
      console.log(newLearnerNode.time);
      totaltime = totaltime + newLearnerNode.time;
      learnernoderesults.push({point: newLearnerNode.point, totalnumofquiz: newLearnerNode.totalnumofquiz});
      if (i%2==0){
        let countcards = await flashcard.countDocuments({nodeId: nodes[i]._id});
        let countgotcards = await learnercard.countDocuments({nodeId: nodes[i]._id, learnerId: learnerId});
        totalgotcards = totalgotcards + countgotcards;
        totalcards = totalcards + countcards
      }
      sumpoint = sumpoint + newLearnerNode.point;
      sumtotalnumofquiz = sumtotalnumofquiz + newLearnerNode.totalnumofquiz;
    }
    learnernoderesults.push({point: sumpoint, totalnumofquiz: sumtotalnumofquiz});

    //check if map has been unlocked already
    const isUnlocked = await learnermap.exists({learnerId: learnerId, mapId: mapId});
    if (!isUnlocked) {
      const unlockedmap = await learnermap.create({learnerId: learnerId, mapId: mapId, status: 0});
      const node1st = await node.find({mapId: mapId, position: 1});
      const unlockednode = await learnernode.create({learnerId: learnerId, nodeId: node1st._id});
      await learner.findByIdAndUpdate(learnerId, {currentMap: mapId})
    }

    //update status for map
    let numofstars = (sumpoint/sumtotalnumofquiz >= 0.8)? ((totalgotcards == totalcards)? 3: 2) :1;
    //timer
    let minutes = Math.floor(totaltime / 60);
    let seconds = totaltime % 60;

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    totaltimecontent=minutes + ':' + seconds;
    
    console.log(totaltimecontent)
    await learnermap.findOneAndUpdate({mapId: mapId}, { status: numofstars });
    return res.status(200).json({ result: learnernoderesults, flashcard: {got: totalgotcards, total: totalcards}, time: totaltimecontent });
  } catch (err) {
    res.status(500).json({ message: JSON.stringify(err) });
  }
})

export default router;