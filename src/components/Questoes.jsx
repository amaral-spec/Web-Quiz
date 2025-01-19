import React from "react";

function Question({ question, answers, selectedAnswer, onAnswerSelect }) {
  return (
    <div>
      <h2>{question}</h2>
      {answers.map((answer, i) => (
        <div key={i}>
          <input
            type="radio"
            name={`question`}
            id={`answer_${i}`}
            onChange={() => onAnswerSelect(i)}
            checked={selectedAnswer === i}
          />
          <label htmlFor={`answer_${i}`}>{answer.text}</label>
        </div>
      ))}
    </div>
  );
}

export default Question;
