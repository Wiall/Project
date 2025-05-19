import { BoardState } from "./BoardState";
import { Card } from "./Card";

export interface Move {
  cardId: string;
  fromLine: number;
  toLine: number;
}

export function generateMoves(state: BoardState): Move[] {
  const moves: Move[] = [];
  const lines = [state.line1, state.line2, state.line3];

  lines.forEach((line, fromLineIndex) => {
    line.cards.forEach((card) => {
      if (card.type === "melee") {
        // Мелеє атака тільки на передню лінію
        if (fromLineIndex === 1 && lines[0].cards.length > 0) {
          moves.push({ cardId: card.id, fromLine: fromLineIndex, toLine: 0 });
        }
      }

      if (card.type === "ranged") {
        // Дальня атака на будь-яку лінію
        for (let i = 0; i <= 1; i++) {
          if (i !== fromLineIndex && lines[i].cards.length > 0) {
            moves.push({ cardId: card.id, fromLine: fromLineIndex, toLine: i });
          }
        }
      }

      // Переміщення між лініями
      for (let i = 0; i < lines.length; i++) {
        if (i !== fromLineIndex) {
          moves.push({ cardId: card.id, fromLine: fromLineIndex, toLine: i });
        }
      }
    });
  });

  return moves;
}
