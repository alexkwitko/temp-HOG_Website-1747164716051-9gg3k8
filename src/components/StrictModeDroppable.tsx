import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";
import { useSiteSettings } from '../contexts/SiteSettingsContext';

/**
 * A wrapper component that makes react-beautiful-dnd work with React 18 StrictMode
 * and avoids the defaultProps warning by using ES6 default parameters.
 * 
 * Based on solution from: https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
 */
export const StrictModeDroppable = ({ 
  children, 
  ...props 
}: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    // This is a workaround for react-beautiful-dnd not working with React 18 StrictMode
    // The animation frame allows the component to be mounted after the strict mode's 
    // double-mount cycle is complete
    const animation = requestAnimationFrame(() => setEnabled(true));
    
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  
  if (!enabled) {
    return null;
  }
  
  return <DroppableWithoutWarning {...props}>{children}</DroppableWithoutWarning>;
};

// Explicitly provide the properties that would be part of defaultProps
// to avoid the "Support for defaultProps will be removed from memo components" warning
const DroppableWithoutWarning = ({ 
  children, 
  direction = 'vertical',  // Set default explicitly
  type = 'DEFAULT',        // Set default explicitly
  mode = 'standard',       // Set default explicitly
  isDropDisabled = false,  // Set default explicitly
  isCombineEnabled = false, // Set default explicitly
  ignoreContainerClipping = false, // Set default explicitly
  renderClone = undefined,  // Set default explicitly as undefined instead of null
  getContainerForClone = (() => document.body), // Set default explicitly
  ...props 
}: DroppableProps) => {
  return <Droppable 
    direction={direction}
    type={type}
    mode={mode}
    isDropDisabled={isDropDisabled}
    isCombineEnabled={isCombineEnabled}
    ignoreContainerClipping={ignoreContainerClipping}
    renderClone={renderClone}
    getContainerForClone={getContainerForClone}
    {...props}
  >
    {children}
  </Droppable>
}; 