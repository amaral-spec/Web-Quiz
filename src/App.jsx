import { useState } from 'react';
import './App.css';
import Quiz from "./components/Quiz";

function App() {
  const [count, setCount] = useState(0);

  const navigate = (direction) => {
    console.log('Navegar:', direction);
  };

  const submitQuiz = () => {
    console.log('Submeter quiz');
  };

  return (
    <>
      <header>
        <h1>Quiz sobre HTML e CSS</h1>
      </header>

      <main>
        <Quiz />
        {}
        <div id="question-container"></div>
        <button onClick={() => navigate(-1)}>Anterior</button>
        <button onClick={() => navigate(1)}>Próxima</button>
        <button onClick={submitQuiz}>Submeter Respostas</button>
      </main>

      <div id="result-container"></div>

      <footer>
        <p>Web - Prof Bianca</p>
      </footer>
    </>
  );
}

export default App;
