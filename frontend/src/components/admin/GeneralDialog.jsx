import React from 'react';

const Dialog = ({ message, type = 'info', onClose }) => {
  // Màu nền theo type
  const bgColors = {
    error: '#f8d7da',
    success: '#d4edda',
    warning: '#fff3cd',
    info: '#cce5ff',
  };

  const textColors = {
    error: '#721c24',
    success: '#155724',
    warning: '#856404',
    info: '#004085',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose} // Click nền đóng dialog
    >
      <div
        onClick={e => e.stopPropagation()} // Ngăn không cho click lan ra ngoài
        style={{
          backgroundColor: bgColors[type] || bgColors.info,
          color: textColors[type] || textColors.info,
          padding: 20,
          borderRadius: 8,
          minWidth: 300,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          textAlign: 'center',
        }}
      >
        <p style={{ marginBottom: 20 }}>{message}</p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: textColors[type] || textColors.info,
            color: bgColors[type] || bgColors.info,
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Dialog;
