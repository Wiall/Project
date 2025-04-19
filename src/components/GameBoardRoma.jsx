import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import HandRoma from './HandRoma';

const initialCards = [
    { id: 'card-1', content: '🂡' },
    { id: 'card-2', content: '🂢' },
    { id: 'card-3', content: '🂣' },
    { id: 'card-4', content: '🂤' },
];

export default function GameBoardRoma() {
    const [hand, setHand] = useState(initialCards);
    const [cards, setCards] = useState([]);
    const [movingCard, setMovingCard] = useState(null);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceList = source.droppableId === 'hand' ? hand : cards;
        const movedCard = sourceList[source.index];
        const newSourceList = [...sourceList];
        newSourceList.splice(source.index, 1);

        if (source.droppableId === 'hand' && destination.droppableId === 'hand') {
            const updatedHand = [...newSourceList];
            updatedHand.splice(destination.index, 0, movedCard);
            setHand(updatedHand);
            return;
        }

        if (source.droppableId === 'hand' && destination.droppableId === 'drop-area') {
            setHand(newSourceList);
            setMovingCard(movedCard);
            setTimeout(() => {
                setCards((prev) => [...prev, movedCard]);
                setMovingCard(null);
            }, 500);
            return;
        }

        if (source.droppableId === 'drop-area' && destination.droppableId === 'hand') {
            setCards(newSourceList);
            const updatedHand = [...hand];
            updatedHand.splice(destination.index, 0, movedCard);
            setHand(updatedHand);
        }
    };

    return (
        <div className="game-container">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="blocks-container">
                    {/* Блок з уже викладеними картами*/}
                    <div className="cards">
                        {cards.map((card) => (
                            <div className={`cardd ${card.id}`} key={card.id}>
                                {card.content}
                            </div>
                        ))}
                    </div>

                    {/* Зона сброса */}
                    <Droppable droppableId="drop-area" direction="horizontal">
                        {(provided) => (
                            <div
                                className="drop-area"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {movingCard && (
                                    <div className={`cardd card-moving ${movingCard.id}`}>
                                        {movingCard.content}
                                    </div>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                <HandRoma hand={hand} />
            </DragDropContext>
        </div>
    );
}
