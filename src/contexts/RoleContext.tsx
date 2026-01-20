import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types/subscription';

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  householdSize: number;
  setHouseholdSize: (size: number) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [householdSize, setHouseholdSize] = useState(1);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, setRole, householdSize, setHouseholdSize }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
