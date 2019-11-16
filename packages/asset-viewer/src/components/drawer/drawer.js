import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTransition, animated } from 'react-spring';
import Portal from '../portal';
import './drawer.scss';

const placementToTransform = {
  top: 'translate3d(0, -100%, 0)',
  bottom: 'translate3d(0, 100%, 0)',
  left: 'translate3d(-100%, 0, 0)',
  right: 'translate3d(100%, 0, 0)',
};

function Drawer({
  children,
  isOpen,
  placement,
  className,
  onClose,
}) {
  const drawerRef = useRef();

  const transitions = useTransition(isOpen, null, {
    from: { opacity: 0, transform: placementToTransform[placement] },
    enter: { opacity: 1, transform: 'translate3d(0,0,0)' },
    leave: { opacity: 0, transform: placementToTransform[placement] },
    config: { duration: 250 },

    onRest() {
      if (drawerRef.current && isOpen) {
        drawerRef.current.focus();
      }
    },
  });

  return transitions.map(({ item, key, props: transitionProps }) => item && (
    <Portal key={key}>
      <animated.div
        className={classNames(className, 'drawer', `drawer--${placement}`)}
        style={{ transform: transitionProps.transform }}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onClose();
          }
        }}
      >
        {children}
      </animated.div>

      <animated.div
        className="drawer__overlay"
        role="presentation"
        style={{ opacity: transitionProps.opacity }}
        onClick={onClose}
      />
    </Portal>
  ));
}

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string,
};

Drawer.defaultProps = {
  placement: 'left',
  className: null,
};

export default Drawer;
