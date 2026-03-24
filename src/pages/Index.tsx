import { useState } from 'react';
import GreetingLoader from '@/components/GreetingLoader';
import Portfolio from '@/pages/Portfolio';

const Index = () => {
  const [showPortfolio, setShowPortfolio] = useState(false);

  if (showPortfolio) {
    return <Portfolio />;
  }

  return <GreetingLoader onComplete={() => setShowPortfolio(true)} />;
};

export default Index;
