import React from 'react';
import type { Benefit } from '../types/data';
import { Lightbulb, Award, Sparkles, Rocket } from 'lucide-react';

const iconMap = {
  Lightbulb: Lightbulb,
  Award: Award,
  Sparkles: Sparkles,
  Rocket: Rocket,
};

const BenefitsComponent: React.FC<{ benefits: Benefit[] }> = ({ benefits }) => {
  return (
    <div className="benefits-row-grid">
      {benefits.map((b, i) => {
        const Icon = iconMap[b.icon as keyof typeof iconMap];
        return (
          <div key={i} className="benefit-card neon-card">
            <div className="benefit-icon">
              {Icon && <Icon size={45} />}
            </div>
            <h4>{b.title}</h4>
            <p>{b.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default BenefitsComponent;
