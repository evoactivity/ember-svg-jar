import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import AnimatedPopper from '../animated-popper';
import { useDropdown } from './dropdown';

function Trigger({ children }) {
  const {
    dropdownID,
    isOpen,
    toggle,
    isTriggerActive,
  } = useDropdown();

  return (
    <AnimatedPopper.Target>
      {cloneElement(children, {
        'aria-owns': dropdownID,
        'aria-expanded': isOpen,
        'aria-haspopup': 'menu',
        onMouseDown: () => {
          isTriggerActive.current = true;
        },
        onClick: () => {
          isTriggerActive.current = false;
          toggle();
        },
      })}
    </AnimatedPopper.Target>
  );
}

Trigger.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Trigger;
