import ReactDOM from 'react-dom';
import { within, waitForElementToBeRemoved } from '@testing-library/react';

window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

it('renders the app from the index without crashing', async () => {
  const rootEl = document.createElement('div');
  rootEl.setAttribute('id', 'root');
  document.body.appendChild(rootEl);

  require('../index');
  const { getByText } = within(document.body);
  await waitForElementToBeRemoved(() => getByText('Loading assets...'));

  ReactDOM.unmountComponentAtNode(rootEl);
  document.body.removeChild(rootEl);
});
