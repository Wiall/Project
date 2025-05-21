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


  const [isOpening, setIsOpening] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const [drop, setDrop] = useState(null)


  useEffect(() => {
    (async () => {
      const res = await api.get("/api/container");
      setContainers(res.data);
    })();
  }, []);

  async function handleInfo(pack) {

    setSelectedPack(pack);
    setModalType("info");
    setShowModal(true);

    try {
      const res = await api.get(`/api/container/${pack.id}/drops`);
      console.log(res.data);
      setDrop(res.data);
    } catch (err) { }
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
      const dropRes = await api.post(`/api/container/${pack.id}/open`);
      setDrop(dropRes.data);
    }, 2000);
  }

  function closeModal() {
    setShowModal(false);
    setIsOpening(false);
    setShowMagic(false);
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
                  src="/sprites/starter-pack.png"
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
                    {drop.map((d) => (
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
                        src={`${API_URL}${drop.imageUrl}`}
                        alt={drop.name}
                        width={200}
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
                        onClick={closeModal}
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