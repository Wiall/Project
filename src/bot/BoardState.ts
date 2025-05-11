import { Card } from "./Card";

export interface Player {
  id: string;
  hp: number;
  gold: number;
}

export interface BoardLine {
  cards: Card[];
}

export interface BoardState {
  player: Player;
  opponent: Player;
  line1: { cards: { id: string; content: string }[] };
  line2: { cards: { id: string; content: string }[] };
  line3: { cards: { id: string; content: string }[] };
}
