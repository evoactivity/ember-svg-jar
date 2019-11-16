import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const hasDOM = typeof window !== 'undefined';

function Portal({ children, elementID }) {
  return hasDOM && createPortal(
    children,
    document.getElementById(elementID),
  );
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  elementID: PropTypes.string,
};

Portal.defaultProps = {
  elementID: 'portal',
};

export default Portal;
