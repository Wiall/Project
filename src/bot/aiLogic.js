// aiLogic.js

export function getPossibleMoves(boardState) {
  const { hands, rows, usedCardsThisTurn } = boardState;
  const aiHand = hands.AI;
  const aiUnits = [...rows.AI_FRONT, ...rows.AI_BACK];
  const playerUnits = [...rows.PLAYER_MID, ...rows.PLAYER_REAR];
  const moves = [];

  // Опції викладання (можна викласти 1 карту або нічого)
  const placeOptions = aiHand.flatMap((card) => [
    { type: "place", card, targetRow: "AI_FRONT" },
    { type: "place", card, targetRow: "AI_BACK" },
  ]);
  placeOptions.push(null); // варіант без викладення

  for (const placeMove of placeOptions) {
    const currentMoveSet = [];
    const simulatedRows = JSON.parse(JSON.stringify(rows)); // копія для імітації викладання

    if (placeMove) {
      currentMoveSet.push(placeMove);
      const { card, targetRow } = placeMove;
      simulatedRows[targetRow].push(card); // імітуємо, що карта вже на полі
    }

    const aiUnits = [...simulatedRows.AI_FRONT, ...simulatedRows.AI_BACK];
    const attackMoves = [];

    for (const unit of aiUnits) {
      if (usedCardsThisTurn.has(unit.id)) continue;

      if (playerUnits.length > 0) {
        const bestTarget = playerUnits[0]; // або інша логіка
        attackMoves.push({
          type: "attack",
          attacker: unit,
          target: bestTarget,
        });
      } else {
        attackMoves.push({
          type: "attack",
          attacker: unit,
          target: null,
        });
      }
    }

    const fullMoveSet = [...currentMoveSet, ...attackMoves];
    moves.push(fullMoveSet);
  }

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
      boardState,
    };
  }

  const possibleMoves = getPossibleMoves(boardState);

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = null;
    let bestBoard = null;

    for (const moveSet of possibleMoves) {
      const newBoardState = applyMove(boardState, moveSet);
      const result = minimax(newBoardState, depth - 1, false);

      if (result.value > maxEval) {
        maxEval = result.value;
        bestMove = moveSet;
        bestBoard = newBoardState;
      }
    }

    return { value: maxEval, move: bestMove, boardState: bestBoard };
  } else {
    let minEval = Infinity;
    let bestMove = null;
    let bestBoard = null;

    for (const moveSet of possibleMoves) {
      const newBoardState = applyMove(boardState, moveSet);
      const result = minimax(newBoardState, depth - 1, true);

      if (result.value < minEval) {
        minEval = result.value;
        bestMove = moveSet;
        bestBoard = newBoardState;
      }
    }

    return { value: minEval, move: bestMove, boardState: bestBoard };
  }
}

/**
 * Застосовує хід до поточного стану гри та повертає новий стан.
 * @param {Object} boardState - Поточний стан гри.
 * @param {Object} move - Хід, який потрібно застосувати.
 * @returns {Object} - Новий стан гри після застосування ходу.
 */
function applyMove(boardState, moveSet) {
  const newBoardState = JSON.parse(JSON.stringify(boardState));

  // Відновлюємо Set після клонування
  newBoardState.usedCardsThisTurn = new Set(boardState.usedCardsThisTurn);

  for (const move of moveSet) {
    switch (move.type) {
      case "place":
        const { card, targetRow } = move;
        const handIndex = newBoardState.hands.AI.findIndex(
          (c) => c.id === card.id
        );
        if (handIndex !== -1) {
          newBoardState.hands.AI.splice(handIndex, 1);
          newBoardState.rows[targetRow].push({ ...card }); // переконайся, що копія карти, а не посилання
        }
        break;

      case "attack":
        const { attacker, target } = move;
        const actualAttacker = findCardOnBoard(newBoardState.rows, attacker.id);
        if (!actualAttacker) break; // захист

        if (target) {
          const actualTarget = findCardOnBoard(newBoardState.rows, target.id);
          if (actualTarget) {
            actualTarget.hp -= actualAttacker.attack;
            if (actualTarget.hp <= 0) {
              removeCardFromBoard(newBoardState.rows, actualTarget.id);
            }
          }
        } else {
          newBoardState.health.Player -= actualAttacker.attack;
        }

        newBoardState.usedCardsThisTurn.add(attacker.id);
        break;

      default:
        break;
    }
  }

  return newBoardState;
}

function findCardOnBoard(rows, cardId) {
  for (const row of Object.values(rows)) {
    const found = row.find((card) => card.id === cardId);
    if (found) return found;
  }
  return null;
}

function removeCardFromBoard(rows, cardId) {
  for (const rowKey of Object.keys(rows)) {
    rows[rowKey] = rows[rowKey].filter((card) => card.id !== cardId);
  }
}
