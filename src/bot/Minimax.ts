import { BoardState } from "./BoardState";
import { Move, generateMoves } from "./MoveGenerator";
import { evaluateBoardState } from "./Evaluation";

const MAX_DEPTH = 3;

export function minimax(
  state: BoardState,
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): number {
  if (depth === 0 || state.player.hp <= 0 || state.opponent.hp <= 0) {
    return evaluateBoardState(state);
  }

  const moves = generateMoves(state);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newState = applyMove(state, move, true);
      const evalScore = minimax(newState, depth - 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newState = applyMove(state, move, false);
      const evalScore = minimax(newState, depth - 1, true, alpha, beta);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBestMove(state: BoardState): Move | null {
  let bestMove: Move | null = null;
  let bestValue = -Infinity;
  const moves = generateMoves(state);

  for (const move of moves) {
    const newState = applyMove(state, move, true);
    const evalScore = minimax(newState, MAX_DEPTH, false);
    if (evalScore > bestValue) {
      bestValue = evalScore;
      bestMove = move;
    }
  }

  return bestMove;
}

function applyMove(
  state: BoardState,
  move: Move,
  isMaximizing: boolean
): BoardState {
  const newState = JSON.parse(JSON.stringify(state));
  const { cardId, fromLine, toLine } = move;

  const lines = [newState.line1, newState.line2, newState.line3];
  const cardIndex = lines[fromLine].cards.findIndex(
    (card) => card.id === cardId
  );

  if (cardIndex !== -1) {
    const [movedCard] = lines[fromLine].cards.splice(cardIndex, 1);

    if (movedCard.type === "melee") {
      // Атака ближнього бою
      if (toLine === 0 && lines[1].cards.length > 0) {
        const target = lines[1].cards[0];
        target.hp -= movedCard.attack;
        if (target.hp <= 0) {
          lines[1].cards.splice(0, 1);
        }
      }
    } else if (movedCard.type === "ranged") {
      // Атака дальнього бою
      const targetLine = toLine === 0 ? 1 : 0;
      if (lines[targetLine].cards.length > 0) {
        const target = lines[targetLine].cards[0];
        target.hp -= movedCard.attack;
        if (target.hp <= 0) {
          lines[targetLine].cards.splice(0, 1);
        }
      }
    }

    lines[toLine].cards.push(movedCard);
  }

  return newState;
}
