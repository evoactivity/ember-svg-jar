import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../tooltip';

function TooltipLink({
  to, label, placement, children, ...props
}) {
  return (
    <Tooltip label={label} placement={placement}>
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        {...props}
      >
        {children}
      </a>
    </Tooltip>
  );
}

TooltipLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  placement: PropTypes.string,
};

TooltipLink.defaultProps = {
  placement: 'auto',
};

export default TooltipLink;
