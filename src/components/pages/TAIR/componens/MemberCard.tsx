// src/components/MemberCard.tsx (VERIFIED STRUCTURE)
import React from 'react';
import type { TeamMember } from '../types/data';

interface MemberCardProps {
  member: TeamMember;
}

// Function to select an icon based on role
const getIconForRole = (role: string) => {
    switch (role) {
        case 'Faculty Coordinator':
            return '🎯'; 
        case 'Core Team':
            return '👤'; 
        case 'Venue':
            return '📍';
        default:
            return '👤';
    }
};

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
    const showEmail = member.email;
    const showPhone = member.phone;
    
    // Logic to determine if we show a custom image or an icon placeholder
    const isIconPlaceholder = !member.image && (member.role.includes('Faculty') || member.role.includes('Core Team') || member.role.includes('Venue'));
    const icon = getIconForRole(member.role);

    return (
        <div className="neon-card member-card">
            
            {/* Image or Icon Placeholder - THIS SECTION MUST BE CORRECT */}
            {member.image ? (
                // --- OC Member Card (Image uses .member-image class) ---
                <img 
                    src={member.image} 
                    alt={member.name} 
                    className="member-image" 
                />
            ) : isIconPlaceholder ? (
                // --- Faculty/Other Card (Icon uses .member-icon-placeholder class) ---
                <div className="member-icon-placeholder">
                    {icon}
                </div>
            ) : null}

            {/* Name text is placed below the image/icon element */}
            <h4>{member.name}</h4>

            {member.subRole && (
                <div className="member-tag">
                    {member.subRole}
                </div>
            )}
            
            {/* ... rest of the card details ... */}

            {member.duty && (
                <div className="member-contact duty">
                    <span className="contact-icon">🎯</span>
                    {member.duty}
                </div>
            )}

            {showPhone && (
                <div className="member-contact phone">
                    <span className="contact-icon">📞</span>
                    <a href={`tel:${member.phone}`}>{member.phone}</a>
                </div>
            )}

            {showEmail && (
                <div className="member-contact email">
                    <span className="contact-icon">📧</span>
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                </div>
            )}
        </div>
    );
};

export default MemberCard;