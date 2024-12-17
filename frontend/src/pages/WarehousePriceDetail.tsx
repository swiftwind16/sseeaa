import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface WarehousePrice {
  id: number;
  name: string;
  location: string;
  price: number;
  created_at: string;
}

const WarehousePriceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [warehouse, setWarehouse] = useState<WarehousePrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_ENDPOINTS.warehouses}/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setWarehouse(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching warehouse details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>未找到仓库信息</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 pt-8">
      <img src="/logo.png" alt="SSEEAA" className="w-24 h-auto mb-4" />
      
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-medium">仓库报价详情</h1>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-medium">{warehouse.name}</h2>
            <p className="text-gray-500">{warehouse.location}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">价格信息</h3>
            <p className="text-2xl font-bold text-blue-600">
              ¥{warehouse.price ? warehouse.price.toFixed(2) : '暂无价格'}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">仓库信息</h3>
            <div className="space-y-2 text-gray-600">
              <p>地址：{warehouse.location}</p>
              <p>创建时间：{new Date(warehouse.created_at).toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to={{
              pathname: `/warehouse/${warehouse.location.split('·')[0]}`,
              search: `?name=${warehouse.name}`,
            }}
            className="text-blue-600"
          >
            &lt; 返回列表
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WarehousePriceDetail; 