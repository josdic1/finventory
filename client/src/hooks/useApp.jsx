import { useContext } from 'react';
import { AppContext } from '../providers/AppProvider';

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useUser must be used within AppProvider');
  }
  return context;
}

