import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Popper as OriginalPopper } from 'react-popper';
import { Transition } from 'react-spring/renderprops.cjs';
import mergeRefs from '../../utils/merge-refs';
import Portal from '../portal';

function normalizeTransition(placement, { translate, ...transition }) {
  if (!placement) {
    return null;
  }

  // `placement` can have a postfix like `right-start` or `right-end`
  const isRight = placement.includes('right');
  const isLeft = placement.includes('left');
  const isBottom = placement.includes('bottom');
  const isXAxis = isRight || isLeft;
  const translateValue = (isRight || isBottom) ? -translate : translate;

  const transform = isXAxis
    ? `translateX(${translateValue}%)`
    : `translateY(${translateValue}%)`;

  return { ...transition, transform };
}

const Content = forwardRef(function Content({
  children,
  isShown,
  placement,
  className,
  onAnimationEnd,
  ...props
}, ref) {
  return (
    <Transition
      items={isShown}
      from={{ opacity: 0, translate: 10 }}
      enter={{ opacity: 1, translate: 0 }}
      leave={{ opacity: 0, translate: 10 }}
      config={{ duration: 200 }}
      onRest={onAnimationEnd}
    >
      {(isVisible) => (
        isVisible && ((transitionProps) => (
          <Portal>
            <OriginalPopper placement={placement}>
              {({
                ref: popperRef, style, placement: actualPlacement, arrowProps,
              }) => (
                <div
                  className={className}
                  ref={mergeRefs(popperRef, ref)}
                  style={style}
                  data-placement={actualPlacement}
                  {...props}
                >
                  {children({
                    arrowProps,
                    style: normalizeTransition(
                      actualPlacement,
                      transitionProps,
                    ),
                  })}
                </div>
              )}
            </OriginalPopper>
          </Portal>
        ))
      )}
    </Transition>
  );
});

Content.propTypes = {
  children: PropTypes.func.isRequired,
  isShown: PropTypes.bool.isRequired,
  onAnimationEnd: PropTypes.func,
  placement: PropTypes.string,
  className: PropTypes.string,
};

Content.defaultProps = {
  placement: 'auto',
  className: null,
  onAnimationEnd: null,
};

export default Content;
