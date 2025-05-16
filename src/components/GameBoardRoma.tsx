import React, { useState, useEffect } from "react"; // вже є
import HandAI from "./HandAI";
import HandRoma from "./HandRoma";
import CardRoma from "./CardRoma";
import { PlayerType } from "../bot/BoardState";
import { getPossibleMoves, evaluateBoard, minimax } from "../bot/aiLogic";

// Тип Unit (якщо не TypeScript, просто залишаємо як JS-обʼєкт)
const createUnit = (id, content, player, hp = 10, attack = 3) => ({
  id,
  content,
  owner: player,
  hp,
  attack,
});

// Ініціалізація початкового стану
const initialBoardState = {
  hands: {
    AI: [
      createUnit("card-1AI", "card-1", "AI", 8, 2),
      createUnit("card-2AI", "card-2", "AI", 10, 3),
      createUnit("card-3AI", "card-3", "AI", 12, 4),
      createUnit("card-4AI", "card-4", "AI", 15, 1),
      createUnit("card-5AI", "card-5", "AI", 6, 5),
    ],
    Player: [
      createUnit("card-1", "card-1", "Player", 10, 3),
      createUnit("card-2", "card-2", "Player", 9, 4),
      createUnit("card-3", "card-3", "Player", 7, 5),
      createUnit("card-4", "card-4", "Player", 12, 2),
    ],
  },
  rows: {
    AI_FRONT: [],
    AI_BACK: [],
    PLAYER_MID: [],
    PLAYER_REAR: [],
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
};

export default function GameBoardRoma() {
  const [boardState, setBoardState] = useState(() => ({
    ...initialBoardState,
    currentTurn: "Player",
    hasPlayedCardThisTurn: false,
    usedCardsThisTurn: new Set(),
  }));

  const [selectedCard, setSelectedCard] = useState(null);
  const [playerCoins, setPlayerCoins] = useState(10);
  const [inspectedCard, setInspectedCard] = useState(null);

  const [aiCoins, setAiCoins] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  const [shopVisible, setShopVisible] = useState(false); // Додано стан для відображення магазину
  const [shopCards, setShopCards] = useState([]); // Массив карт магазину

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
            alert(`${attacker.isAiCard ? "ШІ" : "Гравець"} переміг!`);
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
      const updatedRows = Object.fromEntries(
        Object.entries(prevState.rows).map(([rowKey, rowCards]) => {
          const newCards =
            updatedCard.hp <= 0
              ? rowCards.filter((card) => card.id !== updatedCard.id) // Видаляємо
              : rowCards.map((card) =>
                  card.id === updatedCard.id
                    ? { ...card, ...updatedCard }
                    : card
                ); // Оновлюємо

          return [rowKey, newCards];
        })
      );

      // Скидаємо inspectedCard, якщо її вже немає на полі
      const isCardRemoved = updatedCard.hp <= 0;
      if (isCardRemoved && inspectedCard?.id === updatedCard.id) {
        setInspectedCard(null);
      }

      return {
        ...prevState,
        rows: updatedRows,
      };
    });
  }

  function removeDeadUnits(board) {
    const cleanedRows = {};

    for (const [rowKey, cards] of Object.entries(board.rows)) {
      cleanedRows[rowKey] = cards.filter((card) => card.hp > 0);
    }

    return {
      ...board,
      rows: cleanedRows,
    };
  }

  const NEXT_TURN_BONUS = 2;

  function handleEndTurn() {
    if (boardState.currentTurn === "Player") {
      setBoardState((prev) => ({
        ...prev,
        currentTurn: "AI",
        coins: {
          ...prev.coins,
          Player: prev.coins.Player + 5,
        },
        turnCount: prev.turnCount + 1,
      }));

      const timer = setTimeout(() => {
        if (boardState.turnCount % 6 === 0 && boardState.turnCount !== 0) {
          openShop();
        }
      }, 2000);
    }
  }
  useEffect(() => {
    if (boardState.currentTurn === "AI") {
      const timer = setTimeout(() => {
        playAiMove();
      }, 1000); // 1 секунда "роздумів"

      return () => clearTimeout(timer); // при зміні currentTurn очищаємо таймер
    }
  }, [boardState.currentTurn]);

  const openShop = () => {
    // Генерація 3 випадкових карт для магазину
    const newShopCards = [
      createUnit("shop-card-1", "card-1", "Shop", 8, 2),
      createUnit("shop-card-2", "card-2", "Shop", 10, 3),
      createUnit("shop-card-3", "card-3", "Shop", 12, 4),
    ];
    setShopCards(newShopCards);
    setShopVisible(true);
  };

  const handleBuyCard = (card) => {
    if (boardState.coins.Player < 5) {
      console.log("Не вистачає монет для купівлі карти");
      return;
    }

    // Створюємо копію карти з оновленим власником та новим ID
    const newCard = {
      ...card,
      id: `${card.content}-${Date.now()}`, // унікальний ID, щоб уникнути конфліктів
      owner: "Player",
    };

    setBoardState((prev) => ({
      ...prev,
      coins: {
        ...prev.coins,
        Player: prev.coins.Player - 5, // Вартість карти
      },
      hands: {
        ...prev.hands,
        Player: [...prev.hands.Player, newCard], // Додаємо оновлену карту
      },
    }));

    setShopVisible(false); // Закриваємо магазин
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
    const { AI, Player } = boardState.health;

    if (!gameOver) {
      if (AI <= 0) {
        alert("Гравець переміг!");
        setGameOver(true);
      } else if (Player <= 0) {
        alert("ШІ переміг!");
        setGameOver(true);
      }
    }
  }, [boardState.health, gameOver]);

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
            background: "black",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",

            zIndex: 1000,
          }}
        >
          <h4>Інформація про карту</h4>
          <p>
            <strong>ID:</strong> {inspectedCard.id}
          </p>
          <p>
            <strong>Зміст:</strong> {inspectedCard.content}
          </p>
          <p>
            <strong>Власник:</strong> {inspectedCard.owner}
          </p>
          <p>
            <strong>HP:</strong> {inspectedCard.hp}
          </p>
          <p>
            <strong>Атака:</strong> {inspectedCard.attack}
          </p>
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

      {/* Hand of Player */}
      <HandRoma
        hand={boardState.hands.Player}
        onCardClick={handleCardClick}
        selectedCard={selectedCard}
      />

      <div className="coin-display player-coins" style={{ bottom: "4.5vh" }}>
        <div className="coin-count">{boardState.coins.Player}</div>
        <img className="coin" src="public/sprites/coin.png"></img>
      </div>

      {/* Вікно магазину */}
      {shopVisible && (
        <div className="shop-container">
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
