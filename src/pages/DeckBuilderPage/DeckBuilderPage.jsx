import React, { useState } from "react";
import "./DeckBuilderPage.css";

const initialCards = [
    { id: "sun", src: "/sprites/cards/sun_paladin.png" },
    { id: "sun1", src: "/sprites/cards/sun_paladin.png" },
    { id: "sun2", src: "/sprites/cards/sun_paladin.png" },
    { id: "sun3", src: "/sprites/cards/sun_paladin.png" },
    { id: "sun4", src: "/sprites/cards/sun_paladin.png" },
    { id: "sun5", src: "/sprites/cards/sun_paladin.png" },
    { id: "sun6", src: "/sprites/cards/sun_paladin.png" },
];

export default function DeckBuilderPage() {
    const [available, setAvailable] = useState(initialCards);
    const [deck, setDeck] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedDeckCard, setSelectedDeckCard] = useState(null);
  
    function handleAddToDeck(card) {
      setDeck((prev) => [...prev, card]);
      setAvailable((prev) => prev.filter((c) => c.id !== card.id));
      setSelectedCard(null);
    }
  
    function handleReturnToAvailable(card) {
      setAvailable((prev) => [...prev, card]);
      setDeck((prev) => prev.filter((c) => c.id !== card.id));
      setSelectedDeckCard(null);
    }
  
    return (
      <div className="deck-builder">
        <header className="deck-header">
          <h1>Deck Builder</h1>
          <p>Click a card to add it to your deck or return it.</p>
        </header>
  
        <main className="deck-content">
          <section className="deck-list">
            <h2>Your Deck</h2>
            <div className="card-grid">
              {deck.map((card) => (
                <div key={card.id} className="card-wrapper">
                  <img
                    src={card.src}
                    alt={card.id}
                    className="card-image-static"
                    onClick={() => setSelectedDeckCard(card)}
                  />
                  {selectedDeckCard?.id === card.id && (
                    <div className="card-action-popup">
                      <button onClick={() => handleReturnToAvailable(card)}>Return</button>
                      <button onClick={() => setSelectedDeckCard(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
  
          <section className="card-pool">
            <h2>Available Cards</h2>
            <div className="card-grid">
              {available.map((card) => (
                <div key={card.id} className="card-wrapper">
                  <img
                    src={card.src}
                    alt={card.id}
                    className="card-image-static"
                    onClick={() => setSelectedCard(card)}
                  />
                  {selectedCard?.id === card.id && (
                    <div className="card-action-popup">
                      <button onClick={() => handleAddToDeck(card)}>Add to Deck</button>
                      <button onClick={() => setSelectedCard(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }
  