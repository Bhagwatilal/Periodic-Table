
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  category: string;
  group: number;
  period: number;
  block: string;
  state: string;
  description: string;
}

interface ElementCardProps {
  element: Element;
  onSelect: (element: Element) => void;
  isFollowCursor: boolean;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const getCategoryColor = (category: string) => {
    // More vibrant colors based on the image reference
    switch(category) {
      case 'alkali-metal': return '#FF4365'; // Bright red
      case 'alkaline-earth-metal': return '#FFD23F'; // Bright yellow
      case 'transition-metal': return '#1D87E4'; // Bright blue (user experience)
      case 'post-transition-metal': return '#FF8C42'; // Bright orange (visual design)
      case 'metalloid': return '#E2F0CB'; // Soft green (code quality)
      case 'nonmetal': return '#9F5EDF'; // Purple (functionality)
      case 'halogen': return '#B54AC0'; // Bold purple
      case 'noble-gas': return '#FFB0B0'; // Soft pink
      case 'lanthanide': return '#30AADD'; // Sky blue
      case 'actinide': return '#284C7E'; // Dark blue
      default: return '#ADB5BD'; // Gray
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;
    
    card.style.transform = `rotate3d(1, 1, 0, 30deg)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotate3d(0, 0, 0, 0deg)';
    }
  };

  const bgColor = getCategoryColor(element.category);

  return (
    <div className="parent" style={{ 
      gridColumn: element.group,
      gridRow: element.period,
      width: '100%',
      height: '100%',
      perspective: '1000px',
      maxWidth: '100px',
      maxHeight: '100px',
    }}>
      <div
        ref={cardRef}
        className="card"
        style={{
          background: bgColor,
          height: '100%',
          borderRadius: '12px',
          transition: 'all 0.5s ease-in-out',
          transformStyle: 'preserve-3d',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(element)}
      >
        <div className="glass" style={{
          transformStyle: 'preserve-3d',
          position: 'absolute',
          inset: '3px',
          borderRadius: '10px',
          borderTopRightRadius: '50%',
          background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.6) 100%)',
          transform: 'translate3d(0px, 0px, 10px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
          transition: 'all 0.5s ease-in-out',
        }}></div>
        
        <div className="logo" style={{
          position: 'absolute',
          right: '0',
          top: '0',
          transformStyle: 'preserve-3d',
        }}>
          <span className="circle circle5" style={{
            display: 'block',
            position: 'absolute',
            aspectRatio: '1',
            borderRadius: '50%',
            top: '3px',
            right: '3px',
            width: '20px',
            transform: 'translate3d(0, 0, 15px)',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(5px)'
          }}>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 'bold',
              color: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              textShadow: '0 1px 1px rgba(0,0,0,0.3)'
            }}>{element.atomicNumber}</span>
          </span>
        </div>
        
        <div className="content" style={{
          padding: '22px 10px 0px 10px',
          transform: 'translate3d(0, 0, 15px)',
          textAlign: 'center',
        }}>
          <span className="title" style={{
            display: 'block',
            color: '#FFFFFF',
            fontWeight: '900',
            fontSize: '18px',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)'
          }}>{element.symbol}</span>
          
          <span className="text" style={{
            display: 'block',
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '9px',
            marginTop: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: '0 1px 1px rgba(0,0,0,0.3)'
          }}>{element.name}</span>
          
          {isHovered && (
            <div className="mt-1 text-xs animate-fade-in" style={{ fontSize: '8px', color: '#FFFFFF' }}>
              <p>{element.atomicMass}</p>
              <p className="capitalize">{element.category.replace('-', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementCard;
