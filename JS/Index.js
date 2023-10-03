// Index.js
const askForm = document.getElementById('ask-form');
const questionInput = document.getElementById('question');
const main = document.querySelector('main');

askForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const questionText = questionInput.value.trim();
    if (questionText) {
        addQuestionSection(questionText);
        questionInput.value = '';
    }
});

function addQuestionSection(questionText) {
    const questionSection = document.createElement('section');
    questionSection.className = 'question-section';

    const questionHeader = document.createElement('div');
    questionHeader.className = 'question-header';

    const questionTextElement = document.createElement('div');
    questionTextElement.textContent = `Question: ${questionText}`;

    const editButton = createEditButton();
    const deleteButton = createDeleteButton();

    questionHeader.appendChild(questionTextElement);
    questionHeader.appendChild(editButton);
    questionHeader.appendChild(deleteButton);

    questionSection.appendChild(questionHeader);

    main.appendChild(questionSection);

    // Event listener for delete button
    deleteButton.addEventListener('click', () => {
        main.removeChild(questionSection);
    });

    // Event listener for edit button
    editButton.addEventListener('click', () => {
        const editedQuestion = prompt('Edit your question:', questionText);
        if (editedQuestion !== null) {
            questionTextElement.textContent = `Question: ${editedQuestion}`;
        }
    });

    addAnswerSection(questionSection);
}

function addAnswerSection(questionSection) {
    const answerForm = document.createElement('form');
    answerForm.className = 'answer-form';

    const answerInput = document.createElement('textarea');
    answerInput.className = 'answer-input';
    answerInput.placeholder = 'Write your answer';

    const submitAnswerButton = document.createElement('button');
    submitAnswerButton.type = 'submit';
    submitAnswerButton.textContent = 'Submit Answer';

    answerForm.appendChild(answerInput);
    answerForm.appendChild(submitAnswerButton);

    questionSection.appendChild(answerForm);

    const answersList = document.createElement('ul');
    answersList.className = 'answers-list';

    questionSection.appendChild(answersList);

    answerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const answerText = answerInput.value.trim();
        if (answerText) {
            addAnswerToList(answerText, answersList);
            answerInput.value = '';
        }
    });
}

function addAnswerToList(answerText, answersList) {
    const answerListItem = document.createElement('li');
    answerListItem.className = 'answer-item';
    answerListItem.textContent = `Answer: ${answerText}`;

    const editButton = createEditButton();
    const deleteButton = createDeleteButton();

    answerListItem.appendChild(editButton);
    answerListItem.appendChild(deleteButton);

    answersList.appendChild(answerListItem);

    // Event listener for delete button
    deleteButton.addEventListener('click', () => {
        answersList.removeChild(answerListItem);
    });

    // Event listener for edit button
    editButton.addEventListener('click', () => {
        const editedAnswer = prompt('Edit your answer:', answerText);
        if (editedAnswer !== null) {
            answerListItem.textContent = `Answer: ${editedAnswer}`;
        }
    });

    addVoteSection(answerListItem);
}

function createEditButton() {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    return editButton;
}

function createDeleteButton() {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    return deleteButton;
}

function addVoteSection(answerListItem) {
    const upvoteButton = document.createElement('button');
    upvoteButton.textContent = 'Upvote';
    upvoteButton.className = 'vote-button upvote';

    const downvoteButton = document.createElement('button');
    downvoteButton.textContent = 'Downvote';
    downvoteButton.className = 'vote-button downvote';

    const upvoteCounter = document.createElement('span');
    upvoteCounter.textContent = '0';
    upvoteCounter.className = 'vote-counter';

    const downvoteCounter = document.createElement('span');
    downvoteCounter.textContent = '0';
    downvoteCounter.className = 'vote-counter';

    answerListItem.appendChild(upvoteButton);
    answerListItem.appendChild(upvoteCounter);
    answerListItem.appendChild(downvoteButton);
    answerListItem.appendChild(downvoteCounter);

    // Event listeners for upvote and downvote buttons
    upvoteButton.addEventListener('click', () => {
        const currentUpvotes = parseInt(upvoteCounter.textContent);
        upvoteCounter.textContent = currentUpvotes + 1;
    });

    downvoteButton.addEventListener('click', () => {
        const currentDownvotes = parseInt(downvoteCounter.textContent);
        downvoteCounter.textContent = currentDownvotes + 1;
    });
}

