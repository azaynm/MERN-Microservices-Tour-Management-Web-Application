import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { TiTickOutline } from 'react-icons/ti';
import { CSSTransition } from 'react-transition-group';

const Finalize = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Set show message to true after a delay
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1000);

    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="message-container">
      <CSSTransition
        in={showMessage}
        timeout={1000}
        classNames="message"
        unmountOnExit
      >
        <div className="message">
          <FaCheckCircle className="icon" />
          <span>Your tour has been arranged</span>
          <TiTickOutline className="icon" />
        </div>
      </CSSTransition>
    </div>
  );
};

export default Finalize;
