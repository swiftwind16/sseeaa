import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface Warehouse {
  id: number;
  name: string;
  location: string;
  created_at: string;
}

const WarehouseDetail = () => {
  const { location } = useParams<{ location: string }>();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = new URLSearchParams(useLocation().search);
  const warehouseName = searchParams.get('name') || '';

  useEffect(() => {
    if (!location || !warehouseName) {
      setWarehouses([]);
      setLoading(false);
      return;
    }

    // Fetch warehouses filtered by name and country
    fetch(`${API_ENDPOINTS.warehouses}?name=${encodeURIComponent(warehouseName)}&country=${encodeURIComponent(location)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Received warehouses:', data);
        setWarehouses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching warehouses:', error);
        setLoading(false);
      });
  }, [location, warehouseName]);

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 pt-8">
      <Link to="/">
        <img src="/logo.png" alt="SSEEAA" className="w-24 h-auto mb-4 cursor-pointer" />
      </Link>
      
      <div className="flex items-center mb-4">
        <Link 
          to={`/warehouses?name=${warehouseName}`} 
          className="text-blue-600 text-sm mr-4"
        >
          &lt; 返回搜索结果
        </Link>
        <h1 className="text-lg font-medium">全部推荐结果</h1>
        <span className="mx-2 text-gray-400">推荐详情 &gt;</span>
      </div>

      {/* Request Summary */}
      <div className="bg-white rounded-lg mb-4">
        <div className="p-4 border-b">
          <h2 className="font-medium mb-2">需求摘要</h2>
          <div className="text-sm text-gray-600">
            <p>仓库名称：{warehouseName}</p>
            <p>地区：{location}</p>
            <p>时间：{new Date().toLocaleString('zh-CN')}</p>
            <p className="mt-2 text-gray-500">
              为您找到 {warehouses.length} 个匹配的仓库
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Warehouses */}
      <div className="bg-white rounded-lg mb-4">
        <div className="p-4">
          <h2 className="font-medium mb-4">推荐仓库</h2>
          <div className="space-y-4">
            {warehouses.map(warehouse => (
              <div key={warehouse.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{warehouse.name}</h3>
                  <Link 
                    to={`/warehouse/price/${warehouse.id}`} 
                    className="text-blue-600 text-sm"
                  >
                    查看报价 &gt;
                  </Link>
                </div>
                <p className="text-gray-500 text-sm mt-1">{warehouse.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-500 text-sm">
        后续合作指引
      </div>
    </div>
  );
};

export default WarehouseDetail; 