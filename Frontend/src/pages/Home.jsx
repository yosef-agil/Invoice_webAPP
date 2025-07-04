import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/invoice`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          throw new Error('Data is not an array');
        }
      })
      .catch(err => {
        setError(err.message);
        console.error('API Error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (data.length === 0) return <div className="p-8 text-center">No invoices found.</div>;

  return (
    <Layout>

    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Home</h2>
      </div>   

      <div className="p-4 md:p-8">
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden w-full md:table border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Down Payment</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((invoice, index) => (
                <tr key={invoice.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{invoice.inv_id}</td>
                  <td className="px-4 py-3">{invoice.customer}</td>
                  <td className="px-4 py-3">
                    {invoice?.due_date 
                      ? new Date(invoice.due_date).toLocaleDateString("id-ID") 
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">Rp {invoice.downpayment?.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">Rp {invoice.total?.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/read/${invoice.id}`} className="btn btn-sm btn-outline">View</Link>
                      <Link to={`/edit/${invoice.id}`} className="btn btn-sm btn-outline">Edit</Link>
                      <button className="btn btn-sm btn-outline btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {data.map((invoice, index) => (
              <div key={invoice.id || index} className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID</p>
                    <p>{invoice.inv_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p>{invoice.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p>
                      {invoice?.due_date 
                        ? new Date(invoice.due_date).toLocaleDateString("id-ID") 
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Down Payment</p>
                    <p>Rp {invoice.downpayment?.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total</p>
                    <p>Rp {invoice.total?.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link to={`/read/${invoice.id}`} className="btn btn-sm btn-outline flex-1">View</Link>
                  <Link to={`/edit/${invoice.id}`} className="btn btn-sm btn-outline flex-1">Edit</Link>
                  <button className="btn btn-sm btn-outline btn-error flex-1">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    </Layout>
  );
}

export default Home;