import React, {
  useState, useCallback, useContext, createContext,
} from 'react';
import PropTypes from 'prop-types';
import Notifier from '../components/notifier';
import makeID from '../utils/make-id';

const NotifierContext = createContext();

function useNotifier() {
  const context = useContext(NotifierContext);

  if (context === undefined) {
    throw new Error('useNotifier must be used within NotifierProvider');
  }

  return context;
}

function NotifierProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((text) => {
    setMessages((items) => [{ id: makeID('notifier'), text }, ...items]);
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((items) => items.filter((item) => item.id !== id));
  }, []);

  return (
    <NotifierContext.Provider value={addMessage}>
      {children}
      <Notifier messages={messages} onClose={removeMessage} />
    </NotifierContext.Provider>
  );
}

NotifierProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useNotifier, NotifierProvider };
