
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Element } from './ElementCard';

interface InfoModalProps {
  element: Element | null;
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ element, isOpen, onClose }) => {
  if (!element) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-4xl font-bold">{element.symbol}</span>
            <span className="text-2xl">{element.name}</span>
            <span className="text-xl ml-auto">#{element.atomicNumber}</span>
          </DialogTitle>
          <DialogDescription className="text-sm pt-2 grid grid-cols-2 gap-2">
            <div>
              <p className="font-semibold">Atomic Mass</p>
              <p>{element.atomicMass}</p>
            </div>
            <div>
              <p className="font-semibold">Category</p>
              <p className="capitalize">{element.category.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="font-semibold">State at Room Temp</p>
              <p className="capitalize">{element.state}</p>
            </div>
            <div>
              <p className="font-semibold">Block</p>
              <p>{element.block}-block</p>
            </div>
            <div>
              <p className="font-semibold">Group</p>
              <p>{element.group}</p>
            </div>
            <div>
              <p className="font-semibold">Period</p>
              <p>{element.period}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-semibold mb-2">Description</h3>
          <p>{element.description}</p>
        </div>
        
        <div className="flex justify-center my-4">
          <div 
            className={`element-card-3d w-32 h-32 animate-float`}
          >
            <div className={`element-card-inner glass-card h-full border-element-${element.category} flex flex-col items-center justify-center`}>
              <div className="absolute top-2 left-2 text-sm">{element.atomicNumber}</div>
              <div className="text-4xl font-bold">{element.symbol}</div>
              <div className="text-sm">{element.name}</div>
              <div className="text-xs mt-2">{element.atomicMass}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
