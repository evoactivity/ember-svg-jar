/*
  Usage:

  <AnimatedPopper>
    <AnimatedPopper.Target>
      <button type="button">
        Button
      </button>
    </AnimatedPopper.Target>

    <AnimatedPopper.Content isShown={isShown} placement="bottom">
      {({ arrowProps, style }) => (
        <div className="tooltip" style={style}>
          {tooltipText}

          <div className="tooltip__arrow" {...arrowProps} />
        </div>
      )}
    </AnimatedPopper.Content>
  </AnimatedPopper>

  Use `onAnimationEnd` of `Content` component to perform focus
  or other refs related side effects.
*/

import { Manager as AnimatedPopper } from 'react-popper';
import Target from './target';
import Content from './content';

AnimatedPopper.Target = Target;
AnimatedPopper.Content = Content;

AnimatedPopper.Target.displayName = 'AnimatedPopper.Target';
AnimatedPopper.Content.displayName = 'AnimatedPopper.Content';

export default AnimatedPopper;
