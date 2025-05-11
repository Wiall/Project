import { BoardState } from "./BoardState";
import { Move, generateMoves } from "./MoveGenerator";
import { evaluateBoardState } from "./Evaluation";

const MAX_DEPTH = 3;

export function minimax(
  state: BoardState,
  depth: number,
  isMaximizing: boolean
): number {
  if (depth === 0) {
    return evaluateBoardState(state);
  }

  const moves = generateMoves(state);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const evalScore = minimax(state, depth - 1, false);
      maxEval = Math.max(maxEval, evalScore);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const evalScore = minimax(state, depth - 1, true);
      minEval = Math.min(minEval, evalScore);
    }
    return minEval;
  }
}

export function getBestMove(state: BoardState): Move | null {
  let bestMove: Move | null = null;
  let bestValue = -Infinity;
  const moves = generateMoves(state);

  for (const move of moves) {
    const evalScore = minimax(state, MAX_DEPTH, false);
    if (evalScore > bestValue) {
      bestValue = evalScore;
      bestMove = move;
    }
  }

  return bestMove;
}
