const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/question_answer', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 app.use(express.static('public'))

const questionSchema = new mongoose.Schema({
   title: String,
  content: String,
   answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});

 const answerSchema = new mongoose.Schema({
   content: String
 });

const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);




 module.exports = { Question, Answer };

///INTEGRATION WITH BACKEND *************************************

///*************************************************************************************


///  API TESTING PART *********************************************************************************

// app.get('/api/questions', (req, res) => {
//   // Use Mongoose to query the database for questions
//   Question.find({}, (err, questions) => {
//       if (err) {
//           console.error('Error retrieving questions:', err);
//           return res.status(500).json({ error: 'An error occurred while retrieving questions.' });
//       }

//       // Respond with the retrieved questions as JSON
//       res.status(200).json(questions);
//   });
// });
app.post('/api/questions', async(req, res) => {
  
    try {
      const newQuestion = new Question({
        title: req.body.title,
        content: req.body.content,
      });

      
      const savedQuestion = await newQuestion.save();

    
      res.status(201).json(savedQuestion);
    } 
    catch (error) {
    
      res.status(500).json({ error: 'Could not create the question.' });
    }

  console.log('Received question:', question);
  });


  app.post('/api/answers', async (req, res) => {
    try {
      // Extract question ID from the request body
      const questionId = req.body.questionId;

      // Find the question by its ID
      const question = await Question.findById(questionId);

      if (!question) {
        return res.status(404).json({ error: 'Question not found.' });
      }

      // Create a new answer using data from the request body
      const newAnswer = new Answer({
        content: req.body.content,
      });

      // Associate the answer with the question
      question.answers.push(newAnswer);

      // Save the answer and the updated question
      await newAnswer.save();
      await question.save();

      // Return the newly created answer as a response
      res.status(201).json(newAnswer);
    } catch (error) {
      res.status(500).json({ error: 'Could not create the answer.' });
    }
  });


  app.delete('/api/questions/:questionId', (req, res) => {
    const questionId = req.params.questionId;

    // Use Mongoose to delete the question from the database
    Question.findByIdAndRemove(questionId, (err, deletedQuestion) => {
        if (err) {
            console.error('Error deleting question:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the question.' });
        }

        if (!deletedQuestion) {
            return res.status(404).json({ error: 'Question not found.' });
        }

        // Respond with a success message or the deleted question
        res.status(200).json({ message: 'Question deleted successfully' });
    });
});


///************************************************************************************ */

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
