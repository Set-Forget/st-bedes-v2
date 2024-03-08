'use client'
import React, { createContext, useState, useContext } from "react";

interface SurveyData {
  academic: any; 
  school: any; 
}

interface SurveyContextType {
  surveys: SurveyData | null;
  setSurveys: React.Dispatch<React.SetStateAction<SurveyData | null>>;
  submitId: number | null; 
  setSubmitId: React.Dispatch<React.SetStateAction<number | null>>; 
}

export const SurveyStateContext = createContext<SurveyContextType | null>(null);

const SurveyContext = ({ children }: { children: React.ReactNode }) => {
  const [surveys, setSurveys] = useState<SurveyData | null>(null);
  const [submitId, setSubmitId] = useState<number | null>(null);

  return (
    <SurveyStateContext.Provider value={{ surveys, setSurveys, submitId, setSubmitId }}>
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
