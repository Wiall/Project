import React from "react";
import "./About.css";

const team = [
  {
    name: "ARTUR",
    role: "Project Manager, Product Manager",
    quote: "Звичайно, ми все встигнемо... напевно...",
    image: "/sprites/artur.jpg"
  },
];

function TeamCard({ member }) {
  return (
    <div className="about-card">
      <div className="cat-image" style={{ backgroundImage: `url(${member.image})` }}></div>
      <div className="quote-block">
        <p className="quote">{member.quote}</p>
        <p className="roles">{member.role}</p>
        <div className="name-tag">{member.name}</div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="about-page">
      {team.map((member, index) => (
        <TeamCard key={index} member={member} />
      ))}
    </div>
  );
}

export default About;
