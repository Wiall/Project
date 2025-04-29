import React, { useEffect } from "react";
import "./About.css";
import Navbar from "../../components/Navbar/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../../components/Footer/Footer";

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

function TeamCard({ member, index }) {
  return (
    <div
      className="about-card"
      data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
    >
      <div className="cat-image">
        <img src={member.image} alt={member.name} />
      </div>
      <div className="quote-block">
        <p className="quote">{member.quote}</p>
        <p className="roles">{member.role}</p>
        <div className="name-tag"><span>{member.name}</span></div>
      </div>
    </div>
  );
}


function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,
      easing: 'ease-in-out',
      offset: 200});
  }, []);
  return (
    <>
    <Navbar/>
    <div className="about-page">
      <div className="project-description">
      <h1 data-aos="zoom-in" data-aos-duration="1000">Echoes of Darkness</h1>
        <div className="section left-text" data-aos="fade-right">
        <div className="text">
          <p className="project-lead">
            Echoes of Darkness is a <span className="highlight">web-based collectible card game</span> set in a 
            rich, immersive <span className="highlight">fantasy world</span>.
          </p>
          <p className="project-desc">
            Step into a realm of <span className="emphasis">epic battles</span> where players from around 
            the globe clash in a test of <span className="emphasis">wit, strength, and spirit</span>.
          </p>
        </div>
          <div className="image" data-aos="zoom-in">
            <img src="/sprites/Sun_paladin.png" alt="Intro" />
          </div>
        </div>

      <div className="section right-text" data-aos="fade-left">
        <div className="text">
          <p className="project-lead">
            Build <span className="emphasis">powerful decks</span>, master <span className="emphasis">unique strategies</span>, and prove your worth..
          </p>
          <p className="project-desc">
            This project is brought to life by a passionate group of <span className="highlight">university students</span> who believe in crafting extraordinary experiences.
          </p>
        </div>
        <div className="image" data-aos="zoom-in">
          <img src="/sprites/Battle_standard.png" alt="Battle" />
        </div>
      </div>
      <div className="section left-text" data-aos="fade-right">
          <div className="text">
          <p className="project-lead">
            Also inspired and developed in the name of <span className="highlight">Almighty Gwent</span>. 
          </p>
          </div>
          <div className="image" data-aos="zoom-in">
            <img src="/sprites/Gwint.jpg" alt="Intro" />
          </div>
        </div>
    </div>
    <div className="section-divider" data-aos="fade-up">
      <h2>Meet the Team</h2>
    </div>
    <div className="team-grid">
        {team.map((member, index) => (
        <TeamCard key={index} member={member} index={index} />
      ))}
    </div>
    </div>
    <Footer/>
    </>
  );
}

export default About;
