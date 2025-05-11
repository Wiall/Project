import { BoardState } from "./BoardState";
import { Card } from "./Card";

export interface Move {
  cardId: string;
  fromLine: number;
  toLine: number;
}

export function generateMoves(state: BoardState): Move[] {
  const moves: Move[] = [];
  const allLines = [state.line1, state.line2, state.line3];

  allLines.forEach((line, index) => {
    line.cards.forEach((card) => {
      // Пересування між лініями
      for (let i = 0; i < allLines.length; i++) {
        if (i !== index) {
          moves.push({ cardId: card.id, fromLine: index, toLine: i });
        }
      }
    });
  });

  return moves;
}
