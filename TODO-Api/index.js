const express = require('express');
var cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
mongoose.connection.on('error', err => { console.log(err); });

var task;
var group;

const taskSchema = new mongoose.Schema({
  title: String,
  done: Boolean,
});

const groupSchema = new mongoose.Schema({
  title: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/Todo-DB');
  task = mongoose.model('Task', taskSchema);
  group = mongoose.model('Group', groupSchema);
}

main().catch(err => console.log(err));

//#region get
app.get('/', async function (req, res) {
  res.send('express is running');
});
// get all groups with their tasks
app.get('/todos', async function (req, res) {
  res.send(await group.find().populate('tasks'));
});
//#endregion get
//#region put
// create a new group
// body --> {title: string, id?: string}
app.put('/group', async (req, res) => {
  if (req.body && req.body.hasOwnProperty('title')) {
    if (req.body.hasOwnProperty('id') && req.body.id !== undefined && req.body.id !== '') {
      const existingGroup = await group.findOne({ '_id': req.body.id });
      if (!!existingGroup) {
        existingGroup.title = req.body.title;
        existingGroup.save();
        res.send(existingGroup);
      } else {
        res.status(404).send('Existing group could not be found');
      }
    } else {
      const newGroup = new group({ title: req.body.title, tasks: [] });
      newGroup.save();
      res.send(newGroup);
    }
  } else {
    res.status(400).send('Bad body');
  }
});
// create / update task in group
// body --> {groupId?: string, taskId?: string, done: boolean, text: string}
app.put('/task', async (req, res) => {
  if (req.body && req.body.hasOwnProperty('done') && req.body.hasOwnProperty('text')) {
    if (req.body.hasOwnProperty('groupId') && req.body && !req.body.hasOwnProperty('taskId')) {
      const existingGroup = await group.findOne({ '_id': req.body.groupId });
      if (!!existingGroup) {
        const newTask = new task({ title: req.body.text, done: req.body.done });
        newTask.save()
        existingGroup.tasks.push(newTask);
        existingGroup.save();
        res.send(newTask);
      } else {
        res.status(400).send('Could not find existing group');
      }
    } else if (req.body.hasOwnProperty('taskId') && !req.body.hasOwnProperty('groupId')) {
      const existingTask = await task.findOne({ '_id': req.body.taskId });
      if (!!existingTask) {
        existingTask.title = req.body.text;
        existingTask.done = req.body.done;
        existingTask.save();
        res.send(existingTask);
      } else {
        res.status(404).send('Could not find existing task');
      }
    } else {
      res.status(400).send('Body must contaion groupId or taskId');
    }
  } else {
    res.status(400).send('Bad body');
  }
});
//#endregion put
//#region delete
// delete task permanent by passing the id as queryParameter
app.delete('/removeTask', async (req, res) => {
  if (req.query?.id) {
    const existingTask = await task.findOne({ '_id': req.query.id });
    if (existingTask) {
      await task.deleteOne({ '_id': req.query.id });
      const existingGroup = await group.findOne({ tasks: `${req.query.id}` });
      if (existingGroup) {
        existingGroup.tasks.splice(existingGroup.tasks.findIndex(x => x.toString().includes(req.query.id), 1));
        await existingGroup.save();
      }
      res.status(200).send();
    } else {
      res.status(404).send('Task to delete could not be found');
    }
  } else {
    res.status(400).send('No id could be found in the query');
  }
});
// delete group permanent by passing the id as queryParameter
app.delete('/removeGroup', async (req, res) => {
  if (req.query?.id) {
    const existingGroup = await group.findOne({ '_id': req.query.id });
    if (existingGroup) {
      existingGroup.tasks.forEach(async (x) => {
        await task.deleteOne({ '_id': x._id });
      });
      await group.deleteOne({ '_id': req.query.id });
      res.status(200).send();
    } else {
      res.status(404).send('Group to delete could not be found');
    }
  } else {
    res.status(400).send('No id could be found in the query');
  }
});
//#endregion delete

const expressServer = app.listen(3000);

process.on('SIGTERM', () => {
  expressServer.close(() => { debug('HTTP server closed') });
});