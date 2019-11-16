import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import AnimatedPopper from '../animated-popper';
import { useDropdown } from './dropdown';
import './dropdown.scss';

function Menu({ children, placement }) {
  const menuRef = useRef();
  const {
    dropdownID,
    isOpen,
    isTriggerActive,
    close,
  } = useDropdown();

  // We can't rely on `useEffect` for focus
  // as we use react-spring animation
  function focusMenu() {
    if (menuRef.current && isOpen) {
      menuRef.current.focus();
    }
  }

  return (
    <AnimatedPopper.Content
      className="dropdown"
      isShown={isOpen}
      placement={placement}
      onAnimationEnd={focusMenu}
    >
      {({ arrowProps, style }) => (
        <div className="dropdown__content" style={style}>
          <ul
            className="dropdown__list"
            id={dropdownID}
            role="menu"
            tabIndex="-1"
            ref={menuRef}
            onKeyDown={({ key }) => {
              if (key === 'Escape') {
                close();
              }
            }}
            onBlur={({ relatedTarget }) => {
              const isOwnMenu = menuRef.current.contains(relatedTarget);

              if (!isOwnMenu && !isTriggerActive.current) {
                close();
              }
            }}
          >
            {children}
          </ul>

          <div className="dropdown__arrow" {...arrowProps} />
        </div>
      )}
    </AnimatedPopper.Content>
  );
}

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  placement: PropTypes.string,
};

Menu.defaultProps = {
  placement: 'bottom',
};

export default Menu;
