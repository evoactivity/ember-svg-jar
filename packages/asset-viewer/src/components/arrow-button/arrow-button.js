import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as ArrowDownIcon } from '../../images/icons/arrow-down.svg';
import './arrow-button.scss';

const ArrowButton = forwardRef(
  function ArrowButton({ children, className, ...props }, ref) {
    return (
      <button
        className={classNames('btn', className)}
        type="button"
        ref={ref}
        {...props}
      >
        {children}
        <ArrowDownIcon className="arrow-button__icon" aria-hidden />
      </button>
    );
  },
);

ArrowButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

ArrowButton.defaultProps = {
  className: null,
};

export default ArrowButton;
