/**
<<<<<<< HEAD
 * Refresh Context Provider
 * 
 * Manages global refresh state for the application.
 * Provides a mechanism to trigger UI updates across components
 * when data changes occur (e.g., after successful swap operations).
=======
 * RefreshContext - Global state management for UI refresh triggers
 * 
 * This context provides a mechanism to trigger UI refreshes across the application.
 * It's particularly useful for updating components after data mutations without full page reloads.
>>>>>>> 3b8aea24de1b098229ecff9a0a6d196d69e3f8bf
 * 
 * @module RefreshContext
 */

'use client';
import { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

/**
 * RefreshProvider Component
 * 
 * Provides refresh state management to all child components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to refresh state
 * @returns {JSX.Element} Context provider with refresh state
 */
export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

/**
 * useRefresh Hook
 * 
 * Custom hook to access refresh state and setter function from anywhere in the component tree.
 * 
 * @returns {Object} Object containing refresh state and setRefresh function
 * @returns {boolean} returns.refresh - Current refresh state
 * @returns {Function} returns.setRefresh - Function to update refresh state
 * 
 * @example
 * const { refresh, setRefresh } = useRefresh();
 * setRefresh(!refresh); // Trigger a refresh
 */
export const useRefresh = () => useContext(RefreshContext);
