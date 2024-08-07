// src/contexts/AppContext.js
import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ state, setState ] = useState({
    isLogin: false,
    userID: null,
    userEmail: null,
    selectedStock: JSON.stringify({
      "stockCode": "000120",
      "companyName": "CJ대한통운"
    }),
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
