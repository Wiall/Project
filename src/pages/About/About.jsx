import React from "react";
import "./About.css";
import Navbar from "../../components/Navbar/Navbar";

const team = [
  {
    name: "ARTUR",
    role: "Project Manager, Product Manager",
    quote: "Звичайно, ми все встигнемо... напевно...",
    image: "/sprites/artur.jpg"
  },
  {
    name: "ANASTASIA",
    role: "FrontEnd Developer",
    quote: "Так, звичайно я зсуну все на 2 пікселі вправо...",
    image: "/sprites/artur.jpg"
  },
  {
    name: "YULIIA",
    role: "Designer",
    quote: "Дизайн - це не те, як виглядає, а те, як працює",
    image: "/sprites/artur.jpg"
  },
  {
    name: "ANDRII",
    role: "BackEnd Developer",
    quote: "Код має говорити сам за себе, а не кричати про допомогу",
    image: "/sprites/artur.jpg"
  },
  {
    name: "YAROSLAV",
    role: "Tester",
    quote: "Якщо все йде добре - значить щось не добре",
    image: "/sprites/artur.jpg"
  },
  {
    name: "ILLIA",
    role: "FrontEnd Developer",
    quote: "Ви ж казали проект на джаві...",
    image: "/sprites/artur.jpg"
  },
  {
    name: "ROMAN",
    role: "BlackEnd Developer",
    quote: "Воно придумається, коли придумається і тільки тоді",
    image: "/sprites/artur.jpg"
  },
];

function TeamCard({ member }) {
  return (
    <div className="about-card">
      <div className="cat-image"><img src={member.image} alt={member.name}/></div>
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
    <>
    <Navbar/>
    <div className="about-page">
      {team.map((member, index) => (
        <TeamCard key={index} member={member} />
      ))}
    </div>
    </>
  );
}

export default About;
