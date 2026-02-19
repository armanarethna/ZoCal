import React, { createContext, useContext, useState } from 'react';

const TooltipContext = createContext();

export const TooltipProvider = ({ children }) => {
  const [openTooltipId, setOpenTooltipId] = useState(null);

  const openTooltip = (id) => {
    setOpenTooltipId(id);
  };

  const closeTooltip = () => {
    setOpenTooltipId(null);
  };

  const isOpen = (id) => {
    return openTooltipId === id;
  };

  return (
    <TooltipContext.Provider value={{ openTooltip, closeTooltip, isOpen }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};