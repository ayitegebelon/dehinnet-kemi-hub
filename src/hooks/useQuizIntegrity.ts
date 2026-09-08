import React, { useRef, useCallback, useEffect, useState } from 'react';

interface CheatDetectionData {
  tabSwitchCount: number;
  copyPasteCount: number;
  rightClickCount: number;
  suspiciousTiming: boolean;
  focusLostCount: number;
  rapidAnswerCount: number;
  riskScore: number;
  flagged: boolean;
}

const RISK_THRESHOLDS = {
  TAB_SWITCH: 3,
  COPY_PASTE: 2,
  RIGHT_CLICK: 3,
  FOCUS_LOST: 4,
  MIN_ANSWER_TIME_MS: 2000, // Less than 2s per question is suspicious
};

export const useQuizIntegrity = (quizCount: number) => {
  const dataRef = useRef<CheatDetectionData>({
    tabSwitchCount: 0,
    copyPasteCount: 0,
    rightClickCount: 0,
    suspiciousTiming: false,
    focusLostCount: 0,
    rapidAnswerCount: 0,
    riskScore: 0,
    flagged: false,
  });

  const lastAnswerTime = useRef<number>(Date.now());
  const [warnings, setWarnings] = useState<string[]>([]);
  const [integrityScore, setIntegrityScore] = useState(100);

  const addWarning = useCallback((msg: string) => {
    setWarnings(prev => {
      if (prev.includes(msg)) return prev;
      return [...prev, msg];
    });
  }, []);

  const calculateRisk = useCallback(() => {
    const d = dataRef.current;
    let score = 0;
    if (d.tabSwitchCount >= RISK_THRESHOLDS.TAB_SWITCH) score += 25;
    else if (d.tabSwitchCount > 0) score += d.tabSwitchCount * 5;
    
    if (d.copyPasteCount >= RISK_THRESHOLDS.COPY_PASTE) score += 30;
    else if (d.copyPasteCount > 0) score += d.copyPasteCount * 10;
    
    if (d.rightClickCount >= RISK_THRESHOLDS.RIGHT_CLICK) score += 10;
    if (d.focusLostCount >= RISK_THRESHOLDS.FOCUS_LOST) score += 15;
    if (d.rapidAnswerCount > Math.max(1, quizCount * 0.5)) score += 20;

    d.riskScore = Math.min(score, 100);
    d.flagged = d.riskScore >= 40;
    setIntegrityScore(Math.max(0, 100 - d.riskScore));
    return d;
  }, [quizCount]);

  // Track tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        dataRef.current.tabSwitchCount++;
        if (dataRef.current.tabSwitchCount >= RISK_THRESHOLDS.TAB_SWITCH) {
          addWarning('Multiple tab switches detected');
        }
        calculateRisk();
      }
    };

    const handleBlur = () => {
      dataRef.current.focusLostCount++;
      if (dataRef.current.focusLostCount >= RISK_THRESHOLDS.FOCUS_LOST) {
        addWarning('Window focus lost multiple times');
      }
      calculateRisk();
    };

    const handleCopy = (e: ClipboardEvent) => {
      dataRef.current.copyPasteCount++;
      addWarning('Copy/paste activity detected');
      calculateRisk();
    };

    const handlePaste = (e: ClipboardEvent) => {
      dataRef.current.copyPasteCount++;
      addWarning('Paste activity detected during quiz');
      calculateRisk();
    };

    const handleContextMenu = (e: MouseEvent) => {
      dataRef.current.rightClickCount++;
      calculateRisk();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [addWarning, calculateRisk]);

  const recordAnswer = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastAnswerTime.current;
    if (elapsed < RISK_THRESHOLDS.MIN_ANSWER_TIME_MS) {
      dataRef.current.rapidAnswerCount++;
      if (dataRef.current.rapidAnswerCount > 2) {
        addWarning('Unusually fast answer timing');
      }
    }
    lastAnswerTime.current = now;
    calculateRisk();
  }, [addWarning, calculateRisk]);

  const getReport = useCallback(() => {
    calculateRisk();
    return { ...dataRef.current };
  }, [calculateRisk]);

  const reset = useCallback(() => {
    dataRef.current = {
      tabSwitchCount: 0, copyPasteCount: 0, rightClickCount: 0,
      suspiciousTiming: false, focusLostCount: 0, rapidAnswerCount: 0,
      riskScore: 0, flagged: false,
    };
    setWarnings([]);
    setIntegrityScore(100);
    lastAnswerTime.current = Date.now();
  }, []);

  return { warnings, integrityScore, recordAnswer, getReport, reset };
};
