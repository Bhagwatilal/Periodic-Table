
import React, { useState, useEffect, useRef } from 'react';
import ElementCard, { Element } from './ElementCard';
import FilterPanel, { Filters } from './FilterPanel';
import InfoModal from './InfoModal';
import ThemeToggle from './ThemeToggle';
import SpaceExplorationMode from './SpaceExplorationMode';
import { Button } from '@/components/ui/button';
import elementsData from '../data/elements.json';

const PeriodicTable: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [filteredElements, setFilteredElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpaceMode, setIsSpaceMode] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load elements data
    setElements(elementsData as Element[]);
    setFilteredElements(elementsData as Element[]);
  }, []);

  const handleFilterChange = (filters: Filters) => {
    let filtered = [...elements];
    
    if (filters.state) {
      filtered = filtered.filter(element => element.state === filters.state);
    }
    
    if (filters.category) {
      filtered = filtered.filter(element => element.category === filters.category);
    }
    
    if (filters.block) {
      filtered = filtered.filter(element => element.block === filters.block);
    }
    
    setFilteredElements(filtered);
  };

  const handleSelectElement = (element: Element) => {
    setSelectedElement(element);
    setIsModalOpen(true);
  };

  const toggleSpaceMode = () => {
    setIsSpaceMode(prev => !prev);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-full mx-auto theme-transition">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Interactive Periodic Table</h1>
          <p className="text-muted-foreground">Explore and learn about the chemical elements</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <ThemeToggle />
        </div>
      </header>

      <FilterPanel onFilterChange={handleFilterChange} />

      <div className="flex flex-wrap gap-3 mb-6">
        <SpaceExplorationMode 
          elements={elements}
          isSpaceMode={isSpaceMode}
          toggleSpaceMode={toggleSpaceMode}
          onSelectElement={handleSelectElement}
        />
      </div>

      <div className="overflow-x-auto max-w-full pb-4">
        <div ref={tableRef} className="element-grid min-w-[1000px] gap-1">
          {/* Adding placeholder for proper grid placement */}
          {Array.from({ length: 18 * 7 }).map((_, index) => {
            const col = (index % 18) + 1;
            const row = Math.floor(index / 18) + 1;
            
            // Find element at this position
            const element = filteredElements.find(e => e.group === col && e.period === row);
            
            if (!element) {
              // Return empty cell for proper grid structure
              return <div key={`empty-${index}`} className="element-card opacity-0" style={{ gridColumn: col, gridRow: row }} />;
            }
            
            return (
              <ElementCard 
                key={element.atomicNumber}
                element={element}
                onSelect={handleSelectElement}
                isFollowCursor={false}
              />
            );
          })}
        </div>
      </div>

      {/* Element details modal */}
      <InfoModal 
        element={selectedElement}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PeriodicTable;
