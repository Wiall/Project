import { useContext, useEffect, useState } from "react";
import "./ShopPage.css";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../providers/AuthProvider";
import { api } from "../../api";
import toast from "react-hot-toast";
import { API_URL } from "../../constants";


export default function ShopPage() {
  const { user } = useContext(AuthContext);
  const [gold, setGold] = useState(user.currencyBalance);
  const [containers, setContainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [selectedPack, setSelectedPack] = useState(null);
  const [dropInfo, setDropInfo] = useState([]);

  const [isOpening, setIsOpening] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [openedCards, setOpenedCards] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showAllCards, setShowAllCards] = useState(false);
  const [drop, setDrop] = useState(null)


  useEffect(() => {
    (async () => {
      const res = await api.get("/container");
      setContainers(res.data);
    })();
  }, []);

  async function handleInfo(pack) {

    setSelectedPack(pack);
    setModalType("info");
    setShowModal(true);

    try {
      const res = await api.get(`/container/${pack.id}/drops`);
      console.log(res.data);
      setDrop(res.data);
    } catch (err) {
      console.error("Failed to load drops", err);
      setDropInfo([]);
    }
  }

  function handleBuy(pack) {
    if (gold < pack.price) {
      return toast.error('Not enough gold!')
    }

    setGold((g) => g - pack.price);
    setIsOpening(true);
    setModalType("opening");
    setShowModal(true);

    setTimeout(() => setShowMagic(true), 500);
    setTimeout(async () => {
      setShowMagic(false);
      setIsOpening(false);
      setShowCards(true);
      const dropRes = await api.post(`/container/${pack.id}/open`);
      setDrop(dropRes.data);
    }, 2000);
  }

  function closeModal() {
    setShowModal(false);
    setIsOpening(false);
    setShowMagic(false);
    setShowCards(false);
    setOpenedCards([]);
    setActiveCardIndex(0);
    setShowAllCards(false);
    setDropInfo([]);
  }

  function handleNextCard() {
    setDrop(null)
  }

  return (
    <div className="shop-wrapper">
      <Header />
      <div className="shop-container">
        <div className="gold-display">
          Gold: {gold}{" "}
          <img
            src="/sprites/coin.png"
            alt="coin"
            className="coin-icon animated-coin"
          />
        </div>

        <h1 className="shop-header">Welcome to the Market</h1>

        <div className="product-grid">
          {containers.map((pack) => (
            <div key={pack.id} className="product-card">
              <div className="product-top">
                <img
                  src="/sprites/cards/sun_paladin.png"
                  alt={pack.name}
                  className="product-image"
                />
                <button
                  className="info-button"
                  onClick={() => handleInfo(pack)}
                >
                  ?
                </button>
              </div>
              <h3>{pack.name}</h3>
              <p>{pack.description}</p>
              <div className="price">
                <img
                  src="/sprites/coin.png"
                  alt="coin"
                  className="coin-icon"
                />{" "}
                {pack.price}
              </div>
              <button className="buy-btn" onClick={() => handleBuy(pack)}>
                Buy
              </button>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              {modalType === "info" && selectedPack && (
                <>
                  <h2 className="modal-title">Drop Chances</h2>
                  <ul className="drop-list">
                    {dropInfo.map((d) => (
                      <li key={d.cardId}>
                        <strong>{d.card.name}:</strong>{" "}
                        {d?.dropChancePct}%
                      </li>
                    ))}
                  </ul>
                  <button className="cancel-btn" onClick={closeModal}>
                    Close
                  </button>
                </>
              )}

              {modalType === "opening" && (
                <>
                  {isOpening && (
                    <div className="opening-animation">
                      <p>Opening Pack...</p>
                    </div>
                  )}
                  {showMagic && (
                    <div className="magic-explosion"></div>
                  )}

                  {drop && (
                    <div className="single-card-drop">
                      <img
                        src={`http://localhost:3000${drop.imageUrl}`}
                        alt={drop.name}
                        className="drop-card-image"
                      />
                      <p
                        className={`rarity-text ${
                          drop.type.toLowerCase()
                        }`}
                      >
                        {drop.name}
                      </p>
                      <button
                        className="next-btn"
                        onClick={handleNextCard}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
