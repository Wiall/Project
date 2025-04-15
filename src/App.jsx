import React from "react";
import GameBoard from "./components/GameBoard";
import "./styles/styles.css";

function App() {
  return (
    <div className="app">
      <header className="header">Echoes of Darkness</header>
      <GameBoard />
      <footer className="footer">© 2025 EchoWisp Studio</footer>
    </div>
  );
}

export default App;
