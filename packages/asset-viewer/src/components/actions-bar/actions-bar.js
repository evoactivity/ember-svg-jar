import React from 'react';
import { useQueryParam } from 'use-query-params';
import { useBreakpoints } from '../../contexts/breakpoints';
import { useDrawersActions } from '../../contexts/drawers';
import TooltipButton from '../tooltip-button';
import SearchBar from '../search-bar';
import ArrowButton from '../arrow-button';
import Dropdown from '../dropdown';
import { ReactComponent as BurgerIcon } from '../../images/icons/burger.svg';
import { ReactComponent as PaneIcon } from '../../images/icons/pane.svg';
import './actions-bar.scss';

function ActionsBar() {
  const [sortBy, setSortBy] = useQueryParam('sort');
  const { toggleSidebar, togglePane } = useDrawersActions();
  const breakpoints = useBreakpoints();

  return (
    <div className="actions-bar">
      <section className="actions-bar__section">
        {!breakpoints.large && (
          <TooltipButton
            className="btn btn--icon-only actions-bar__item"
            label="Show sidebar"
            onClick={toggleSidebar}
          >
            <BurgerIcon />
          </TooltipButton>
        )}

        <SearchBar />
      </section>

      <section className="actions-bar__section">
        <Dropdown>
          <Dropdown.Trigger>
            <ArrowButton className="actions-bar__item">
              Sort by
            </ArrowButton>
          </Dropdown.Trigger>

          <Dropdown.Menu>
            <Dropdown.MenuItem
              active={!sortBy}
              onClick={() => setSortBy(null)}
            >
              None
            </Dropdown.MenuItem>

            <Dropdown.MenuItem
              active={sortBy === 'name'}
              onClick={() => setSortBy('name')}
            >
              File name
            </Dropdown.MenuItem>

            <Dropdown.MenuItem
              active={sortBy === 'size'}
              onClick={() => setSortBy('size')}
            >
              Grid size
            </Dropdown.MenuItem>
          </Dropdown.Menu>
        </Dropdown>

        {!breakpoints.medium && (
          <TooltipButton
            className="btn btn--icon-only actions-bar__item"
            label="Show pane"
            onClick={togglePane}
          >
            <PaneIcon />
          </TooltipButton>
        )}
      </section>
    </div>
  );
}

export default ActionsBar;
