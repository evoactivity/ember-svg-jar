import { useEffect, useRef, useState } from 'react';

/**
  A hook for detecting and responding to media queries.

  **Examples:**

  ```javascript
  const Component = () => {
    const mq = useMediaQueries({
      mobile: '(max-width: 400px)',
      desktop: '(min-width: 700px)',
    });

    return (
      <div>
        {mq.mobile && <MobileBar />}
      </div>
    );
  };
  ```

  For 600px screen it would return:

  ```json
  {
    matches: ['mobile']
    mobile: true,
    desktop: false
  }
  ```

  For 800px screen it would return:

  ```json
  {
    matches: ['mobile', 'desktop']
    mobile: true,
    desktop: true
  }
  ```
*/
export default function useMediaQueries(breakpoints) {
  const [matches, setMatches] = useState([]);
  const matchers = useRef();

  const helpers = Object.keys(breakpoints).reduce((acc, name) => {
    acc[name] = matches.includes(name);
    return acc;
  }, {});

  useEffect(() => {
    function updateMatches() {
      const newMatches = matchers.current
        .filter(({ matcher }) => matcher.matches)
        .map(({ name }) => name);
      setMatches(newMatches);
    }

    matchers.current = Object.keys(breakpoints).map((name) => (
      { name, matcher: window.matchMedia(breakpoints[name]) }
    ));

    matchers.current.forEach(({ matcher }) => {
      matcher.addListener(updateMatches);
    });

    updateMatches();

    return () => {
      matchers.current.forEach(({ matcher }) => {
        matcher.removeListener(updateMatches);
      });

      matchers.current = null;
    };
  }, [breakpoints]);

  return {
    matches,
    ...helpers,
  };
}
