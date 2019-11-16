import React from 'react';
import { useDrawersActions } from '../../contexts/drawers';
import TooltipButton from '../tooltip-button';
import TooltipLink from '../tooltip-link';
import { ReactComponent as Logo } from '../../images/logo.svg';
import { ReactComponent as SettingsIcon } from '../../images/icons/settings.svg';
import { ReactComponent as HelpIcon } from '../../images/icons/help.svg';
import { ReactComponent as KeyboardIcon } from '../../images/icons/keyboard.svg';
import { ReactComponent as GithubIcon } from '../../images/icons/github.svg';
import './tab-bar.scss';

function TabBar() {
  const { toggleShortcuts } = useDrawersActions();

  return (
    <nav className="tab-bar">
      <TooltipLink
        className="tab-bar__logo"
        to="https://svgjar.web.app/"
        label="Landing page"
      >
        <Logo />
      </TooltipLink>

      <ul className="tab-bar__section">
        <li className="tab-bar__item">
          <TooltipLink
            className="tab-bar__tab"
            to="https://github.com/ivanvotti/ember-svg-jar/blob/master/docs/configuration.md#configuration-options"
            label="Configuration"
          >
            <SettingsIcon />
          </TooltipLink>
        </li>

        <li className="tab-bar__item">
          <TooltipButton
            className="tab-bar__tab"
            placement="auto"
            label="Shortcuts"
            onClick={toggleShortcuts}
          >
            <KeyboardIcon />
          </TooltipButton>
        </li>
      </ul>

      <ul className="tab-bar__section">
        <li className="tab-bar__item">
          <TooltipLink
            className="tab-bar__tab"
            to="https://github.com/ivanvotti/ember-svg-jar#table-of-contents"
            label="Documentation"
          >
            <HelpIcon />
          </TooltipLink>
        </li>

        <li className="tab-bar__item">
          <TooltipLink
            className="tab-bar__tab"
            to="https://github.com/ivanvotti/ember-svg-jar"
            label="GitHub repository"
          >
            <GithubIcon />
          </TooltipLink>
        </li>
      </ul>
    </nav>
  );
}

export default TabBar;
