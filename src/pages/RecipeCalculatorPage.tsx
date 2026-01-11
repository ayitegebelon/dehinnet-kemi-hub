import React from 'react';
import Layout from '@/components/layout/Layout';
import RecipeCalculator from '@/components/calculator/RecipeCalculator';

const RecipeCalculatorPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <RecipeCalculator />
      </div>
    </Layout>
  );
};

export default RecipeCalculatorPage;
