import React from "react";

function Navigation({ onPrevious, onNext, isFirst, isLast, onSubmit }) {
  return (
    <div>
      <button onClick={onPrevious} disabled={isFirst}>
        Anterior
      </button>
      <button onClick={onNext} disabled={isLast}>
        Próxima
      </button>
      {isLast && <button onClick={onSubmit}>Enviar</button>}
    </div>
  );
}

export default Navigation;
