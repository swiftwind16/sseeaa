import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import Header from '../components/Header';

interface WarehouseGroup {
  location: string;
  warehouses: Array<{
    id: number;
    name: string;
    location: string;
    created_at: string;
  }>;
}

const WarehouseList = () => {
  const [warehouseGroups, setWarehouseGroups] = useState<WarehouseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const warehouseName = searchParams.get('name') || '';

  const handleWarehouseClick = (group: WarehouseGroup) => {
    navigate(
      `/warehouse/${group.location}?name=${warehouseName}`,
      { state: { warehouses: group.warehouses } }
    );
  };

  useEffect(() => {
    if (!warehouseName) {
      setWarehouseGroups([]);
      setLoading(false);
      return;
    }

    fetch(`${API_ENDPOINTS.warehouses}?name=${encodeURIComponent(warehouseName)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data);
        
        const groups = Object.entries(data).map(
          ([location, warehouses]) => ({
            location,
            warehouses: warehouses as any[],
          })
        );

        console.log('Processed groups:', groups);
        setWarehouseGroups(groups);
        setLoading(false);
      });
  }, [warehouseName]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-8">
      <Header />
      <Link to="/">
        <img src="/logo.png" alt="SSEEAA" className="w-24 h-auto mb-8 cursor-pointer" />
      </Link>
      
      <div className="w-full max-w-lg">
        <h1 className="text-xl font-bold mb-6">全部推荐结果</h1>
        
        <div className="space-y-4">
          {warehouseGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">未找到匹配的仓库</p>
              <p className="text-sm text-gray-400">
                搜索条件：{warehouseName}
              </p>
              <button
                onClick={() => navigate('/request')}
                className="mt-6 text-blue-600 hover:text-blue-800"
              >
                重新搜索 →
              </button>
            </div>
          ) : (
            warehouseGroups.map(group => (
              <div 
                key={group.location}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-medium">{group.location}海外仓</h2>
                    <p className="text-gray-500 text-sm">
                      {new Date().toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleWarehouseClick(group)}
                    className="text-blue-600 text-sm"
                  >
                    查看详情 &gt;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/request')}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            新建
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseList; 