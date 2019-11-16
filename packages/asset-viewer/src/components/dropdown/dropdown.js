import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  createContext,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import makeID from '../../utils/make-id';
import AnimatedPopper from '../animated-popper';

const DropdownContext = createContext();

function useDropdown() {
  const context = useContext(DropdownContext);

  if (context === undefined) {
    throw new Error('useDropdown must be used within Dropdown');
  }

  return context;
}

function Dropdown({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const isTriggerActive = useRef();
  const dropdownID = useMemo(() => makeID('dropdown'), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  return (
    <DropdownContext.Provider
      value={{
        dropdownID,
        isOpen,
        close,
        toggle,
        isTriggerActive,
      }}
    >
      <AnimatedPopper>
        {children}
      </AnimatedPopper>
    </DropdownContext.Provider>
  );
}

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dropdown;
export { useDropdown };
