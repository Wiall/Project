import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

export default function CardRoma({ card, index }) {
    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided) => (
                <div
                    className={`cardd ${card.id}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {card.content}
                </div>
            )}
        </Draggable>
    );
}
