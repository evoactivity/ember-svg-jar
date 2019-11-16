import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './placeholder.scss';

function Placeholder({
  icon: Icon, title, children: text, className,
}) {
  return (
    <div className={classNames('placeholder', className)}>
      <Icon className="placeholder__icon" aria-hidden="true" />

      <h2 className="placeholder__title">
        {title}
      </h2>

      {text && (
        <p className="placeholder__text">
          {text}
        </p>
      )}
    </div>
  );
}

Placeholder.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

Placeholder.defaultProps = {
  children: null,
  className: null,
};

export default Placeholder;
