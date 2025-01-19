import React from "react";

function Result({ score, total, details }) {
  return (
    <div>
      <h3>Você acertou {score} de {total} perguntas!</h3>
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
          {details.map((detail, index) => (
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

export default Result;
