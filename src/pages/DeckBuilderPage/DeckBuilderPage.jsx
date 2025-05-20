import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import "./DeckBuilderPage.css";
import { api } from "../../api";
import { API_URL } from "../../constants";
import toast from "react-hot-toast";

const fractions = [
  "Order of the Shining Sun",
  "Conclave of Sorcerers",
  "Cult of Shadows",
  "Golden Syndicate",
  "Legion of Chaos",
  "Guardians of Nature",
];
 
export default function DeckBuilderPage() {
  const [decks, setDecks] = useState(() => {
    const saved = localStorage.getItem("deckBuilder_decks");
    let parsed = {};
    try { parsed = saved ? JSON.parse(saved) : {}; } catch { parsed = {}; }
    const result = {};
    fractions.forEach((f) => {
      result[f] = Array.isArray(parsed[f]) ? parsed[f] : [];
    });
    return result;
  });

  const [tab, setTab] = useState(() => {
    const savedTab = localStorage.getItem("deckBuilder_tab");
    return fractions.includes(savedTab) ? savedTab : fractions[0];
  });

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedDeckCard, setSelectedDeckCard] = useState(null);

  useEffect(() => {
    api.get("/api/user/card")
      .then((res) => setCards(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem("deckBuilder_decks", JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem("deckBuilder_tab", tab);
  }, [tab]);

  const currentDeck = decks[tab];
  const available = cards
    .filter((c) => c.fraction === tab)
    .filter((c) => !currentDeck.some((d) => d.id === c.id));

  const canSave =
    currentDeck.length >= 15 &&
    currentDeck.some((c) => c.isLeader === true);

  function handleAddToDeck(card) {
    setDecks((prev) => ({
      ...prev,
      [tab]: [...(prev[tab] || []), card],
    }));
    setSelectedCard(null);
  }

  function handleReturnToAvailable(card) {
    setDecks((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((c) => c.id !== card.id),
    }));
    setSelectedDeckCard(null);
  }

  function handleSaveDeck() {
    if (!canSave) {
      return toast.error(
        "Deck must contain at least 15 cards and at least one leader."
      );
    }

    const payload = {
      faction: tab,
      cards: decks[tab],
    };

    localStorage.setItem(
      "deckBuilder_activeDeck",
      JSON.stringify(payload)
    );

    const saved = JSON.parse(
      localStorage.getItem("deckBuilder_activeDeck")
    );

    toast.success(`Deck for "${tab}" saved as active!`);
  }


  return (
    <div className="deck-builder">
      <Header />

      <header className="deck-header">
        <h1>Deck Builder</h1>
        <p>Click a card to add it to your deck or return it.</p>
      </header>

      <div className="deck-switcher-inline">
        {fractions.map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="deck-controls-inline">
        <button
          className="save-deck-button"
          onClick={handleSaveDeck}
          disabled={!canSave}
        >
          Save Deck
        </button>
      </div>

      <main className="deck-content">
        <section className="deck-list">
          <h2>Your Deck: {tab}</h2>
          <div className="card-grid">
            {currentDeck.map((card) => (
              <div key={card.id} className="card-wrapper">
                <img
                  src={`${API_URL}${card.imageUrl}`}
                  alt={card.name}
                  className="card-image-static"
                  onClick={() => setSelectedDeckCard(card)}
                />
                {selectedDeckCard?.id === card.id && (
                  <div className="card-action-popup">
                    <button onClick={() => handleReturnToAvailable(card)}>
                      Return
                    </button>
                    <button onClick={() => setSelectedDeckCard(null)}>
                      Cancel
                    </button>
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
                  src={`${API_URL}${card.imageUrl}`}
                  alt={card.name}
                  className="card-image-static"
                  onClick={() => setSelectedCard(card)}
                />
                {selectedCard?.id === card.id && (
                  <div className="card-action-popup">
                    <button onClick={() => handleAddToDeck(card)}>
                      Add to Deck
                    </button>
                    <button onClick={() => setSelectedCard(null)}>
                      Cancel
                    </button>
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
