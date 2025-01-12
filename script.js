let quizData = [];
let currentQuestionIndex = 0;
let userAnswers = []; 

function loadXMLData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "perguntas.xml", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
            const questions = xmlDoc.getElementsByTagName("question");

            for (let i = 0; i < questions.length; i++) {
                const questionElement = questions[i];
                const questionText = questionElement.getElementsByTagName("text")[0].textContent;
                const answers = [];
                const answersNodes = questionElement.getElementsByTagName("answer");

                for (let j = 0; j < answersNodes.length; j++) {
                    answers.push({
                        text: answersNodes[j].textContent,
                        correct: answersNodes[j].getAttribute("value") === "1"
                    });
                }

                quizData.push({
                    question: questionText,
                    answers: answers
                });
            }
            showQuestion(currentQuestionIndex);  
        }
    };
    xhr.send();
}

function showQuestion(index) {
    const question = quizData[index];
    const questionContainer = document.getElementById("question-container");

    const questionHTML = `
        <h2>${question.question}</h2>
        ${question.answers.map((answer, i) => `
            <div>
                <input type="radio" name="question${index}" id="answer${index}_${i}" value="${answer.correct}" ${getCheckedAnswer(index, i)} onclick="saveAnswer(${index}, ${i})"/>
                <label for="answer${index}_${i}">${answer.text}</label>
            </div>
        `).join('')}
    `;

    questionContainer.innerHTML = questionHTML;

    document.getElementById("prev").disabled = index === 0;
    document.getElementById("next").disabled = index === quizData.length - 1;
}

function getCheckedAnswer(questionIndex, answerIndex) {
    const userAnswer = userAnswers.find(answer => answer.questionIndex === questionIndex);
    if (userAnswer && userAnswer.selected === answerIndex) {
        return "checked"; 
    }
    return "";
}

function saveAnswer(questionIndex, answerIndex) {
    let userAnswer = userAnswers.find(answer => answer.questionIndex === questionIndex);
    if (!userAnswer) {
        userAnswer = { questionIndex: questionIndex, selected: null, correct: false };
        userAnswers.push(userAnswer);
    }

    userAnswer.selected = answerIndex;  
    const correctAnswer = quizData[questionIndex].answers[answerIndex].correct;
    userAnswer.correct = correctAnswer; 
}

function navigate(direction) {
    currentQuestionIndex += direction;
    showQuestion(currentQuestionIndex);
}

function submitQuiz() {
  let score = 0;

  userAnswers.forEach((answer) => {
      const question = quizData[answer.questionIndex];
      if (answer.correct) score++; 
  });

  let resultHTML = `<h3>Você acertou ${score} de ${quizData.length} perguntas!</h3>`;

  resultHTML += "<h4>Detalhes das Respostas:</h4>";
  resultHTML += "<table><thead><tr><th>Questão</th><th>Resposta Selecionada</th><th>Status</th></tr></thead><tbody>";

  userAnswers.forEach((answer) => {
      const question = quizData[answer.questionIndex];
      resultHTML += `
          <tr>
              <td>${question.question}</td>
              <td>${question.answers[answer.selected].text}</td>
              <td>${answer.correct ? 'Acertou' : 'Errou'}</td>
          </tr>
      `;
  });

  resultHTML += "</tbody></table>";

  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = resultHTML;
  resultContainer.style.display = "block";
}

loadXMLData();