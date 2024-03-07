'use client'
import React, { createContext, useState, useContext } from "react";

interface SurveyData {
  academic: any; 
  school: any; 
}

interface SurveyContextType {
  surveys: SurveyData | null;
  setSurveys: React.Dispatch<React.SetStateAction<SurveyData | null>>;
}

export const SurveyStateContext = createContext<SurveyContextType | null>(null);

const SurveyContext = ({ children }: { children: React.ReactNode }) => {
  const [surveys, setSurveys] = useState<SurveyData | null>(null);

  return (
    <SurveyStateContext.Provider value={{ surveys, setSurveys }}>
      {children}
    </SurveyStateContext.Provider>
  );
};

export default SurveyContext;

export const useSurvey = () => {
  const context = useContext(SurveyStateContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyContext');
  }
  return context;
};
