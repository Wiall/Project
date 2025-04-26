// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import "./ProfilePage.css";

const availableAvatars = [
  "/sprites/cards/sun_paladin.png",
  "/sprites/cards/sun_paladin.png",
  "/sprites/cards/sun_paladin.png",
  "/sprites/cards/sun_paladin.png",
];

export default function ProfilePage() {
  const [username, setUsername] = useState("Username");
  const [email] = useState("user@example.com"); 
  const [avatar, setAvatar] = useState(availableAvatars[0]);
  const [bio, setBio] = useState("Brave adventurer...");

  const [isEditing, setIsEditing] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const [editUsername, setEditUsername] = useState(username);
  const [editAvatar, setEditAvatar] = useState(avatar);
  const [editBio, setEditBio] = useState(bio);
  const [displayedBio, setDisplayedBio] = useState(bio);
  const [isTyping, setIsTyping] = useState(false);

  const [selectedBorder, setSelectedBorder] = useState("default");
  const [editBorder, setEditBorder] = useState(selectedBorder);



  function handleSave() {
    setUsername(editUsername);
    setAvatar(editAvatar);
    setSelectedBorder(editBorder);
    setBio(editBio);
    animateBio(editBio);
    handleClose();
  }
  

  function handleClose() {
    setFadeOut(true);
    setTimeout(() => {
      setIsEditing(false);
      setFadeOut(false);
    }, 300);
  }

  function handleAvatarSelect(selectedAvatar) {
    setEditAvatar(selectedAvatar);
  }

  function animateBio(text) {
    setDisplayedBio(""); 
    setIsTyping(true); 
    let index = -1;
    const interval = setInterval(() => {
      setDisplayedBio((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 80);
  }
  

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-card">
        <img src={avatar} alt="avatar" className={`profile-avatar ${selectedBorder}`} />
        <h3 className="username-glow">{username}</h3>
        <p className="email-text email-glow">{email}</p>
        <p className="bio-text bio-pulse">
          {displayedBio}
          {isTyping && <span className="typing-cursor">|</span>}
        </p>
        <div className="profile-xp">
          <span className="level-pulse">Level 5</span>
          <div className="xp-bar">
            <div className="xp-fill">
              <div className="xp-shine"></div> 
            </div>
          </div>
        </div>
        <button className="profile-btn" onClick={() => {
          setEditUsername(username);
          setEditAvatar(avatar);
          setEditBio(bio);
          setIsEditing(true);
        }}>
          Edit Profile
        </button>
        <button className="logout-btn">Logout</button>
      </div>

      {isEditing && (
        <div className={`modal-backdrop ${fadeOut ? "fade-out" : ""}`}>
          <div className="modal">
            <h3>Edit Profile</h3>

            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              placeholder="Username"
              maxLength={20}
            />

            <textarea
              value={editBio}
              onChange={(e) => {
                if (e.target.value.length <= 150) setEditBio(e.target.value);
              }}
              placeholder="About me..."
              className="bio-input"
            />
            <small>{150 - editBio.length} characters remaining</small>

            <div className="avatar-selection">
              {availableAvatars.map((ava) => (
                <img
                  key={ava}
                  src={ava}
                  alt="Available Avatar"
                  className={`avatar-option ${editAvatar === ava ? "selected" : ""}`}
                  onClick={() => handleAvatarSelect(ava)}
                />
              ))}
            </div>
            <div className="border-selection">
              {["default", "gold", "silver", "dark"].map((border) => (
                <div
                  key={border}
                  className={`border-option ${editBorder === border ? "selected" : ""} ${border}`}
                  onClick={() => setEditBorder(border)}
                >
                  {border.charAt(0).toUpperCase() + border.slice(1)}
                </div>
              ))}
            </div>
            

            <button className="profile-btn" onClick={handleSave}>Save</button>
            <button className="logout-btn" onClick={handleClose}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
