import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const IntroPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <Header />
      
      {/* Logo */}
      <img 
        src="/logo.png" 
        alt="SSEEAA" 
        className="w-24 h-auto mb-16"
      />
      
      {/* Main Content */}
      <div className="text-center max-w-lg">
        <h1 className="text-2xl font-bold mb-4">
          10秒钟免费获得
          <br />
          靠谱海外仓的精确报价
        </h1>
        
        <p className="text-gray-600 mb-8 text-sm">
          海外仓生态联合平台的对外介绍平台，我们用服务
          <br />
          商家的生命在追求质量、口碑、费用。
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/request"
            className="block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            提交需求
          </Link>

          {!localStorage.getItem('token') && (
            <Link
              to="/auth"
              className="block text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              登录/注册
            </Link>
          )}

          {/* More Info Link */}
          <div className="mt-4">
            {localStorage.getItem('token') ? (
              <Link
                to="/history"
                className="text-blue-600 text-sm hover:underline"
              >
                查看历史推荐 →
              </Link>
            ) : (
              <Link
                to="/auth"
                className="text-blue-600 text-sm hover:underline"
              >
                登录后查看历史推荐 →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage; 