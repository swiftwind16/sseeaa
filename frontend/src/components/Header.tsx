import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('merchantId');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="absolute top-4 right-4 flex items-center space-x-4">
      {username ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Hi, {username}</span>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            退出
          </button>
        </div>
      ) : (
        <Link
          to="/auth"
          className="text-blue-600 hover:text-blue-800"
        >
          登录/注册
        </Link>
      )}
    </div>
  );
};

export default Header; 