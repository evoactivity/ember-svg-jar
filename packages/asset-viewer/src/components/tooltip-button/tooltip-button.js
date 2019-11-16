import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../tooltip';

const TooltipButton = forwardRef(function TooltipButton({ label, placement, ...props }, ref) {
  return (
    <Tooltip label={label} placement={placement}>
      <button
        type="button"
        aria-label={label}
        ref={ref}
        {...props}
      />
    </Tooltip>
  );
});

TooltipButton.propTypes = {
  label: PropTypes.string.isRequired,
  placement: PropTypes.string,
};

TooltipButton.defaultProps = {
  placement: 'auto',
};

export default TooltipButton;
