export type CardType = "melee" | "ranged";

export interface Card {
  id: string;
  content: string;
  attack: number;
  hp: number;
  type: CardType;
  range: number;
}
