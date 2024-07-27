// src/contexts/AppContext.js
import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ state, setState ] = useState({
    isLogin: true,
    userID: null,
    userEmail: null,
    selectedStock: '삼성전자',
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
