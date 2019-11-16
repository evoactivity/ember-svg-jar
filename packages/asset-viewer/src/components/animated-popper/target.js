import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Reference } from 'react-popper';
import mergeRefs from '../../utils/merge-refs';

function Target({ children }) {
  return (
    <Reference>
      {({ ref }) => cloneElement(children, { ref: mergeRefs(ref, children.ref) })}
    </Reference>
  );
}

Target.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Target;
