import React from 'react';
import Layout from '@/components/layout/Layout';
import PeriodicTable from '@/components/chemistry/PeriodicTable';

const PeriodicTablePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <PeriodicTable />
      </div>
    </Layout>
  );
};

export default PeriodicTablePage;
