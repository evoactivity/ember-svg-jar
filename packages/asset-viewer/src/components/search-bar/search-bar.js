import React, { useState, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryParam } from 'use-query-params';
import useDebounce from '../../utils/use-debounce';
import { ReactComponent as CancelIcon } from '../../images/icons/cancel.svg';
import { ReactComponent as SearchIcon } from '../../images/icons/search.svg';
import './search-bar.scss';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useQueryParam('q');
  const [input, setInput] = useState(searchQuery);
  const setQuery = useDebounce(setSearchQuery, { delay: 300, leading: true });
  const inputRef = useRef();

  useHotkeys('/', (event) => {
    event.preventDefault();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  function setInputAndQuery(value) {
    setInput(value);
    setQuery(value);
  }

  function handleEscape() {
    if (input) {
      setInputAndQuery(null);
      return;
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }
  }

  return (
    <div className="search-bar">
      <label
        className="search-bar__label"
        htmlFor="searchBarInput"
        aria-label="Search assets"
      >
        <SearchIcon />
      </label>

      <input
        className="search-bar__input"
        id="searchBarInput"
        name="searchInput"
        type="text"
        placeholder="Search assets..."
        value={input || ''}
        ref={inputRef}
        onChange={({ target }) => {
          setInputAndQuery(target.value);
        }}
        onKeyDown={({ key }) => {
          if (key === 'Escape') {
            handleEscape();
          }
        }}
      />

      {input && (
        <button
          className="search-bar__reset"
          type="button"
          aria-label="Clear search"
          onClick={() => setInputAndQuery(null)}
        >
          <CancelIcon />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
