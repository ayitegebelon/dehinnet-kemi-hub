import React from 'react';
import Layout from '@/components/layout/Layout';
import SafetyChecklist from '@/components/safety/SafetyChecklist';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SafetyChecklistPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleComplete = () => {
    toast.success('Safety checklist completed! You may now start your experiment.');
    navigate('/dashboard');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <SafetyChecklist onComplete={handleComplete} />
      </div>
    </Layout>
  );
};

export default SafetyChecklistPage;
