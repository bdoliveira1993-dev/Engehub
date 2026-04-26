import React, { useState } from 'react';
import { EngineeringType } from '../types';
import {
  ChevronDown,
  HardHat,
  Zap,
  Settings,
  FlaskConical,
  Factory,
  Monitor,
  Leaf,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EngineeringSelectorProps {
  current: EngineeringType;
  onChange: (type: EngineeringType) => void;
}

const ICON_MAP: Record<EngineeringType, LucideIcon> = {
  [EngineeringType.CIVIL]: HardHat,
  [EngineeringType.ELECTRICAL]: Zap,
  [EngineeringType.MECHANICAL]: Settings,
  [EngineeringType.CHEMICAL]: FlaskConical,
  [EngineeringType.PRODUCTION]: Factory,
  [EngineeringType.COMPUTER]: Monitor,
  [EngineeringType.ENVIRONMENTAL]: Leaf,
};

const EngineeringSelector: React.FC<EngineeringSelectorProps> = ({ current, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = ICON_MAP[current] ?? HardHat;

  return (
    <div className="eng-selector">
      <button
        type="button"
        className={`eng-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="eng-trigger-icon" aria-hidden="true">
          <Icon size={14} />
        </span>
        <span className="eng-trigger-text">
          <span className="eng-trigger-label">Visão atual</span>
          <span className="eng-trigger-current">Eng. {current}</span>
        </span>
        <ChevronDown size={14} className="eng-trigger-chev" aria-hidden="true" />
      </button>

      {isOpen && (
        <>
          <div
            className="eng-menu-overlay"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="eng-menu" role="listbox">
            {Object.values(EngineeringType).map((type) => {
              const ItemIcon = ICON_MAP[type];
              const active = current === type;
              return (
                <button
                  type="button"
                  key={type}
                  className={`eng-option ${active ? 'active' : ''}`}
                  onClick={() => {
                    onChange(type);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={active}
                >
                  <ItemIcon size={16} aria-hidden="true" />
                  <span>Engenharia {type}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default EngineeringSelector;
