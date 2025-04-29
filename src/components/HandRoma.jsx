import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import CardRoma from './CardRoma';

export default function HandRoma({ hand, disappearingCardId }) {
    return (
        <Droppable droppableId="hand" direction="horizontal">
            {(provided) => (
                <div
                    className="hand-zone"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <div className="hand-container">
                        {hand.map((card, index) => (
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