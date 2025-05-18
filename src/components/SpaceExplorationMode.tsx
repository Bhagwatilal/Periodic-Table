import React, { useState, useEffect, useRef } from 'react';
import { Element } from './ElementCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Rocket } from 'lucide-react';

interface SpaceExplorationModeProps {
  elements: Element[];
  isSpaceMode: boolean;
  toggleSpaceMode: () => void;
  onSelectElement: (element: Element) => void;
}

const SpaceExplorationMode: React.FC<SpaceExplorationModeProps> = ({
  elements,
  isSpaceMode,
  toggleSpaceMode,
  onSelectElement
}) => {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [visibleElements, setVisibleElements] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    if (!isSpaceMode) {
      setVisibleElements([]);
      setCurrentElementIndex(0);
      setScore(0);
      setGameStarted(false);
      return;
    }

    if (!gameStarted) return;

    // Start with only the first element visible
    setVisibleElements([0]);
    
    // Add new elements periodically
    const interval = setInterval(() => {
      setCurrentElementIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= elements.length) {
          clearInterval(interval);
          return prev;
        }
        
        setVisibleElements((prev) => [...prev, nextIndex]);
        return nextIndex;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isSpaceMode, elements.length, gameStarted]);

  // Handle mouse move for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isSpaceMode) return;
      
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // Calculate percentage of movement
      const moveX = (clientX / width - 0.5) * 2;
      const moveY = (clientY / height - 0.5) * 2;
      
      // Apply parallax effect to elements
      const elements = containerRef.current.querySelectorAll('.space-mode-element');
      elements.forEach((element, index) => {
        const depth = (index % 5 + 1) * 0.5; // Different depths for parallax
        const el = element as HTMLElement;
        el.style.transform = `translate(${moveX * depth * 40}px, ${moveY * depth * 40}px)`;
      });
    };
    
    if (isSpaceMode) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isSpaceMode]);

  const handleElementClick = (element: Element, index: number) => {
    onSelectElement(element);
    setScore(prev => prev + (index + 1) * 10);
  };

  const startGame = () => {
    setGameStarted(true);
    setVisibleElements([]);
    setCurrentElementIndex(0);
    setScore(0);
  };

  // Get the same color as in ElementCard component
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'alkali-metal': return 'rgb(255, 107, 107)';
      case 'alkaline-earth-metal': return 'rgb(255, 230, 109)';
      case 'transition-metal': return 'rgb(78, 205, 196)';
      case 'post-transition-metal': return 'rgb(26, 83, 92)';
      case 'metalloid': return 'rgb(247, 255, 247)';
      case 'nonmetal': return 'rgb(107, 72, 255)';
      case 'halogen': return 'rgb(144, 85, 162)';
      case 'noble-gas': return 'rgb(255, 154, 139)';
      case 'lanthanide': return 'rgb(202, 240, 248)';
      case 'actinide': return 'rgb(2, 62, 138)';
      default: return 'rgb(173, 181, 189)';
    }
  };

  return (
    <>
      <Button 
        onClick={toggleSpaceMode}
        variant={isSpaceMode ? "default" : "outline"}
        className="gap-2"
      >
        <Rocket className="h-4 w-4" />
        {isSpaceMode ? "Exit Space Game" : "Space Adventure Game"}
      </Button>

      {isSpaceMode && (
        <div 
          className="fixed inset-0 z-50 bg-gradient-to-b from-purple-900 via-blue-900 to-black"
          ref={containerRef}
        >
          {/* Stars background effect - more stars for a fuller space feel */}
          {Array.from({ length: 200 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.7 + 0.3,
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
              }}
            />
          ))}
          
          {/* Add some planets in the background */}
          <div className="absolute w-20 h-20 rounded-full bg-red-400 opacity-70" 
              style={{ top: '15%', left: '10%', boxShadow: '0 0 20px rgba(248, 113, 113, 0.6)' }}></div>
          <div className="absolute w-32 h-32 rounded-full bg-yellow-200 opacity-50" 
              style={{ top: '70%', left: '80%', boxShadow: '0 0 30px rgba(252, 211, 77, 0.6)' }}></div>
          <div className="absolute w-16 h-16 rounded-full bg-blue-300 opacity-60" 
              style={{ top: '40%', left: '85%', boxShadow: '0 0 15px rgba(147, 197, 253, 0.6)' }}></div>
          
          {/* Game UI */}
          <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-6">
            <Button 
              onClick={toggleSpaceMode}
              className="bg-red-500 hover:bg-red-600"
            >
              Exit Game
            </Button>
            
            <div className="bg-black/50 px-6 py-2 rounded-full text-white font-bold backdrop-blur-md">
              Score: {score}
            </div>
          </div>

          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-black/70 p-8 rounded-xl backdrop-blur-md max-w-md text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Space Elements Adventure</h2>
                <p className="text-gray-300 mb-6">Help our space explorer collect and learn about the elements scattered across the universe! Click on elements to learn about them and earn points!</p>
                <Button 
                  onClick={startGame} 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Start Adventure!
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Space kid character - enhanced version */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-float">
                <div className="flex flex-col items-center">
                  {/* Helmet */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-white to-blue-100 flex items-center justify-center border-4 border-blue-400 relative">
                    {/* Helmet glass reflection */}
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/30"></div>
                    
                    {/* Face */}
                    <div className="w-12 h-12 rounded-full bg-[#FFDBAC] relative">
                      {/* Eyes */}
                      <div className="absolute w-2 h-2.5 bg-black rounded-full" style={{ top: '40%', left: '25%' }}></div>
                      <div className="absolute w-2 h-2.5 bg-black rounded-full" style={{ top: '40%', right: '25%' }}></div>
                      
                      {/* Smile */}
                      <div className="absolute w-6 h-2 border-b-2 border-black rounded-full" style={{ bottom: '30%', left: '25%' }}></div>
                      
                      {/* Cheeks */}
                      <div className="absolute w-2 h-1 bg-pink-300 rounded-full opacity-70" style={{ bottom: '35%', left: '20%' }}></div>
                      <div className="absolute w-2 h-1 bg-pink-300 rounded-full opacity-70" style={{ bottom: '35%', right: '20%' }}></div>
                    </div>
                  </div>
                  
                  {/* Space suit */}
                  <div className="w-14 h-18 bg-gradient-to-b from-blue-500 to-blue-700 rounded-lg mt-1 relative">
                    {/* Suit details */}
                    <div className="absolute inset-x-4 top-2 h-8 bg-blue-400 rounded-md"></div>
                    <div className="absolute inset-x-6 top-4 bottom-6 bg-blue-300 rounded-md"></div>
                    
                    {/* Arms */}
                    <div className="absolute w-4 h-10 bg-gradient-to-b from-blue-500 to-blue-700 rounded-lg" 
                        style={{ top: '20%', left: '-25%', transform: 'rotate(-15deg)' }}>
                      <div className="absolute bottom-0 w-5 h-5 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute w-4 h-10 bg-gradient-to-b from-blue-500 to-blue-700 rounded-lg" 
                        style={{ top: '20%', right: '-25%', transform: 'rotate(15deg)' }}>
                      <div className="absolute bottom-0 w-5 h-5 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Legs */}
                    <div className="absolute w-4 h-8 bg-gradient-to-b from-blue-600 to-blue-800 rounded-b-lg" 
                        style={{ bottom: '-55%', left: '20%' }}></div>
                    <div className="absolute w-4 h-8 bg-gradient-to-b from-blue-600 to-blue-800 rounded-b-lg" 
                        style={{ bottom: '-55%', right: '20%' }}></div>
                    
                    {/* Boots */}
                    <div className="absolute w-5 h-3 bg-white rounded-lg" 
                        style={{ bottom: '-65%', left: '18%' }}></div>
                    <div className="absolute w-5 h-3 bg-white rounded-lg" 
                        style={{ bottom: '-65%', right: '18%' }}></div>
                    
                    {/* Air tank */}
                    <div className="absolute w-8 h-12 bg-gray-300 rounded-lg" 
                        style={{ top: '-10%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', zIndex: -1 }}>
                      <div className="absolute top-1 left-1 right-1 bottom-1 bg-gray-400 rounded-md"></div>
                    </div>
                  </div>
                  
                  {/* Jet propulsion effect */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-10 flex justify-center">
                      <div className="animate-pulse w-2 h-6 bg-gradient-to-t from-transparent via-orange-500 to-yellow-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              {visibleElements.map((index) => {
                const element = elements[index];
                if (!element) return null;
                
                // Random positions with more spread
                const top = Math.random() * 70 + 10;
                const left = Math.random() * 80 + 10;
                const scale = Math.random() * 0.5 + 0.8;
                const rotation = Math.random() * 40 - 20;
                
                // Get the element's category color
                const bgColor = getCategoryColor(element.category);
                
                return (
                  <div 
                    key={element.atomicNumber}
                    className="space-mode-element cursor-pointer animate-fade-in"
                    style={{
                      position: 'absolute',
                      top: `${top}%`,
                      left: `${left}%`,
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      transitionDelay: `${index * 0.1}s`,
                      zIndex: 10,
                    }}
                    onClick={() => handleElementClick(element, index)}
                  >
                    <div className="parent" style={{
                      width: '80px',
                      height: '80px',
                      perspective: '1000px',
                    }}>
                      <div className="card" style={{
                        height: '100%',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}BB 100%)`,
                        transition: 'all 0.5s ease-in-out',
                        transformStyle: 'preserve-3d',
                        transform: 'rotate3d(1, 1, 0, 30deg)',
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                        animation: 'rotate-3d 5s ease-in-out infinite',
                      }}>
                        <div className="glass" style={{
                          transformStyle: 'preserve-3d',
                          position: 'absolute',
                          inset: '4px',
                          borderRadius: '10px',
                          borderTopRightRadius: '50%',
                          background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.6) 100%)',
                          transform: 'translate3d(0px, 0px, 15px)',
                          borderLeft: '1px solid white',
                          borderBottom: '1px solid white',
                        }}></div>
                        
                        <div className="logo" style={{
                          position: 'absolute',
                          right: '0',
                          top: '0',
                          transformStyle: 'preserve-3d',
                        }}>
                          <span className="circle" style={{
                            position: 'absolute',
                            aspectRatio: '1',
                            borderRadius: '50%',
                            top: '5px',
                            right: '5px',
                            width: '24px',
                            transform: 'translate3d(0, 0, 20px)',
                            background: 'rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                            <span style={{ 
                              fontSize: '12px', 
                              fontWeight: 'bold',
                              color: '#FFF'
                            }}>{element.atomicNumber}</span>
                          </span>
                        </div>
                        
                        <div className="content" style={{
                          padding: '25px 10px 0px 10px',
                          transform: 'translate3d(0, 0, 20px)',
                          textAlign: 'center',
                        }}>
                          <span className="title" style={{
                            display: 'block',
                            color: '#FFFFFF',
                            fontWeight: '900',
                            fontSize: '24px',
                            textShadow: '0 0 5px rgba(255,255,255,0.7)',
                          }}>{element.symbol}</span>
                          
                          <span className="text" style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '10px',
                            marginTop: '4px',
                            textShadow: '0 0 5px rgba(255,255,255,0.5)',
                          }}>{element.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SpaceExplorationMode;
