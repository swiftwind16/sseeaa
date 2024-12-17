import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface SearchRecord {
  request_id: number;
  warehouse_name: string;
  created_at: string;
  matched_warehouse: {
    warehouse_id: number;
    name: string;
    location: string;
    price: number;
  };
}

const SearchHistory = () => {
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_ENDPOINTS.history}`)
      .then(response => response.json())
      .then(data => {
        const historyData = Array.isArray(data) ? data : [];
        setHistory(historyData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching history:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 pt-8">
      <Link to="/">
        <img src="/logo.png" alt="SSEEAA" className="w-24 h-auto mb-8 cursor-pointer" />
      </Link>
      
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-6">历史搜索记录</h1>
        
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-500">暂无搜索记录</div>
          ) : (
            history.map(record => (
              <div key={record.request_id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-medium">{record.warehouse_name}</h2>
                    <p className="text-gray-500 text-sm">
                      {new Date(record.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <Link
                    to={`/warehouses?name=${encodeURIComponent(record.warehouse_name)}`}
                    className="text-blue-600 text-sm"
                  >
                    查看详情 &gt;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHistory; 