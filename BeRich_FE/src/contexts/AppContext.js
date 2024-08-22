// src/contexts/AppContext.js
import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ state, setState ] = useState({
    selectedStock: JSON.stringify({
      "stockCode": "005930",
      "companyName": "삼성전자"
    }),
    isAccount: false,
    statusData: [{"endDay": "", "id": 0, "investmentInsight": "", "investmentPropensity": "", "startBalance": "", "startDay": "", "status": "ENDED", "stockCode": "", "totalProfit": ""}],
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
