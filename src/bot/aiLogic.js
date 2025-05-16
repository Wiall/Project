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
