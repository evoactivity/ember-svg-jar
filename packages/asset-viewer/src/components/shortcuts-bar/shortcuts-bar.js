import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as CloseIcon } from '../../images/icons/close.svg';
import './shortcuts-bar.scss';

const shortcuts = [
  {
    title: 'enter',
    text: 'Copy Helper to clipboard',
  },
  {
    title: 'd',
    text: 'Download SVG',
  },
  {
    title: 'c',
    text: 'Copy CSS to clipboard',
  },
  {
    title: '/',
    text: 'Focus search bar',
  },
  {
    title: 's',
    text: 'Copy SVG to clipboard',
  },
  {
    title: '?',
    text: 'Show shortcuts',
  },
];

function ShortcutsItem({ title, text }) {
  return (
    <li className="shortcuts-bar__item">
      <div className="shortcuts-bar__keys">
        <kbd className="shortcuts-bar__key">
          {title}
        </kbd>
      </div>
      <p>
        {text}
      </p>
    </li>
  );
}

ShortcutsItem.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function ShortcutsBar({ onClose }) {
  return (
    <div className="shortcuts-bar">
      <h2 className="shortcuts-bar__title">
        Keyboard shortcuts
      </h2>

      <button
        className="shortcuts-bar__close"
        type="button"
        onClick={onClose}
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      <ul className="shortcuts-bar__list">
        {shortcuts.map((item) => (
          <ShortcutsItem {...item} key={item.title} />
        ))}
      </ul>
    </div>
  );
}

ShortcutsBar.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ShortcutsBar;
