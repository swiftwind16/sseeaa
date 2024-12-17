import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import Header from '../components/Header';

const RequestForm = () => {
  const [warehouseName, setWarehouseName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with warehouse name:', warehouseName);
    
    try {
      const response = await fetch(API_ENDPOINTS.requests, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: localStorage.getItem('merchantId'),
          warehouse_name: warehouseName,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Navigating to:', `/warehouses?name=${encodeURIComponent(warehouseName)}`);
        navigate(`/warehouses?name=${encodeURIComponent(warehouseName)}`, { replace: true });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-8">
      <Header />
      <Link to="/">
        <img src="/logo.png" alt="SSEEAA" className="w-24 h-auto mb-8 cursor-pointer" />
      </Link>
      
      {/* Form Container */}
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">我的海外仓需求</h1>
          <button
            type="submit"
            form="requestForm"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            提交
          </button>
        </div>

        <form id="requestForm" onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-600 text-sm mb-8">
            海外仓一站式服务为您优化服务，计算关税费用，你提供的信息将帮助我们
            了解您业务的需求和痛点。
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">仓库名称</label>
              <input
                type="text"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入仓库名称"
                required
              />
            </div>
            {/* Add more form fields as needed */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm; 