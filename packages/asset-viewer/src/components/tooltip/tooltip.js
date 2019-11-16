import React, { cloneElement, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import mergeRefs from '../../utils/merge-refs';
import AnimatedPopper from '../animated-popper';
import './tooltip.scss';

function Tooltip({
  label,
  placement,
  children,
  showingDelay,
  hidingDelay,
}) {
  const [isShown, setIsVisible] = useState(false);
  const showingTimeout = useRef();
  const hidingTimeout = useRef();

  const triggerRef = useRef();
  const tooltipRef = useRef();

  function clearShowingTimer() {
    clearTimeout(showingTimeout.current);
  }

  function startShowingTimer() {
    clearShowingTimer();
    showingTimeout.current = setTimeout(() => setIsVisible(true), showingDelay);
  }

  function clearHidingTimer() {
    clearTimeout(hidingTimeout.current);
  }

  function startHidingTimer() {
    clearHidingTimer();
    hidingTimeout.current = setTimeout(() => setIsVisible(false), hidingDelay);
  }

  function showTooltip() {
    if (isShown) {
      clearHidingTimer();
    } else {
      startShowingTimer();
    }
  }

  function hideTooltip() {
    if (isShown) {
      startHidingTimer();
    } else {
      clearShowingTimer();
    }
  }

  // Don't hide tooltip if it's still hovered.
  function handleMouseLeave({ relatedTarget }) {
    if (!tooltipRef.current) {
      hideTooltip();
      return;
    }

    let isOwnTrigger = false;
    let isOwnTooltip = false;

    try {
      isOwnTrigger = triggerRef.current.contains(relatedTarget);
      isOwnTooltip = tooltipRef.current.contains(relatedTarget);
    } catch (e) {
      // in some cases relatedTarget won't be a node
    }

    if (!isOwnTrigger && !isOwnTooltip) {
      hideTooltip();
    }
  }

  return (
    <AnimatedPopper>
      <AnimatedPopper.Target>
        {cloneElement(children, {
          onMouseEnter: showTooltip,
          onMouseDown: hideTooltip,
          onMouseLeave: handleMouseLeave,
          ref: mergeRefs(triggerRef, children.ref),
        })}
      </AnimatedPopper.Target>

      <AnimatedPopper.Content
        className="tooltip"
        isShown={isShown}
        placement={placement}
        ref={tooltipRef}
        onMouseLeave={handleMouseLeave}
      >
        {({ arrowProps, style }) => (
          <div
            className="tooltip__content"
            style={style}
            role="presentation"
          >
            {label}
            <div className="tooltip__arrow" {...arrowProps} />
          </div>
        )}
      </AnimatedPopper.Content>
    </AnimatedPopper>
  );
}

Tooltip.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  placement: PropTypes.string,
  showingDelay: PropTypes.number,
  hidingDelay: PropTypes.number,
};

Tooltip.defaultProps = {
  placement: 'bottom',
  showingDelay: 200,
  hidingDelay: 100,
};

export default Tooltip;
