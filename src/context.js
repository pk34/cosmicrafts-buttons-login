import React, { createContext, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  let _prevData = (localStorage.getItem("cosmic_user") !== null) ? 
      JSON.parse(localStorage.getItem("cosmic_user")) 
    : 
      {
        wallet: "", 
        walletState: "disconnected",
        walletConnected: "",
        userName: ""
      };
  const [walletData, setWalletData] = useState(_prevData);
  const value = { walletData, setWalletData };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;