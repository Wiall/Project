import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

export default function CardRoma({ card, index, isDisappearing  }) {
    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided) => (
                <div
                    className={`cardd ${card.id} ${isDisappearing ? 'card-disappearing' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >

                    <img src={`${card.content}.png`} alt=""/>
                    <span className="stat-1">10</span>
                    <span className="stat-2">10</span>
                </div>
            )}
        </Draggable>
    );
}
