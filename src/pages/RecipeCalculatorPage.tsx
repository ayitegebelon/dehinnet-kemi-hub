import React from 'react';
import Layout from '@/components/layout/Layout';
import AdvancedCalculator from '@/components/calculator/AdvancedCalculator';

const RecipeCalculatorPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AdvancedCalculator />
      </div>
    </Layout>
  );
};

export default RecipeCalculatorPage;
