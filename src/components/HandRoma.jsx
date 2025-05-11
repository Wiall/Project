export default function HandRoma({ hand, onCardClick }) {
  return (
    <div className="hand-zone">
      <div className="hand-container" style={{ display: "flex" }}>
        {hand.map((card) => (
          <CardRoma key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
