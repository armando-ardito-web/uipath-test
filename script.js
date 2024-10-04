const questions = []; // This will be filled by fetching the JSON file
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;

// Fetch questions from the JSON file
fetch('uipath_qa_extracted_fixed.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        questions.push(...data.sort(() => 0.5 - Math.random()).slice(0, 30));
        totalQuestions = questions.length;
        displayQuestion();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const resultContainer = document.getElementById('result-container');

    // Clear previous options
    optionsContainer.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.domanda}`;

        currentQuestion.risposte_possibili.forEach((answer, index) => {
            const li = document.createElement('li');
            const input = document.createElement('input');
            input.type = currentQuestion.risposta_corretta.length > 1 ? 'checkbox' : 'radio';
            input.name = 'option';
            input.value = index;
            input.id = `option${index}`;

            const label = document.createElement('label');
            label.htmlFor = `option${index}`;
            label.textContent = answer;

            li.appendChild(input);
            li.appendChild(label);
            optionsContainer.appendChild(li);
        });

        nextButton.style.display = 'block';
        resultContainer.style.display = 'none';
    } else {
        // Show result after all questions are answered
        questionContainer.style.display = 'none';
        optionsContainer.style.display = 'none';
        nextButton.style.display = 'none';
        resultContainer.style.display = 'block';
        const percentage = (correctAnswers / totalQuestions) * 100;
        resultContainer.innerHTML = `<h2>Quiz Finished!</h2>
            <p>Correct Answers: ${correctAnswers}</p>
            <p>Incorrect Answers: ${totalQuestions - correctAnswers}</p>
            <p>Score: ${percentage.toFixed(2)}%</p>`;
    }
}

function nextQuestion() {
    const selectedOptions = document.querySelectorAll('input[name="option"]:checked');
    const selectedValues = Array.from(selectedOptions).map(option => parseInt(option.value));
    const correctValues = questions[currentQuestionIndex].risposta_corretta.map(val => val.charCodeAt(0) - 65);

    if (arraysEqual(selectedValues, correctValues)) {
        correctAnswers++;
    }

    currentQuestionIndex++;
    displayQuestion();
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    arr1.sort();
    arr2.sort();
    return arr1.every((val, index) => val === arr2[index]);
}