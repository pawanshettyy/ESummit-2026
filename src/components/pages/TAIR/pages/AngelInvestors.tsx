// src/pages/angelInvestors.tsx
import React, { useEffect, useState } from 'react';
import MemberCard from '../componens/MemberCard';
import AboutSectionContent from '../componens/AboutSection';
import { Calendar, Clock, MapPin } from 'lucide-react';
import BenefitsComponent from '../componens/BenefitsComponents';

import '../styles/design.css';

import {
  organizingCommittee,
  eventVenue,
  eventBenefits,
  eventListings,
  facultyCoordinators,
  coreTeam
} from '../data/teamData';

import type {  TeamMember } from '../types/data';

/* ------------------ Scroll Reveal ------------------ */
const useRevealAnimation = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.section-container');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
};

/* ------------------ Benefit Card ------------------ */


/* ------------------ Faculty Section ------------------ */
const FacultySection: React.FC<{ 
  title: string; 
  members: TeamMember[];
  activeId: string | null;
  onCardClick: (id: string) => void;
}> = ({ title, members, activeId, onCardClick }) => (
  <section className="section-container section-faculty">
    <div className="section-label">Faculty Guidance</div>
    <h2 className="section-title">{title}</h2>
    <div className="team-grid two-column-grid">
      {members.map((m, i) => {
        const id = `faculty-${i}`;
        return (
          <div 
            key={m.name} 
            onClick={() => onCardClick(id)}
            className={activeId === id ? 'clicked' : ''}
          >
            <MemberCard member={m} />
          </div>
        );
      })}
    </div>
  </section>
);

/* ================== MAIN PAGE ================== */
const AngelInvestorsPage: React.FC = () => {
  useRevealAnimation();
  const mainEvent = eventListings[0];

  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setClickedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="event-page-container">

      {/* HERO */}
      <section className="section-container hero-section">
        <p className="event-tag">{mainEvent.tag}</p>
        <h1 className="main-event-title glow-red-title">{mainEvent.title}</h1>
        <p className="event-description-text">{mainEvent.description}</p>
        <div className="event-details">
  <span>
    <Calendar size={17} className="event-icon" />
    {mainEvent.date}
  </span>

  <span>
    <Clock size={17} className="event-icon" />
    {mainEvent.time}
  </span>

  <span>
    <MapPin size={17} className="event-icon" />
    {mainEvent.location}
  </span>
</div>

        <button className="register-button">Register Now →</button>
      </section>

      {/* ABOUT */}
      <section className="section-container section-about">
        <AboutSectionContent />
      </section>

      {/* SPEAKERS */}
      <section className="section-container section-speakers">
        <div className="section-label">Expert Panel</div>
        <h2 className="section-title">Speakers & Judges</h2>
        <h3 className="announcement">Will be announced soon</h3>
        <p className="stay-tuned-text">
          Stay tuned for updates on our expert panel of industry leaders and successful entrepreneurs
        </p>
      </section>

      {/* BENEFITS */}
      <section className="section-container section-benefits">
        <div className="section-label">Benefits</div>
        <h2 className="section-title">Why Participate?</h2>
        <BenefitsComponent benefits={eventBenefits} />
      </section>

      {/* ORGANIZING COMMITTEE */}
      <section className="section-container section-oc">
        <div className="section-label">Contacts</div>
        <h2 className="section-title">Organizing Committee</h2>
        <div className="single-flex-row">
          {organizingCommittee.map((m, i) => {
            const id = `oc-${i}`;
            return (
              <div 
                key={m.name} 
                onClick={() => handleCardClick(id)}
                className={clickedId === id ? 'clicked' : ''}
              >
                <MemberCard member={m} />
              </div>
            );
          })}
        </div>
      </section>

      {/* FACULTY */}
      <FacultySection 
        title="Faculty Coordinators" 
        members={facultyCoordinators} 
        activeId={clickedId}
        onCardClick={handleCardClick}
      />

      {/* VENUE */}
      <section className="section-container section-venue">
        <div className="section-label">Location</div>
        <h2 className="section-title">Event Venue</h2>
        <div 
          className={`neon-card venue-card ${clickedId === 'venue' ? 'clicked' : ''}`}
          onClick={() => handleCardClick('venue')}
        >
          <span>
    <MapPin size={40} className="event-icon" />
      </span>
          <h4>{eventVenue.name}</h4>
          <p>{eventVenue.addressLine1}</p>
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="section-container section-core">
        <div className="section-label">Leadership</div>
        <h2 className="section-title">Core Team</h2>
        <div className="team-grid three-column-grid">
          {coreTeam.map((m, i) => {
            const id = `core-${i}`;
            return (
              <div 
                key={m.name} 
                onClick={() => handleCardClick(id)}
                className={clickedId === id ? 'clicked' : ''}
              >
                <MemberCard member={m} />
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default AngelInvestorsPage;
