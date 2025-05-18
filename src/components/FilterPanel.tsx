import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import elementsData from '../data/elements.json';

interface FilterPanelProps {
  onFilterChange: (filters: Filters) => void;
}

export interface Filters {
  state: string | null;
  category: string | null;
  block: string | null;
}

// Utility to extract unique values for a given key
const getUniqueValues = (key: keyof typeof elementsData[0]) => {
  return Array.from(new Set((elementsData as any[]).map(e => e[key]).filter(Boolean)));
};

const stateOptions = getUniqueValues('state');
const categoryOptions = getUniqueValues('category');
const blockOptions = getUniqueValues('block');

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Filters>({
    state: null,
    category: null,
    block: null
  });

  const handleFilterChange = (type: keyof Filters, value: string | null) => {
    const newFilters = { ...filters, [type]: value === "all" ? null : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      state: null,
      category: null,
      block: null
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card className="w-full mb-6 glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Filter Elements</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="filters">
            <AccordionTrigger className="text-lg font-medium">Filter Options</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">State at Room Temperature</label>
                  <Select
                    onValueChange={(value) => handleFilterChange('state', value)}
                    value={filters.state || "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {stateOptions.map(state => (
                        <SelectItem key={state} value={state}>{state.charAt(0).toUpperCase() + state.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Element Category</label>
                  <Select
                    onValueChange={(value) => handleFilterChange('category', value)}
                    value={filters.category || "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryOptions.map(category => (
                        <SelectItem key={category} value={category}>{category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Block</label>
                  <Select
                    onValueChange={(value) => handleFilterChange('block', value)}
                    value={filters.block || "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blocks</SelectItem>
                      {blockOptions.map(block => (
                        <SelectItem key={block} value={block}>{block}-block</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
