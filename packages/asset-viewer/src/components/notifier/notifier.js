import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';
import './notifier.scss';

function NotifierItem({
  id, text, timeout, style, onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onClose, timeout]);

  return (
    <animated.li className="notifier__item" style={style}>
      {text}
    </animated.li>
  );
}

NotifierItem.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  timeout: PropTypes.number,
  style: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

NotifierItem.defaultProps = {
  timeout: 2000,
};

function Notifier({ messages, onClose }) {
  const transitions = useTransition(messages, (item) => item.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <ul className="notifier">
      {transitions.map(({ item, props, key }) => (
        <NotifierItem
          {...item}
          style={props}
          key={key}
          onClose={onClose}
        />
      ))}
    </ul>
  );
}

Notifier.propTypes = {
  messages: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notifier;
