import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import CardRoma from "./CardRoma";

export default function HandAI({ aiHand, disappearingCardId }) {
  return (
    <Droppable droppableId="aiHand" direction="horizontal">
      {(provided) => (
        <div
          className="ai-hand-zone"
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            display: "flex",
            "flex-direction": "row",
            "justify-content": "center",
            "flex-wrap": "nowrap",
            gap: "0px",
          }}
        >
          <div className="ai-hand-container" style={{ display: "flex" }}>
            {aiHand.map((card, index) => (
              <CardRoma
                key={card.id}
                card={card}
                index={index}
                isDisappearing={disappearingCardId === card.id}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
