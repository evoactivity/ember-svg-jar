import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDropdown } from './dropdown';
import './dropdown.scss';

function MenuItem({ children, onClick, active }) {
  const { close } = useDropdown();

  return (
    <li>
      <button
        className={classNames('dropdown__item', { 'is-active': active })}
        type="button"
        role="menuitem"
        onClick={() => {
          onClick();
          close();
        }}
      >
        {children}
      </button>
    </li>
  );
}

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

MenuItem.defaultProps = {
  active: false,
};

export default MenuItem;
