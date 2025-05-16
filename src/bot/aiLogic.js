// aiLogic.js

export function getPossibleMoves(boardState) {
  const { hands, rows, currentTurn } = boardState;
  const aiHand = hands.AI;
  const moves = [];

  // Викладання карт з руки
  aiHand.forEach((card) => {
    moves.push({
      type: "place",
      card,
      targetRow: "AI_FRONT",
    });
    moves.push({
      type: "place",
      card,
      targetRow: "AI_BACK",
    });
  });

  // Атака картами на полі
  const aiFront = rows.AI_FRONT;
  const aiBack = rows.AI_BACK;
  const playerFront = rows.PLAYER_MID;
  const playerBack = rows.PLAYER_REAR;

  [...aiFront, ...aiBack].forEach((card) => {
    if (!boardState.usedCardsThisTurn.has(card.id)) {
      // Атака по ворожих картах
      [...playerFront, ...playerBack].forEach((target) => {
        moves.push({
          type: "attack",
          attacker: card,
          target,
        });
      });

      // Атака по гравцю, якщо немає карт у ворога
      if (playerFront.length === 0 && playerBack.length === 0) {
        moves.push({
          type: "attack",
          attacker: card,
          target: null, // Атака по гравцю
        });
      }
    }
  });

  return moves;
}

// aiLogic.js

/**
 * Оцінка поточного стану гри для ШІ.
 * Вищі значення означають вигідніший стан для ШІ.
 */
export function evaluateBoard(boardState) {
  const { health, rows, coins } = boardState;

  let aiScore = 0;
  let playerScore = 0;

  // Здоров'я
  aiScore += health.AI * 10;
  playerScore += health.Player * 10;

  // Монети — невелика вага, але все ж враховуємо
  aiScore += coins.AI * 2;
  playerScore += coins.Player * 2;

  // Вартість карт на полі
  const aiUnits = [...rows.AI_FRONT, ...rows.AI_BACK];
  const playerUnits = [...rows.PLAYER_MID, ...rows.PLAYER_REAR];

  aiUnits.forEach((card) => {
    aiScore += (card.hp + card.attack) * 5;
  });

  playerUnits.forEach((card) => {
    playerScore += (card.hp + card.attack) * 5;
  });

  // Чим вищий результат, тим краща ситуація для ШІ
  return aiScore - playerScore;
}

/**
 * Алгоритм Мінімакс
 * @param {Object} boardState - поточний стан гри
 * @param {number} depth - глибина пошуку
 * @param {boolean} isMaximizingPlayer - чи хід ШІ (true) або гравця (false)
 * @returns {Object} - об'єкт з найкращим значенням та ходом
 */
export function minimax(boardState, depth, isMaximizingPlayer) {
  if (
    depth === 0 ||
    !boardState ||
    !boardState.health ||
    boardState.health.AI <= 0 ||
    boardState.health.Player <= 0
  ) {
    return {
      value: evaluateBoard(boardState),
      move: null,
      boardState, // ← повертаємо поточний стан
    };
  }

  const possibleMoves = getPossibleMoves(boardState);

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = null;
    let bestBoard = null;

    for (const move of possibleMoves) {
      const newBoardState = applyMove(boardState, move);
      const result = minimax(newBoardState, depth - 1, false);

      if (result.value > maxEval) {
        maxEval = result.value;
        bestMove = move;
        bestBoard = newBoardState;
      }
    }

    return {
      value: maxEval,
      move: bestMove,
      boardState: bestBoard,
    };
  } else {
    let minEval = Infinity;
    let bestMove = null;
    let bestBoard = null;

    for (const move of possibleMoves) {
      const newBoardState = applyMove(boardState, move);
      const result = minimax(newBoardState, depth - 1, true);

      if (result.value < minEval) {
        minEval = result.value;
        bestMove = move;
        bestBoard = newBoardState;
      }
    }

    return {
      value: minEval,
      move: bestMove,
      boardState: bestBoard,
    };
  }
}

/**
 * Застосовує хід до поточного стану гри та повертає новий стан.
 * @param {Object} boardState - Поточний стан гри.
 * @param {Object} move - Хід, який потрібно застосувати.
 * @returns {Object} - Новий стан гри після застосування ходу.
 */
function applyMove(boardState, move) {
  const newBoardState = JSON.parse(JSON.stringify(boardState));

  // Відновлюємо Set після JSON-клонування
  newBoardState.usedCardsThisTurn = new Set(boardState.usedCardsThisTurn);

  switch (move.type) {
    case "place":
      const { card, targetRow } = move;
      const handIndex = newBoardState.hands.AI.findIndex(
        (c) => c.id === card.id
      );

      if (handIndex !== -1) {
        newBoardState.hands.AI.splice(handIndex, 1);
        newBoardState.rows[targetRow].push(card);
      }
      break;

    case "attack":
      const { attacker, target } = move;

      if (target) {
        target.hp -= attacker.attack;

        if (target.hp <= 0) {
          Object.keys(newBoardState.rows).forEach((row) => {
            newBoardState.rows[row] = newBoardState.rows[row].filter(
              (c) => c.id !== target.id
            );
          });
        }
      } else {
        newBoardState.health.Player -= attacker.attack;
      }

      newBoardState.usedCardsThisTurn.add(attacker.id);
      break;

    default:
      break;
  }

  return newBoardState;
}
