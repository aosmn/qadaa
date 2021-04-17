import React, { useState } from 'react';
import '../styles/swipe.scss';

const SwipeComponent = ({ checkedText, unCheckedText, value, onChange }) => {
  const handleChange = v => {
    onChange(!value)
  };
  return (
    <div className={`swipe w-100 ${value ? 'checked' : ''}`}>
      <button
        type='button'
        className={`swipe-tab btn ${value ? 'selected' : ''}`}
        onClick={handleChange}>
        {checkedText}
      </button>
      <button
        type='button'
        className={`swipe-tab btn ${!value ? 'selected' : ''}`}
        onClick={handleChange}>
        {unCheckedText}
      </button>
    </div>
  );
};

export default SwipeComponent;