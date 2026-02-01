import { useState, useEffect, useCallback } from 'react';

const SAFETY_STORAGE_KEY = 'project_safety_sessions';
const SESSION_EXPIRY_HOURS = 24;

interface SafetySession {
  projectId: string;
  completedAt: number;
  expiresAt: number;
}

interface ProjectStartContext {
  projectId: string;
  projectTitle: string;
}

const START_CONTEXT_KEY = 'project_start_context';

export const useProjectSafety = () => {
  const [verifiedProjects, setVerifiedProjects] = useState<Set<string>>(new Set());

  // Load verified sessions from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAFETY_STORAGE_KEY);
      if (stored) {
        const sessions: SafetySession[] = JSON.parse(stored);
        const now = Date.now();
        // Filter out expired sessions
        const validSessions = sessions.filter(s => s.expiresAt > now);
        setVerifiedProjects(new Set(validSessions.map(s => s.projectId)));
        // Clean up expired sessions in storage
        if (validSessions.length !== sessions.length) {
          localStorage.setItem(SAFETY_STORAGE_KEY, JSON.stringify(validSessions));
        }
      }
    } catch (e) {
      console.error('Failed to load safety sessions:', e);
    }
  }, []);

  // Check if a project has verified safety
  const isSafetyVerified = useCallback((projectId: string): boolean => {
    return verifiedProjects.has(projectId);
  }, [verifiedProjects]);

  // Mark a project's safety as verified
  const verifySafety = useCallback((projectId: string): void => {
    const now = Date.now();
    const expiresAt = now + (SESSION_EXPIRY_HOURS * 60 * 60 * 1000);
    
    try {
      const stored = localStorage.getItem(SAFETY_STORAGE_KEY);
      const sessions: SafetySession[] = stored ? JSON.parse(stored) : [];
      
      // Remove existing session for this project if any
      const filtered = sessions.filter(s => s.projectId !== projectId);
      
      // Add new session
      filtered.push({ projectId, completedAt: now, expiresAt });
      
      localStorage.setItem(SAFETY_STORAGE_KEY, JSON.stringify(filtered));
      setVerifiedProjects(prev => new Set([...prev, projectId]));
    } catch (e) {
      console.error('Failed to save safety session:', e);
    }
  }, []);

  // Clear safety verification for a project
  const clearSafety = useCallback((projectId: string): void => {
    try {
      const stored = localStorage.getItem(SAFETY_STORAGE_KEY);
      if (stored) {
        const sessions: SafetySession[] = JSON.parse(stored);
        const filtered = sessions.filter(s => s.projectId !== projectId);
        localStorage.setItem(SAFETY_STORAGE_KEY, JSON.stringify(filtered));
      }
      setVerifiedProjects(prev => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    } catch (e) {
      console.error('Failed to clear safety session:', e);
    }
  }, []);

  // Set project context for starting
  const setStartContext = useCallback((context: ProjectStartContext | null): void => {
    try {
      if (context) {
        sessionStorage.setItem(START_CONTEXT_KEY, JSON.stringify(context));
      } else {
        sessionStorage.removeItem(START_CONTEXT_KEY);
      }
    } catch (e) {
      console.error('Failed to set start context:', e);
    }
  }, []);

  // Get project context for starting
  const getStartContext = useCallback((): ProjectStartContext | null => {
    try {
      const stored = sessionStorage.getItem(START_CONTEXT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to get start context:', e);
      return null;
    }
  }, []);

  // Clear project context
  const clearStartContext = useCallback((): void => {
    try {
      sessionStorage.removeItem(START_CONTEXT_KEY);
    } catch (e) {
      console.error('Failed to clear start context:', e);
    }
  }, []);

  return {
    isSafetyVerified,
    verifySafety,
    clearSafety,
    setStartContext,
    getStartContext,
    clearStartContext,
  };
};
