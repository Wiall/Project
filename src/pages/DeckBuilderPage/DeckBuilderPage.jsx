import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import "./DeckBuilderPage.css";
import { api } from "../../api";

export default function DeckBuilderPage() {
  const [available, setAvailable] = useState([]);
  const [faction, setFaction] = useState("all");
  const [decks, setDecks] = useState([[], [], [], [], []]);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedDeckCard, setSelectedDeckCard] = useState(null);

  const filteredAvailable =
    faction === "all"
      ? available
      : available.filter((card) => card.faction === faction);

  const currentDeck = decks[currentDeckIndex];

  function handleAddToDeck(card) {
    const newDecks = [...decks];
    newDecks[currentDeckIndex] = [...newDecks[currentDeckIndex], card];
    setDecks(newDecks);
    setAvailable((prev) => prev.filter((c) => c.id !== card.id));
    setSelectedCard(null);
  }

  function handleReturnToAvailable(card) {
    const newDecks = [...decks];
    newDecks[currentDeckIndex] = newDecks[currentDeckIndex].filter(
      (c) => c.id !== card.id
    );
    setDecks(newDecks);
    setAvailable((prev) => [...prev, card]);
    setSelectedDeckCard(null);
  }

  function saveDecksToStorage() {
    localStorage.setItem("deckBuilder_decks", JSON.stringify(decks));
    localStorage.setItem("deckBuilder_currentIndex", currentDeckIndex);
    alert("Deck saved!");
  }

  function loadDecksFromStorage() {
    const savedDecks = localStorage.getItem("deckBuilder_decks");
    const savedIndex = localStorage.getItem("deckBuilder_currentIndex");
    if (savedDecks) setDecks(JSON.parse(savedDecks));
    if (savedIndex) setCurrentDeckIndex(Number(savedIndex));
  }

  useEffect(() => {
    const loadCards = async () => {
      try {
        const res = await api.get("/user/card");
        if (res.status === 200) {
          setAvailable(res.data);
        }
      } catch (error) {
        console.error("Error loading cards:", error);
      }
    };
    loadCards();
    loadDecksFromStorage();
  }, []);

 return (
    <div className="deck-builder">
      <Header />
      <header className="deck-header">
        <h1>Deck Builder</h1>
        <p>Click a card to add it to your deck or return it.</p>
      </header>

      <main className="deck-content">
        <section className="deck-list">
          <h2>Your Deck</h2>
          <div className="deck-controls-inline">
            <div className="deck-switcher-inline">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  className={currentDeckIndex === i ? "active" : ""}
                  onClick={() => setCurrentDeckIndex(i)}
                >
                  Deck {i + 1}
                </button>
              ))}
            </div>
            <button className="save-button" onClick={saveDecksToStorage}>
              💾 Save Deck
            </button>
          </div>
          <div className="card-grid">
            {currentDeck?.map((card) => (
              <div key={card.id} className="card-wrapper">
                <img
                  src={`http://localhost:3000${card.imageUrl}`}
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
          <div className="faction-filter">
            <label>
              Faction:
              <select value={faction} onChange={(e) => setFaction(e.target.value)}>
                <option value="Order of the Shining Sun">Order of the Shining Sun</option>
                <option value="Conclave of Sorcerers">Conclave of Sorcerers</option>
                <option value="Guardians of Nature">Guardians of Nature</option>
                <option value="Cult of Shadows">Cult of Shadows</option>
                <option value="Legion of Chaos">Legion of Chaos</option>
                <option value="Golden Syndicate">Golden Syndicate</option>
              </select>
            </label>
          </div>
          <div className="card-grid">
            {filteredAvailable?.map((card) => (
              <div key={card.id} className="card-wrapper">
                <img
                  src={`http://localhost:3000${card.imageUrl}`}
                  width={200}
                  height={200}
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
