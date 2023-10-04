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

// app.use(express.static('public'))

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
// app.post('/submit-question', async (req, res) => {
  
//   // Retrieve the submitted question from the request body
//   const submittedQuestion = req.body.question;

//   try {
//     // Create a new Question document
//     const questionDocument = new Question({
//       content: submittedQuestion,
//     });

//     // Save the question to the database
//     await questionDocument.save();

//     // Send a response to indicate success
//     res.send('Question submitted successfully and saved to the database!');
//   } catch (error) {
//     console.error('Error saving question to the database:', error);
//     res.status(500).send('An error occurred while saving the question.');
//   }
// });





app.post('/api/questions', async(req, res) => {
 
  try {
    const newQuestion = new Question({
      title: req.body.title,
      content: req.body.content,
    });

    
    const savedQuestion = await newQuestion.save();

   
    res.status(201).json(savedQuestion);
  } catch (error) {
  
    res.status(500).json({ error: 'Could not create the question.' });
  }
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





const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
