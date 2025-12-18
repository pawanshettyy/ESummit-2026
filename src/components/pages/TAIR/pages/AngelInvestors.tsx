// src/pages/EventPage.tsx (CORE TEAM SECTION REVERTED TO three-column-grid)
import React, { useEffect } from 'react';
import MemberCard from '../componens/MemberCard';
import AboutSectionContent from '../componens/AboutSection';

import { 
  organizingCommittee, 
  eventVenue, 
  eventBenefits, 
  eventListings, 
  facultyCoordinators,
  coreTeam // Core team data imported
} from '../data/teamData';
import type { Benefit, TeamMember } from '../types/data';

// =========================================================
// --- DOM-BASED SCROLL ANIMATION LOGIC ---
// =========================================================
const useRevealAnimation = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target); 
                    }
                });
            },
            { threshold: 0.25 }
        );

        document.querySelectorAll(".reveal").forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);
};

// --- Sub-Components ---
const BenefitCard: React.FC<{ benefit: Benefit }> = ({ benefit }) => (
    <div className="neon-card benefit-card">
        <div className="benefit-icon">{benefit.icon}</div>
        <h4>{benefit.title}</h4>
        <p>{benefit.description}</p>
      </div>
);

// Faculty section component includes the reveal classes
const FacultySection: React.FC<{ title: string, members: TeamMember[] }> = ({ title, members }) => (
    <div className="section-container reveal slide-in-up">
        <div className="section-label">Faculty Guidance</div>
        <h2 className="section-title">{title}</h2>
        <p className="description">Expert faculty members guiding our event success.</p>
        <div className="team-grid two-column-grid">
            {members.map(member => (
                <MemberCard key={member.name} member={member} /> 
            ))}
        </div>
    </div>
);


// =========================================================
// --- Main Event Page Component ---
// =========================================================
const EventPage: React.FC = () => {
  useRevealAnimation(); 
  
  const mainEvent = eventListings[0]; 
  const allFaculty = facultyCoordinators; 
  const allCoreTeam = coreTeam; // Using the simplified Core Team data

  const handleRegisterClick = () => {
    const aboutSection = document.getElementById('about-event');
    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="event-page-container">
        
        {/* 1. Event Brief / Hero Section */}
        <div className="section-container" id="hero-section" style={{ marginTop: '0px' }}>
            <header className="hero-section-content">
                <div className="top-title-wrapper">
                    <p className="event-tag">{mainEvent.tag}</p> 
                    <h1 className="main-event-title">{mainEvent.title}</h1>
                </div>
                
                <p className="event-description-text">
                    {mainEvent.description}
                </p> 
                
                <div className="event-details">
                  <p>📅 {mainEvent.date}</p>
                  <p>⏰ {mainEvent.time}</p> 
                  <p>📍 {mainEvent.location}</p>
                </div>
                
                <button 
                  className="register-button glow-button"
                  onClick={handleRegisterClick}
                >
                  Register Now →
                </button>
            </header>
        </div>

        {/* 2. About The Event */}
        <div className="section-container reveal slide-in-up" id="about-event"> 
            <AboutSectionContent />
        </div>

        {/* 3. Speakers & Judges Section */}
        <div className="section-container reveal slide-in-up">
          <div className="section-label">Expert Panel</div>
          <h2 className="section-title">Speakers & Judges</h2>
          <h3 className="announcement">Will be announced soon</h3>
          <p className="stay-tuned-text">Stay tuned for updates on our expert panel of industry leaders and successful entrepreneurs</p>
        </div>

        {/* 4. Perks of the event (Benefits) */}
        <div className="section-container reveal slide-in-up">
          <div className="neon-card consolidated-section">
            <div className="section-label">Benefits</div>
            <h2 className="section-title">Why Participate?</h2>
            <p className="description">Unlock exclusive opportunities and resources for your startup journey</p>
            <div className="benefits-grid two-column-grid"> 
              {eventBenefits.map((benefit, index) => (
                <BenefitCard key={index} benefit={benefit} />
              ))}
            </div>
          </div>
        </div>
        
        {/* 5. Organizing Committee */}
        <div className="section-container reveal slide-in-up">
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title">Organizing Committee</h2>
          <p className="description">Meet our dedicated team realizing event success</p>
          <div className="team-grid four-in-a-row-grid"> 
            {organizingCommittee.map(member => (
              <MemberCard key={member.name} member={member} /> 
            ))}
          </div>
        </div>
        
        {/* 6. Faculty Section */}
        <FacultySection 
            title="Faculty Coordinators" 
            members={allFaculty} 
        />
        
        {/* 7. Event Venue Information */}
        <div className="section-container reveal slide-in-up">
          <div className="section-label">Location</div>
          <h2 className="section-title">Event Venue</h2>
          <div className="neon-card venue-card">
            <div className="location-icon">📍</div> 
            <h4>{eventVenue.name}</h4>
            <p>{eventVenue.addressLine1}</p>
          </div>
        </div>
        
        {/* 8. Core Team (The section being updated) */}
        <div className="section-container reveal slide-in-up">
          <div className="section-label">Leadership Team</div>
          <h2 className="section-title">Core Team</h2>
          {/* *** CLASS NAME CHANGED BACK TO 'three-column-grid' *** */}
          <div className="team-grid three-column-grid"> 
            {allCoreTeam.map(member => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default EventPage;