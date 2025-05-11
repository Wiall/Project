import { BoardState } from "./BoardState";

export function evaluateBoardState(state: BoardState): number {
  const playerAdvantage = state.player.hp - state.opponent.hp;
  const playerCards = [
    ...state.line1.cards,
    ...state.line2.cards,
    ...state.line3.cards,
  ];
  const opponentCards = [
    ...state.line1.cards,
    ...state.line2.cards,
    ...state.line3.cards,
  ];

  const playerPower = playerCards.reduce(
    (sum, card) => sum + card.attack + card.hp,
    0
  );
  const opponentPower = opponentCards.reduce(
    (sum, card) => sum + card.attack + card.hp,
    0
  );

  return playerAdvantage + (playerPower - opponentPower);
}
