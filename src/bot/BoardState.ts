export type PlayerType = "AI" | "HUMAN";

export type UnitType = "MELEE" | "RANGED";

export interface Unit {
  id: string;
  owner: PlayerType;
  type: UnitType;
  hp: number;
  attack: number;
  canAct: boolean; // Чи може діяти цього ходу
  position: {
    row: BoardRow;
    index: number; // Позиція в межах ряду
  };
  isAlive: boolean;
}

export type BoardRow =
  | "AI_FRONT" // передній ряд ШІ
  | "AI_BACK" // задній (середній) ряд ШІ
  | "PLAYER_FRONT" // передній (середній) ряд гравця
  | "PLAYER_BACK"; // тиловий ряд гравця (де сам гравець)

export interface BoardState {
  rows: {
    AI_FRONT: Unit[];
    AI_BACK: Unit[];
    PLAYER_FRONT: Unit[];
    PLAYER_BACK: Unit[];
  };
  playerHp: number;
  aiHp: number;
  playerGold: number;
  aiGold: number;
  currentTurn: PlayerType;
}
