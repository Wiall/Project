import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import HandRoma from './HandRoma';

const initialCards = [
    { id: 'card-1', content: 'card-1' },
    { id: 'card-2', content: 'card-2' },
    { id: 'card-3', content: 'card-3' },
    { id: 'card-4', content: 'card-4' },
];

export default function GameBoardRoma() {
    const [hand, setHand] = useState(initialCards);
    const [cards1, setCards1] = useState([]);
    const [cards2, setCards2] = useState([]);
    const [cards3, setCards3] = useState([]);
    const [cards4, setCards4] = useState([]);
    const [animatingCard, setAnimatingCard] = useState(null); // Карта, яка анімується

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Визначаємо звідки перетягуємо карту
        const sourceList =
            source.droppableId === 'hand' ? hand :
                source.droppableId === 'cards-1' ? cards1 :
                    source.droppableId === 'cards-2' ? cards2 :
                        source.droppableId === 'cards-3' ? cards3 :
                            source.droppableId === 'cards-4' ? cards4 :
                                [];

        const movedCard = sourceList[source.index];
        const newSourceList = [...sourceList];
        newSourceList.splice(source.index, 1); // Видаляємо карту з початкового місця

        // Переміщуємо карту у відповідний блок
        if (source.droppableId === 'hand' && destination.droppableId === 'drop-area-1') {
            setHand(newSourceList);
            setCards1((prev) => [...prev, movedCard]);
        }

        if (source.droppableId === 'hand' && destination.droppableId === 'drop-area-2') {
            setHand(newSourceList);
            setCards2((prev) => [...prev, movedCard]);
        }

        if (source.droppableId === 'hand' && destination.droppableId === 'drop-area-3') {
            setHand(newSourceList);
            setCards3((prev) => [...prev, movedCard]);
        }

        if (source.droppableId === 'hand' && destination.droppableId === 'drop-area-4') {
            setHand(newSourceList);
            setCards4((prev) => [...prev, movedCard]);
        }
    };

    const handleFakeDrop = (targetBlock) => {
        if (hand.length === 0) return;

        const movedCard = hand[0];
        setAnimatingCard({ ...movedCard, targetBlock }); // Запускаємо анімацію

        // Через 500ms видаляємо карту з руки і додаємо у блок
        setTimeout(() => {
            if (targetBlock === 'cards-3') {
                setCards3((prev) => [...prev, movedCard]);
            } else if (targetBlock === 'cards-4') {
                setCards4((prev) => [...prev, movedCard]);
            }
            setHand((prev) => prev.slice(1)); // Видаляємо з руки
            setAnimatingCard(null);
        }, 500);
    };

    return (
        <div className="game-container">
            <DragDropContext onDragEnd={onDragEnd}>
                {/* Блоки 3 і 4 (кнопки) */}
                <div className="blocks-container">
                    <div className="cards">
                        {cards3.map((card) => (
                            <div className={`cardd ${card.id}`} key={card.id}>
                                {card.content}
                            </div>
                        ))}
                        {/* Анімована копія карти */}
                        {animatingCard?.targetBlock === 'cards-3' && (
                            <div className="cardd card-appearing" key={`anim-${animatingCard.id}`}>
                                {animatingCard.content}
                            </div>
                        )}
                    </div>
                    <div className="drop-area borderless">
                        <button onClick={() => handleFakeDrop('cards-3')}>
                            Додати карту в блок 3
                        </button>
                    </div>
                </div>

                <div className="blocks-container">
                    <div className="cards">
                        {cards4.map((card) => (
                            <div className={`cardd ${card.id}`} key={card.id}>
                                {card.content}
                            </div>
                        ))}
                        {/* Анімована копія карти */}
                        {animatingCard?.targetBlock === 'cards-4' && (
                            <div className="cardd card-appearing" key={`anim-${animatingCard.id}`}>
                                {animatingCard.content}
                            </div>
                        )}
                    </div>
                    <div className="drop-area borderless">
                        <button onClick={() => handleFakeDrop('cards-4')}>
                            Додати карту в блок 4
                        </button>
                    </div>
                </div>

                {/* Блоки 1 і 2 (можна перетягувати) */}
                <div className="blocks-container">
                    <div className="cards">
                        {cards1.map((card) => (
                            <div className={`cardd ${card.id}`} key={card.id}>
                                {card.content}
                            </div>
                        ))}
                    </div>
                    <Droppable droppableId="drop-area-1" direction="horizontal">
                        {(provided) => (
                            <div
                                className="drop-area"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                <div className="blocks-container">
                    <div className="cards">
                        {cards2.map((card) => (
                            <div className={`cardd ${card.id}`} key={card.id}>
                                {card.content}
                            </div>
                        ))}
                    </div>
                    <Droppable droppableId="drop-area-2" direction="horizontal">
                        {(provided) => (
                            <div
                                className="drop-area"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                {/* Рука з картами (карта, яка зникає) */}
                <HandRoma
                    hand={hand}
                    disappearingCardId={animatingCard?.id}
                />
            </DragDropContext>
        </div>
    );
}