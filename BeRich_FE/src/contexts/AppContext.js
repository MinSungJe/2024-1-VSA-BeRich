// src/contexts/AppContext.js
import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ state, setState ] = useState({
    isLogin: false,
    userID: null,
    userEmail: null,
    selectedStock: JSON.stringify({
      "stockCode": "005930",
      "companyName": "삼성전자"
    }),
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
