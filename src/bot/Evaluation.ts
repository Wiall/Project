import { BoardState, Player } from "./BoardState";
import { Card } from "./Card";

export function evaluateBoardState(state: BoardState): number {
  const playerAdvantage = state.player.hp - state.opponent.hp;

  const getLinePower = (line: { cards: Card[] }) =>
    line.cards.reduce((sum, card) => sum + card.attack + card.hp, 0);

  const playerPower = getLinePower(state.line1) + getLinePower(state.line2);
  const opponentPower = getLinePower(state.line1) + getLinePower(state.line2);

  const playerScore = playerPower + state.player.hp;
  const opponentScore = opponentPower + state.opponent.hp;

  return playerScore - opponentScore + playerAdvantage;
}
