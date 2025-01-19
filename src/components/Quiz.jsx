import React, { useState, useEffect } from "react";

function Quiz() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadXMLData = async () => {
      try {
        const response = await fetch("/xml/perguntas.xml");
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        const questions = xmlDoc.getElementsByTagName("question");

        const data = [];
        for (let i = 0; i < questions.length; i++) {
          const questionElement = questions[i];
          const questionText = questionElement.getElementsByTagName("text")[0].textContent;
          const answers = [];
          const answersNodes = questionElement.getElementsByTagName("answer");

          for (let j = 0; j < answersNodes.length; j++) {
            answers.push({
              text: answersNodes[j].textContent,
              correct: answersNodes[j].getAttribute("value") === "1",
            });
          }

          data.push({ question: questionText, answers });
        }
        setQuizData(data);
      } catch (error) {
        console.error("Erro ao carregar os dados XML:", error);
      }
    };

    loadXMLData();
  }, []);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      let userAnswer = updatedAnswers.find((a) => a.questionIndex === questionIndex);
      if (!userAnswer) {
        userAnswer = { questionIndex, selected: null, correct: false };
        updatedAnswers.push(userAnswer);
      }
      userAnswer.selected = answerIndex;
      userAnswer.correct = quizData[questionIndex].answers[answerIndex].correct;
      return updatedAnswers;
    });
  };

  const handleNavigate = (direction) => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + direction);
  };

  const handleSubmit = () => {
    const score = userAnswers.filter((answer) => answer.correct).length;
    const resultDetails = {
      score,
      total: quizData.length,
      details: userAnswers.map((answer) => ({
        question: quizData[answer.questionIndex].question,
        selectedAnswer: quizData[answer.questionIndex].answers[answer.selected].text,
        correct: answer.correct,
      })),
    };
    setResult(resultDetails);
  };

  if (result) {
    return (
      <div>
        <h3>Você acertou {result.score} de {result.total} perguntas!</h3>
        <h4>Detalhes das Respostas:</h4>
        <table>
          <thead>
            <tr>
              <th>Questão</th>
              <th>Resposta Selecionada</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {result.details.map((detail, index) => (
              <tr key={index}>
                <td>{detail.question}</td>
                <td>{detail.selectedAnswer}</td>
                <td>{detail.correct ? "Acertou" : "Errou"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (quizData.length === 0) {
    return <p>Carregando perguntas...</p>;
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div>
      <h2>{currentQuestion.question}</h2>
      {currentQuestion.answers.map((answer, i) => (
        <div key={i}>
          <input
            type="radio"
            name={`question${currentQuestionIndex}`}
            id={`answer${currentQuestionIndex}_${i}`}
            onChange={() => handleAnswerSelect(currentQuestionIndex, i)}
            checked={
              userAnswers.find(
                (a) => a.questionIndex === currentQuestionIndex && a.selected === i
              )
            }
          />
          <label htmlFor={`answer${currentQuestionIndex}_${i}`}>{answer.text}</label>
        </div>
      ))}
      <div>
        {}
        <button onClick={() => handleNavigate(-1)} disabled={currentQuestionIndex === 0}>
          Anterior
        </button>
  
        {}
        <button
          onClick={() => handleNavigate(1)}
          disabled={currentQuestionIndex === quizData.length - 1}
        >
          Próxima
        </button>
  
        {}
        {currentQuestionIndex === quizData.length - 1 && (
          <button onClick={handleSubmit}>Submeter Respostas</button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
