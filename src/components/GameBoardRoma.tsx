import React, { useState, useEffect } from "react";
import HandAI from "./HandAI.jsx";
import HandRoma from "./HandRoma.jsx";
import CardRoma from "./CardRoma.jsx";
import { PlayerType } from "../bot/BoardState.js";
import { getPossibleMoves, evaluateBoard, minimax } from "../bot/aiLogic.js";
import { transform } from "typescript";
import { API_URL } from "../constants/index.js"
import { api } from "../api.js"
import toast from "react-hot-toast";
// Створення юніта
const createUnit = (id, cardData, player) => ({
  id,
  content: cardData.name,
  owner: player,
  hp: cardData.health,
  attack: cardData.strength,
  fullData: cardData, // зберігаємо всю інформацію
});

const getRandomCards = (cards, count) => {
  const shuffled = [...cards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function GameBoardRoma() {
  console.log("API URL: ", API_URL)
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [playerDeck, setPlayerDeck] = useState([]);
  const [aiDeck, setAiDeck] = useState([]);

  const [cardsLoaded, setCardsLoaded] = useState(false);

  const [boardState, setBoardState] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [inspectedCard, setInspectedCard] = useState(null);

  const [playerCoins, setPlayerCoins] = useState(10);
  const [aiCoins, setAiCoins] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  const [shopVisible, setShopVisible] = useState(false);
  const [shopCards, setShopCards] = useState([]);

  // Завантаження карт з localStorage та ініціалізація рук
  // 1️⃣ Спочатку тільки зберігаємо decks
    useEffect(() => {
    const raw = localStorage.getItem("deckBuilder_activeDeck");
    if (!raw) {
      console.warn("No active deck in storage");
      return;
    }
    try {
      const { cards } = JSON.parse(raw);
      setPlayerDeck(cards);
      setAiDeck(cards);
    } catch (e) {
      console.error("Invalid active deck format", e);
    }
  }, []);
  // 2️⃣ Коли decks оновились — ініціалізуй руки
  useEffect(() => {
    if (playerDeck.length > 0 && aiDeck.length > 0) {
      const playerInitialHand = getRandomCards(playerDeck, 5).map(
        (card, index) => createUnit(`player-${index}`, card, "Player")
      );

      const aiInitialHand = getRandomCards(aiDeck, 5).map((card, index) =>
        createUnit(`ai-${index}`, card, "AI")
      );

      setPlayerHand(playerInitialHand);
      setAiHand(aiInitialHand);
      setCardsLoaded(true); // <- тепер тут
    }
  }, [playerDeck, aiDeck]);

  // 3️⃣ Коли руки готові — ініціалізуй boardState
  useEffect(() => {
    if (cardsLoaded && playerHand.length > 0 && aiHand.length > 0) {
      setBoardState({
        hands: {
          AI: aiHand,
          Player: playerHand,
        },
        rows: {
          AI_FRONT: [],
          AI_BACK: [],
          PLAYER_MID: [],
          PLAYER_REAR: [],
        },
        graveyard: {
          Player: [],
          AI: [],
        },
        coins: {
          AI: 10,
          Player: 10,
        },
        health: {
          AI: 30,
          Player: 30,
        },
        currentTurn: "Player",
        turnCount: 0,
        hasPlayedCardThisTurn: false,
        usedCardsThisTurn: new Set(),
      });
    }
  }, [cardsLoaded, playerHand, aiHand]);

  const handleCardClick = (card) => {
    if (inspectedCard?.id === card.id) {
      setInspectedCard(null);
      return;
    }

    setInspectedCard(card); // завжди показуємо інформацію

    if (boardState.currentTurn !== "Player") {
      console.log("Зараз не ваш хід!");
      return;
    }

    if (
      selectedCard &&
      selectedCard.owner === "Player" &&
      card.owner === "AI"
    ) {
      handleAttack(selectedCard, card);
      setInspectedCard(null); // Скидаємо інформацію про карту після атаки
      setSelectedCard(null);
    } else if (card.owner === "Player") {
      setSelectedCard(card); // вибір своєї карти
    }
  };

  const ATTACK_COST = 3;

  function handleAttack(attacker, defender = null) {
    if (boardState.usedCardsThisTurn.has(attacker.id)) {
      console.log("Ця картка вже атакувала цього ходу.");
      return;
    }

    if (defender) {
      // Атака по іншій картці
      const damage = attacker.attack || 0;
      defender.hp = Math.max((defender.hp || 0) - damage, 0);
      updateCardInState(defender);
    } else {
      // Атака по гравцю або ШІ
      const victimKey = attacker.isAiCard ? "Player" : "AI";
      const damage = attacker.attack || 0;

      setBoardState((prev) => {
        const newHealth = Math.max(prev.health[victimKey] - damage, 0);
        const updatedState = {
          ...prev,
          health: {
            ...prev.health,
            [victimKey]: newHealth,
          },
          usedCardsThisTurn: new Set(prev.usedCardsThisTurn).add(attacker.id),
        };

        if (newHealth === 0) {
          setTimeout(() => {
            toast.success(`${attacker.isAiCard ? "ШІ" : "Гравець"} переміг!`);
          }, 100);
        }

        return updatedState;
      });
      setInspectedCard(null); // Зникає при викладанні картки
      setSelectedCard(null);
      return;
    }

    // Записуємо, що картка атакувала
    setBoardState((prev) => ({
      ...prev,
      usedCardsThisTurn: new Set(prev.usedCardsThisTurn).add(attacker.id),
    }));
  }

  function updateCardInState(updatedCard) {
    setBoardState((prevState) => {
      let removedCard = null;

      const updatedRows = Object.fromEntries(
        Object.entries(prevState.rows).map(([rowKey, rowCards]) => {
          const newCards = rowCards
            .map((card) => {
              if (card.id === updatedCard.id) {
                const newHp = updatedCard.hp;
                if (newHp <= 0) {
                  removedCard = { ...card, hp: 0 }; // карта "помирає"
                  return null;
                } else {
                  return { ...card, ...updatedCard };
                }
              }
              return card;
            })
            .filter(Boolean); // видаляє null-значення (мертві карти)

          return [rowKey, newCards];
        })
      );

      const newGraveyard = { ...prevState.graveyard };

      if (removedCard) {
        const owner =
          removedCard.owner || (removedCard.isAiCard ? "AI" : "Player");
        newGraveyard[owner] = [
          ...(prevState.graveyard[owner] || []),
          removedCard,
        ];
      }

      if (removedCard && inspectedCard?.id === removedCard.id) {
        setInspectedCard(null);
      }

      return {
        ...prevState,
        rows: updatedRows,
        graveyard: newGraveyard,
      };
    });
  }

  function removeDeadUnits(board) {
    const deadPerSide = {
      Player: [],
      AI: [],
    };

    const cleanedRows = Object.fromEntries(
      Object.entries(board.rows).map(([rowKey, cards]) => {
        const newCards = [];

        for (const card of cards) {
          if (card.hp <= 0) {
            const owner = card.owner || (card.isAiCard ? "AI" : "Player");
            deadPerSide[owner].push({ ...card, hp: 0 });
          } else {
            newCards.push(card);
          }
        }

        return [rowKey, newCards];
      })
    );

    return {
      ...board,
      rows: cleanedRows,
      graveyard: {
        Player: [...(board.graveyard?.Player || []), ...deadPerSide.Player],
        AI: [...(board.graveyard?.AI || []), ...deadPerSide.AI],
      },
    };
  }

  const NEXT_TURN_BONUS = 2;

  function handleEndTurn() {
    if (boardState.currentTurn === "Player") {
      const nextTurnCount = boardState.turnCount + 1;

      setBoardState((prev) => ({
        ...prev,
        currentTurn: "AI",
        coins: {
          ...prev.coins,
          Player: prev.coins.Player + 5,
        },
        turnCount: nextTurnCount,
      }));

      setTimeout(() => {
        if (boardState.turnCount % 6 === 0) {
          openShop();
        }
      }, 2000);
    }
  }

  useEffect(() => {
    if (!boardState || boardState.currentTurn !== "AI") return;

    const timer = setTimeout(() => {
      playAiMove();
    }, 1000); // 1 секунда "роздумів"

    return () => clearTimeout(timer); // при зміні currentTurn очищаємо таймер
  }, [boardState]);

  const openShop = () => {
    // Збираємо всі ID карт, які вже використані (у руках або магазині)
    const usedCardIds = new Set([
      ...boardState.hands.Player.map((c) => c.fullData.id),
      ...boardState.hands.AI.map((c) => c.fullData.id),
      ...shopCards.map((c) => c.fullData.id),
    ]);

    // Фільтруємо ті, що ще не використані
    const availableCards = playerDeck.filter(
      (card) => !usedCardIds.has(card.id)
    );

    // Перемішати і взяти 3 випадкові
    const shuffled = availableCards.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    // Створюємо unit'и для магазину
    const newShopCards = selected.map((card, index) =>
      createUnit(`shop-card-${index}`, card, "Shop")
    );

    setShopCards(newShopCards);
    setShopVisible(true);
  };

  const handleBuyCard = (card) => {
    if (boardState.coins.Player < 5) {
      console.log("Не вистачає монет для купівлі карти");
      return;
    }

    const newCard = {
      ...card,
      id: `${card.fullData.id}-${Date.now()}`, // Унікальний ID
      owner: "Player",
    };

    setBoardState((prev) => ({
      ...prev,
      coins: {
        ...prev.coins,
        Player: prev.coins.Player - 5,
      },
      hands: {
        ...prev.hands,
        Player: [...prev.hands.Player, newCard],
      },
    }));

    // Видаляємо куплену карту з магазину
    setShopCards((prev) => {
      const updatedShop = prev.filter((c) => c.id !== card.id);

      // Якщо магазин спорожнів, закриваємо його
      if (updatedShop.length === 0) {
        handleCloseShop();
        console.log("Магазин закрито, всі картки куплено");
      }

      return updatedShop;
    });
  };

  const handleCloseShop = () => {
    setShopVisible(false); // Закриваємо магазин
  };

  function endTurn() {
    setBoardState((prev) => ({
      ...prev,
      currentTurn: prev.currentTurn === "Player" ? "AI" : "Player",
      hasPlayedCardThisTurn: false,
      usedCardsThisTurn: new Set(),
    }));
    setSelectedCard(null);
    if (boardState.currentTurn === "AI") {
      // тимчасово чекаємо на ручне натискання кнопки гравцем
      console.log("Хід ШІ. Натисніть кнопку, щоб передати хід назад.");
    }
    handleEndTurn();
  }

  const handleDropToRow = (rowKey) => {
    if (!selectedCard) return;

    // Перевірка, що карта з руки гравця
    if (selectedCard.owner !== "Player") return;

    if (
      boardState.currentTurn === "Player" &&
      boardState.hasPlayedCardThisTurn
    ) {
      console.log("Можна викласти лише одну карту за хід.");
      return;
    }

    setBoardState((prev) => {
      // Перевіряємо, чи картка вже є в цьому ряду
      if (prev.rows[rowKey].some((card) => card.id === selectedCard.id)) {
        console.log("Ця картка вже є в ряду.");
        return prev; // Якщо картка вже є в ряду, нічого не змінюємо
      }

      const updatedHand = prev.hands.Player.filter(
        (c) => c.id !== selectedCard.id
      );
      const updatedRow = [...prev.rows[rowKey], selectedCard];

      return {
        ...prev,
        hands: {
          ...prev.hands,
          Player: updatedHand,
        },
        rows: {
          ...prev.rows,
          [rowKey]: updatedRow,
        },
        hasPlayedCardThisTurn: true,
      };
    });
    setInspectedCard(null); // Зникає при викладанні картки
    setSelectedCard(null);
  };

  const playAiMove = () => {
    if (boardState.currentTurn !== "AI") {
      console.log("Зараз не хід ШІ");
      return;
    }

    console.log("Before minimax call - Board State:", boardState);

    const depth = 2;
    const aiMove = minimax(boardState, depth, true);

    if (aiMove && aiMove.boardState) {
      const cleanedBoard = removeDeadUnits(aiMove.boardState);
      setBoardState((prev) => ({
        ...cleanedBoard,
        currentTurn: "Player", // одразу передаємо хід назад гравцеві
        coins: {
          ...cleanedBoard.coins,
          AI: cleanedBoard.coins.AI + 5,
        },
        turnCount: prev.turnCount + 1,
      }));
    } else {
      console.error("aiMove або aiMove.boardState є undefined", aiMove);
    }
  };

  useEffect(() => {
    console.log("📥 Game state updated:");
    console.log(JSON.stringify(boardState, null, 2));
    console.log("Selected card:", selectedCard);
  }, [boardState, selectedCard]);
  useEffect(() => {
    if (!boardState) return;

    const { AI, Player } = boardState.health;

    if (!gameOver) {
      if (AI <= 0) {
        toast.success("Гравець переміг!");
        
        api.post('/api/match/finish', {result: "WIN"}) 
        setGameOver(true);
      } else if (Player <= 0) {
        api.post('/api/match/finish', {result: "LOSE"}) 
        toast.error("ШІ переміг!");
        setGameOver(true);
      }
    }
  }, [boardState, gameOver]);

  if (!boardState) {
    console.warn("boardState is not init");
    return <div>Завантаження гри...</div>;
  }
  return (
    <div className="game-container">
      <div className="player-info">
        <img
          src="https://theflorala.com/wp-content/uploads/2024/09/no-name.jpeg"
          alt="Player"
          style={{
            width: 80,
            height: 80,
            borderRadius: "40px",
            display: "flex",
          }}
        />
        <span>HP: {boardState.health.Player}</span>
      </div>

      {/* Іконка гравця */}
      <div
        className="ai-info"
        onClick={() => {
          if (
            selectedCard &&
            boardState.currentTurn === "Player" &&
            !boardState.usedCardsThisTurn.has(selectedCard.id)
          ) {
            const aiCardsOnField =
              boardState.rows.AI_FRONT.length + boardState.rows.AI_BACK.length;

            if (aiCardsOnField > 0) {
              console.log(
                "Неможливо атакувати гравця, поки на полі є ворожі карти."
              );
              return;
            }

            handleAttack(selectedCard, null); // Атака по ШІ
            setSelectedCard(null);
          }
        }}
        style={{
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <img
          src="https://theflorala.com/wp-content/uploads/2024/09/no-name.jpeg"
          alt="AI"
          style={{
            width: 80,
            height: 80,
            borderRadius: "40px",
            display: "flex",
          }}
        />
        <span>HP: {boardState.health.AI}</span>
      </div>

      <HandAI aiHand={boardState.hands.AI} />
      <div className="coin-display ai-coins" style={{ top: "32vh" }}>
        <div className="coin-count">{boardState.coins.AI}</div>
        <img className="coin" src="public/sprites/coin.png"></img>
      </div>
      <div className="turn-indicator">Зараз хід: {boardState.currentTurn}</div>
      {inspectedCard && (
        <div
          style={{
            position: "fixed",
            bottom: "20vh",
            right: "10vw",
            padding: "10px",
            zIndex: 1001,
          }}
        >
          <img
            src={`${API_URL}${inspectedCard.fullData.imageUrl}`}
            className="prev-img"
          ></img>
          <span className="stat-1-prev">{inspectedCard.hp}</span>
          <span className="stat-2-prev">{inspectedCard.attack}</span>
        </div>
      )}

      {/* Ряди */}
      <div
        className="blocks-wrapper"
        style={{ position: "relative", top: "50px" }}
      >
        {/* AI Front Row */}
        <div className="drop-area" style={areaStyle}>
          {boardState.rows.AI_FRONT.map((card) => (
            <CardRoma card={card} key={card.id} onClick={handleCardClick} />
          ))}
        </div>

        {/* AI Back Row */}
        <div className="drop-area" style={areaStyle}>
          {boardState.rows.AI_BACK.map((card) => (
            <CardRoma card={card} key={card.id} onClick={handleCardClick} />
          ))}
        </div>

        {/* Player Middle Row */}
        <div
          className="drop-area"
          onClick={() => handleDropToRow("PLAYER_MID")}
          style={dropZoneStyle}
        >
          {boardState.rows.PLAYER_MID.map((card) => (
            <CardRoma card={card} key={card.id} onClick={handleCardClick} />
          ))}
        </div>

        {/* Player Rear Row */}
        <div
          className="drop-area"
          onClick={() => handleDropToRow("PLAYER_REAR")}
          style={dropZoneStyle}
        >
          {boardState.rows.PLAYER_REAR.map((card) => (
            <CardRoma card={card} key={card.id} onClick={handleCardClick} />
          ))}
        </div>
      </div>

      {/* Кнопка завершення ходу*/}
      <button onClick={endTurn} className="end-turn-button">
        Завершити хід
      </button>

      {/* Hand of Player*/}
      <HandRoma
        hand={boardState.hands.Player}
        onCardClick={handleCardClick}
        selectedCard={selectedCard}
      />

      <div className="coin-display player-coins" style={{ bottom: "4.5vh" }}>
        <div className="coin-count">{boardState.coins.Player}</div>
        <img className="coin" src="public/sprites/coin.png"></img>
      </div>
      {/* Відбій */}
      <div className="graveyard-container">
        <div className="gr-player faded-card">
          {boardState.graveyard?.Player?.length > 0 && (
            <CardRoma
              key={boardState.graveyard.Player.at(-1).id}
              card={{ ...boardState.graveyard.Player.at(-1), hp: 0 }}
              className="faded-card"
            />
          )}
        </div>

        <div className="gr-ai faded-card">
          {boardState.graveyard?.AI?.length > 0 && (
            <CardRoma
              key={boardState.graveyard.AI.at(-1).id}
              card={{ ...boardState.graveyard.AI.at(-1), hp: 0 }}
              className="faded-card"
            />
          )}
        </div>
      </div>

      {/* Вікно магазину */}
      {shopVisible && (
        <div className="shop-container-game">
          <h4 style={{ marginBottom: "8vh", fontSize: "28px" }}>
            Магазин карт
          </h4>
          <div className="shop-cards">
            {shopCards.map((card) => (
              <div
                key={card.id}
                className="shop-card"
                onClick={() => handleBuyCard(card)}
                style={{ cursor: "pointer" }}
              >
                <div className="shop-card-item">
                  <CardRoma card={card} />
                </div>
                <div className="card-price">Ціна: 5 монет</div>
              </div>
            ))}
          </div>

          <button className="close-shop-button" onClick={handleCloseShop}>
            Закрити магазин
          </button>
        </div>
      )}
    </div>
  );
}

// Стилі
const areaStyle = {
  border: "2px dashed #888",
  display: "flex",
  justifyContent: "center",
};

const dropZoneStyle = {
  ...areaStyle,
  minHeight: "80px",
};

const previewStyle = {
  position: "absolute",
  top: "20%",
  right: "30px",
  border: "3px solid #555",
  padding: "12px",
  backgroundColor: "#fff",
  fontSize: "1.2em",
  zIndex: 1000,
  transition: "transform 0.3s ease",
};
