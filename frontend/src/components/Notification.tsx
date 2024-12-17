import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md border ${bgColor} ${borderColor}`}>
      <div className="flex items-center">
        <p className={`text-sm ${textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className={`ml-4 ${textColor} hover:opacity-70`}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification; 