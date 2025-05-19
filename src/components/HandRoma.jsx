import CardRoma from "./CardRoma";

export default function HandRoma({ hand, onCardClick, selectedCard }) {
  return (
    <div
      className="hand-zone"
      style={{ display: "flex", justifyContent: "center", gap: "10px" }}
    >
      <div className="hand-container" style={{ display: "flex" }}>
        {hand.map((card) => (
          <div
            key={card.id}
            style={{
              transform:
                selectedCard?.id === card.id ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
          >
            <CardRoma card={card} onClick={onCardClick} />
          </div>
        ))}
      </div>
    </div>
  );
}
