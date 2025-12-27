import React from 'react';
import type { TeamMember } from '../types/data';
import { User, MapPin, Target, Phone, Mail } from 'lucide-react';

interface MemberCardProps {
  member: TeamMember;
}

// Function to select an icon based on role
const getIconForRole = (role: string) => {
    switch (role) {
        case 'Faculty Coordinator':
            return <Target />;
        case 'Core Team':
            return <User />;
        case 'Venue':
            return <MapPin />;
        default:
            return <User />;
    }
};

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
    const showEmail = member.email;
    const showPhone = member.phone;

    const isIconPlaceholder =
        !member.image &&
        (member.role.includes('Faculty') ||
         member.role.includes('Core Team') ||
         member.role.includes('Venue'));

    return (
        <div className="neon-card member-card">
            
            {member.image ? (
                <img 
                    src={member.image} 
                    alt={member.name} 
                    className="member-image" 
                />
            ) : isIconPlaceholder ? (
                <div className="member-icon-placeholder">
                    {React.cloneElement(getIconForRole(member.role), {
                        size: 48,
                        className: "contact-icon"
                    })}
                </div>
            ) : null}

            <h4>{member.name}</h4>

            {member.subRole && (
                <div className="member-tag">
                    {member.subRole}
                </div>
            )}

            {member.duty && (
                <div className="member-contact duty">
                    <Target size={17} className="contact-icon" />
                    {member.duty}
                </div>
            )}

            {showPhone && (
                <div className="member-contact phone">
                    <Phone size={17} className="contact-icon" />
                    <a href={`tel:${member.phone}`}>{member.phone}</a>
                </div>
            )}

            {showEmail && (
                <div className="member-contact email">
                    <Mail size={17} className="contact-icon" />
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                </div>
            )}

        </div>
    );
};

export default MemberCard;
