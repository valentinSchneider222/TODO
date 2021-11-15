const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const dbUri = 'mongodb://localhost:27017';

const dbClient = new MongoClient(dbUri);

dbClient.connect();

//#region get
app.get('/', async function (req, res) {
  // res.send(uuidv4());
  try {
    await dbClient.db('Todo-DB').command({ ping: 1 });
    res.send('good soup');
  } catch {
    res.send('bad soup');
  }
});
// get all groups with their tasks
app.get('/todos', async function (req, res) {
  const db = await dbClient.db('Todo-DB');
  db.collection('groups')
    .find({})
    // .aggregate({
    //   $lookup: {
    //     from: 'tasks',
    //     localField: 'tasks',
    //     foreignField: '_id',
    //     as: 'someTodoStuff'
    //   }
    // })
    .toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
    });
});
//#endregion get
//#region put
// create a new group
// body --> {title: string}
app.put('/group', (req, res) => {

});
// create / update task in group
// body --> {groupId: string; done: boolean; text: string;}
app.put('/task', (req, res) => {

});

//#endregion put
//#region delete
// delete task permanent by passing the id as queryParameter
app.delete('/removeTask', (req, res) => {
  const idToRemove = req.query.id;
  res.send(idToRemove);
});
// delete group permanent by passing the id as queryParameter
app.delete('/removeGroup', (req, res) => {
  const idToRemove = req.query.id;
  res.send(idToRemove);
});
//#endregion delete

const expressServer = app.listen(3000);

process.on('SIGTERM', () => {
  dbClient.close();
  expressServer.close(() => { debug('HTTP server closed') });
});