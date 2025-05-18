
import { ThemeProvider } from '@/context/ThemeContext';
import PeriodicTable from '@/components/PeriodicTable';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <PeriodicTable />
      </div>
    </ThemeProvider>
  );
};

export default Index;
