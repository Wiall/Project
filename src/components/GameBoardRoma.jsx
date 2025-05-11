import React, { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import HandRoma from "./HandRoma";
import HandAI from "./HandAI";
//import { BoardState } from "../bot/BoardState";
import { generateMoves } from "../bot/MoveGenerator";

const initialCards = [
  { id: "card-1", content: "card-1" },
  { id: "card-2", content: "card-2" },
  { id: "card-3", content: "card-3" },
  { id: "card-4", content: "card-4" },
];

const initialCardsAI = [
  { id: "card-1AI", content: "card-1", isAiCard: true },
  { id: "card-2AI", content: "card-2", isAiCard: true },
  { id: "card-3AI", content: "card-3", isAiCard: true },
  { id: "card-4AI", content: "card-4", isAiCard: true },
  { id: "card-5AI", content: "card-5", isAiCard: true },
];

export default function GameBoardRoma() {
  const [hand, setHand] = useState(initialCards);
  const [handAi, setHandAi] = useState(initialCardsAI);
  const [cards1, setCards1] = useState([]);
  const [cards2, setCards2] = useState([]);
  const [cards3, setCards3] = useState([]);
  const [cards4, setCards4] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = source.droppableId === "hand" ? hand : [];
    const movedCard = sourceList[source.index];

    if (!movedCard) return;

    const targetList =
      destination.droppableId === "drop-area-1" ? "cards1" : "cards2";
    if (!targetList) return;

    // Зникає одразу після відпускання
    setHand((prev) =>
      prev.map((card) =>
        card.id === movedCard.id ? { ...card, isDisappearing: true } : card
      )
    );

    setTimeout(() => {
      // Додаємо карту до цільового масиву з анімацією з'явлення
      setHand((prev) => prev.filter((card) => card.id !== movedCard.id));
      setCards1((prev) =>
        targetList === "cards1"
          ? [...prev, { ...movedCard, isAppearing: true }]
          : prev
      );
      setCards2((prev) =>
        targetList === "cards2"
          ? [...prev, { ...movedCard, isAppearing: true }]
          : prev
      );
    }, 100); // Час зникнення
  };

  const playAiMove = () => {
    if (handAi.length === 0) return;

    const movedCard = { ...handAi[0], isAiCard: true }; // Додаємо прапорець
    const targetBlock = cards3.length <= cards4.length ? "cards3" : "cards4";

    setHandAi((prev) => prev.slice(1));

    if (targetBlock === "cards3") setCards3((prev) => [...prev, movedCard]);
    if (targetBlock === "cards4") setCards4((prev) => [...prev, movedCard]);
  };

  return (
    <div className="game-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <HandAI aiHand={handAi} />

        {/* 🔹 4 окремі ряди для карт */}
        <div
          className="blocks-wrapper"
          style={{ position: "relative", top: "50px" }}
        >
          {/* Ряд ШІ 1 */}
          <div
            className="drop-area"
            style={{
              border: "2px dashed #888",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="cards">
              {cards3.map((card) => (
                <div className={`cardd ${card.id} ai-card`} key={card.id}>
                  {card.content}
                </div>
              ))}
            </div>
          </div>

          {/* Ряд ШІ 2 */}
          <div
            className="drop-area"
            style={{
              border: "2px dashed #888",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="cards">
              {cards4.map((card) => (
                <div className={`cardd ${card.id} ai-card`} key={card.id}>
                  {card.content}
                </div>
              ))}
            </div>
          </div>

          {/* Ряд гравця 1 */}
          <Droppable droppableId="drop-area-1" direction="horizontal">
            {(provided) => (
              <div
                className="drop-area"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  border: "2px dashed #888",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {cards1.map((card) => (
                  <div className={`cardd ${card.id}`} key={card.id}>
                    {card.content}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Ряд гравця 2 */}
          <Droppable droppableId="drop-area-2" direction="horizontal">
            {(provided) => (
              <div
                className="drop-area"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  border: "2px dashed #888",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {cards2.map((card) => (
                  <div className={`cardd ${card.id}`} key={card.id}>
                    {card.content}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <button onClick={playAiMove} className="make-move">
          Хід ШІ
        </button>
        <HandRoma hand={hand} />
      </DragDropContext>
    </div>
  );
}
