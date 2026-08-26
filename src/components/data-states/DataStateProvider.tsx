import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type DataStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'offline'
  | 'empty'
  | 'no-results'
  | 'partial';

export interface DataSourceInfo {
  name: string;
  lastSync: Date | null;
  nextSync?: Date | null;
  status: 'active' | 'degraded' | 'failed' | 'unknown';
  error?: string;
}

export interface GlobalDataState {
  isOnline: boolean;
  lastOnline: Date | null;
  activeSources: Map<string, DataSourceInfo>;
}

interface DataStateContextType {
  state: GlobalDataState;
  setOnlineStatus: (isOnline: boolean) => void;
  updateSourceStatus: (sourceName: string, info: Partial<DataSourceInfo>) => void;
  getSourceStatus: (sourceName: string) => DataSourceInfo | undefined;
}

const DataStateContext = createContext<DataStateContextType | undefined>(undefined);

export function DataStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GlobalDataState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastOnline: typeof navigator !== 'undefined' && navigator.onLine ? new Date() : null,
    activeSources: new Map(),
  });

  const setOnlineStatus = useCallback((isOnline: boolean) => {
    setState((prev) => ({
      ...prev,
      isOnline,
      lastOnline: isOnline ? new Date() : prev.lastOnline,
    }));
  }, []);

  const updateSourceStatus = useCallback(
    (sourceName: string, info: Partial<DataSourceInfo>) => {
      setState((prev) => {
        const newSources = new Map(prev.activeSources);
        const existing = newSources.get(sourceName);
        newSources.set(sourceName, {
          name: sourceName,
          lastSync: null,
          status: 'unknown',
          ...existing,
          ...info,
        });
        return { ...prev, activeSources: newSources };
      });
    },
    []
  );

  const getSourceStatus = useCallback(
    (sourceName: string): DataSourceInfo | undefined => {
      return state.activeSources.get(sourceName);
    },
    [state.activeSources]
  );

  React.useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return (
    <DataStateContext.Provider
      value={{
        state,
        setOnlineStatus,
        updateSourceStatus,
        getSourceStatus,
      }}
    >
      {children}
    </DataStateContext.Provider>
  );
}

export function useGlobalDataState() {
  const context = useContext(DataStateContext);
  if (!context) {
    throw new Error('useGlobalDataState must be used within a DataStateProvider');
  }
  return context;
}

export function useOnlineStatus() {
  const { state } = useGlobalDataState();
  return state.isOnline;
}

export function useSourceStatus(sourceName: string) {
  const { getSourceStatus, updateSourceStatus } = useGlobalDataState();
  return {
    sourceInfo: getSourceStatus(sourceName),
    updateSource: (info: Partial<DataSourceInfo>) => updateSourceStatus(sourceName, info),
  };
}
