import React, { useState } from "react";
import "./ShopPage.css";

export default function ShopPage() {
  const [gold, setGold] = useState(1200);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [selectedPack, setSelectedPack] = useState(null);

  const [isOpening, setIsOpening] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [openedCards, setOpenedCards] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showAllCards, setShowAllCards] = useState(false);

  const cardPool = {
    common: [
      { name: "Goblin Scout", image: "/sprites/cards/sun_paladin.png" },
      { name: "Wood Elf", image: "/sprites/cards/sun_paladin.png" },
      { name: "Skeleton Warrior", image: "/sprites/cards/sun_paladin.png" },
    ],
    rare: [
      { name: "Fire Mage", image: "/sprites/cards/sun_paladin.png" },
      { name: "Ice Archer", image: "/sprites/cards/sun_paladin.png" },
    ],
    epic: [
      { name: "Dragon Rider", image: "/sprites/cards/sun_paladin.png" },
    ],
    legendary: [
      { name: "Phoenix Lord", image: "/sprites/cards/sun_paladin.png" },
    ],
  };

  const packs = [
    {
      id: 1,
      name: "Starter Pack",
      description: "5 random basic cards",
      price: 100,
      image: "/sprites/starter-pack.png",
      dropInfo: [
        { type: "Common", chance: "70%" },
        { type: "Rare", chance: "25%" },
        { type: "Epic", chance: "5%" },
      ],
    },
    {
      id: 2,
      name: "Legendary Chest",
      description: "Guaranteed legendary card",
      price: 500,
      image: "/sprites/starter-pack.png",
      dropInfo: [
        { type: "Legendary", chance: "100%" },
      ],
    },
  ];

  function handleBuy(pack) {
    if (gold >= pack.price) {
      setGold(prev => prev - pack.price);
      setIsOpening(true);
      setShowModal(true);
      setModalType('opening');

      setTimeout(() => setShowMagic(true), 500);
      setTimeout(() => {
        setShowMagic(false);
        setIsOpening(false);
        setShowCards(true);
        generateDrop(pack);
      }, 2000);
    } else {
      alert("Not enough gold!");
    }
  }

  function handleInfo(pack) {
    setSelectedPack(pack);
    setModalType("info");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setIsOpening(false);
    setShowMagic(false);
    setShowCards(false);
    setOpenedCards([]);
    setActiveCardIndex(0);
    setShowAllCards(false);
  }

  function getRandomCard(rarity) {
    const cards = cardPool[rarity];
    return cards[Math.floor(Math.random() * cards.length)];
  }

  function generateDrop(pack) {
    const newCards = [];
    if (pack.name === "Starter Pack") {
      for (let i = 0; i < 5; i++) {
        const rand = Math.random();
        if (rand < 0.05) newCards.push({ ...getRandomCard("epic"), rarity: "epic" });
        else if (rand < 0.30) newCards.push({ ...getRandomCard("rare"), rarity: "rare" });
        else newCards.push({ ...getRandomCard("common"), rarity: "common" });
      }
    } else if (pack.name === "Legendary Chest") {
      newCards.push({ ...getRandomCard("legendary"), rarity: "legendary" });
    }
    setOpenedCards(newCards);
  }

  function handleNextCard() {
    if (activeCardIndex < openedCards.length - 1) {
      setActiveCardIndex(prev => prev + 1);
    } else {
      setShowAllCards(true);
    }
  }

  return (
    <div className="shop-container">
      <div className="gold-display">
        Gold: {gold} <img src="/sprites/coin.png" alt="coin" className="coin-icon animated-coin" />
      </div>

      <div className="shop-header">
        <h1>Welcome to the Market</h1>
      </div>

      <div className="product-grid">
        {packs.map(pack => (
          <div key={pack.id} className="product-card">
            <div className="product-top">
              <img src={pack.image} alt={pack.name} className="product-image" />
              <button className="info-button" onClick={() => handleInfo(pack)}>?</button>
            </div>
            <h3>{pack.name}</h3>
            <p>{pack.description}</p>
            <div className="price">
              <img src="/sprites/coin.png" alt="coin" className="coin-icon" /> {pack.price}
            </div>
            <button className="buy-btn" onClick={() => handleBuy(pack)}>Buy</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>

            {modalType === "info" && selectedPack && (
              <>
                <h2 className="modal-title">Drop Chances</h2>
                <ul className="drop-list">
                  {selectedPack.dropInfo.map((item, index) => (
                    <li key={index}><span>{item.type}:</span> {item.chance}</li>
                  ))}
                </ul>
                <button className="cancel-btn" onClick={closeModal}>Close</button>
              </>
            )}

            {modalType === "opening" && (
              <>
                {isOpening && <div className="opening-animation"><p>Opening Pack...</p></div>}
                {showMagic && <div className="magic-explosion"></div>}
                
                {showCards && !showAllCards && (
                  <div className="single-card-drop">
                    <img
                      key={activeCardIndex}
                      src={openedCards[activeCardIndex]?.image}
                      alt={openedCards[activeCardIndex]?.name}
                      className="drop-card-image"
                    />
                    <p className={`rarity-text ${openedCards[activeCardIndex]?.rarity}`}>
                      {openedCards[activeCardIndex]?.name}
                    </p>
                    <button className="next-btn" onClick={handleNextCard}>
                      {activeCardIndex === openedCards.length - 1 ? "Finish" : "Next"}
                    </button>
                  </div>
                )}

                {showAllCards && (
                  <>
                    <h2 className="modal-title">Your Drops</h2>
                    <div className="cards-row">
                      {openedCards.map((card, idx) => (
                        <div
                          key={idx}
                          className="card-drop animated-card"
                          style={{ animationDelay: `${idx * 0.2}s` }}
                        >
                          <img src={card.image} alt={card.name} className="drop-card-image-small" />
                          <p className={`rarity-text ${card.rarity}`}>{card.name}</p>
                        </div>
                      ))}
                    </div>
                    <button className="cancel-btn" onClick={closeModal}>Close</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
);
}
