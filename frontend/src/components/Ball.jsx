// Ball.jsx
import React from 'react';

const Ball = ({ ball }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: ball.color,  // Màu sắc quả bóng
      }}
    />
  );
};

export default Ball;
