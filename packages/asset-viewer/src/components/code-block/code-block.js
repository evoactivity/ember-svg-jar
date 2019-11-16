import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-handlebars';
import 'prismjs/components/prism-markup-templating';
import './code-block.scss';

function CodeBlock({
  code,
  language,
  className,
  numbers,
}) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre
      className={classNames('code-block', className, {
        'line-numbers': numbers,
      })}
    >
      <code className={classNames({ [`language-${language}`]: language })}>
        {code}
      </code>
    </pre>
  );
}

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  className: PropTypes.string,
  numbers: PropTypes.bool,
};

CodeBlock.defaultProps = {
  className: null,
  numbers: false,
};

export default CodeBlock;
