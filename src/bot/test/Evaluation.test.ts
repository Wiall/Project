import { evaluateBoardState } from "../Evaluation";
import { BoardState } from "../BoardState";

const mockPlayer = { id: "player", hp: 30, gold: 10 };
const mockOpponent = { id: "opponent", hp: 30, gold: 10 };

const basicBoardState: BoardState = {
  player: mockPlayer,
  opponent: mockOpponent,
  line1: { cards: [] },
  line2: { cards: [] },
  line3: { cards: [] },
};

const boardStateWithAdvantage: BoardState = {
  ...basicBoardState,
  player: { ...mockPlayer, hp: 25 },
  opponent: { ...mockOpponent, hp: 15 },
  line1: {
    cards: [
      {
        id: "card1",
        content: "Swordsman",
        attack: 5,
        hp: 10,
        type: "melee",
        range: 1,
      },
    ],
  },
  line2: { cards: [] },
  line3: { cards: [] },
};

const boardStateWithDisadvantage: BoardState = {
  ...basicBoardState,
  player: { ...mockPlayer, hp: 10 },
  opponent: { ...mockOpponent, hp: 30 },
  line1: { cards: [] },
  line2: {
    cards: [
      {
        id: "card1",
        content: "Archer",
        attack: 3,
        hp: 5,
        type: "ranged",
        range: 2,
      },
    ],
  },
  line3: { cards: [] },
};

describe("evaluateBoardState", () => {
  test("Initial state should have zero score", () => {
    expect(evaluateBoardState(basicBoardState)).toBe(0);
  });

  test("State with player advantage should return positive score", () => {
    const score = evaluateBoardState(boardStateWithAdvantage);
    expect(score).toBeGreaterThan(0);
  });

  test("State with opponent advantage should return negative score", () => {
    const score = evaluateBoardState(boardStateWithDisadvantage);
    expect(score).toBeLessThan(0);
  });
});
