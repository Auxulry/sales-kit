'use client';

import React, { createContext, useContext } from 'react';
import useStore from "@/stores";

const ZustandContext = createContext(null);

export const ZustandProvider= ({ children }) => {
  const store = useStore();
  return (
    <ZustandContext.Provider value={store}>
      {children}
    </ZustandContext.Provider>
  );
};

export const useZustandStore = () => {
  const context = useContext(ZustandContext);
  if (!context) {
    throw new Error('useZustandStore must be used within a ZustandProvider');
  }
  return context;
};
