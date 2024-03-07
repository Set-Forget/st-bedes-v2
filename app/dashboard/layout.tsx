import React from 'react';
import SurveyContext from '@/components/surveys/surveyContext';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SurveyContext>
      <div className="dashboard-layout">
        <main>{children}</main>
      </div>
    </SurveyContext>
  );
};

export default DashboardLayout;
