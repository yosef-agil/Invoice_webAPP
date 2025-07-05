import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash } from "lucide-react";

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
    <div className='min-h-screen bg-gray-50'>
      
      <div className="bg-white flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Home</h2>
      </div>   

      <div className="p-4 md:p-8">
        {/* Desktop Table (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Down Payment</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((invoice, index) => (
                <tr key={invoice.id || index} className="hover:bg-gray-50">
                  <td>{invoice.inv_id}</td>
                  <td>{invoice.customer}</td>
                  <td>
                    {invoice?.due_date 
                      ? new Date(invoice.due_date).toLocaleDateString("id-ID") 
                      : "N/A"}
                  </td>
                  <td>Rp {invoice.downpayment?.toLocaleString('id-ID')}</td>
                  <td>Rp {invoice.total?.toLocaleString('id-ID')}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/read/${invoice.id}`} className="btn btn-sm">View</Link>
                      <Link to={`/edit/${invoice.id}`} className="btn btn-sm">Edit</Link>
                      <Link to={`/delete/${invoice.id}`} className="btn btn-sm btn-error"> 
                        <Trash color="#ffffff" className="w-4 h-4"/> 
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (visible only on mobile) */}
        <div className="md:hidden space-y-4">
          {data.map((invoice, index) => (
            <div key={invoice.id || index} className="border rounded-lg p-4 bg-base-100">
              <div className="grid grid-cols-2 gap-4 ">

                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p className="font-medium">{invoice.inv_id}</p>
                </div>
                
                <div className="col-span-2">
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
                  <p className="font-semibold">Rp {invoice.total?.toLocaleString('id-ID')}</p>
                </div>

              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <Link to={`/read/${invoice.id}`} className="btn btn-m ">View</Link>
                <Link to={`/edit/${invoice.id}`} className="btn btn-m ">Edit</Link>
                <Link to={`/delete/${invoice.id}`} className="btn btn-m btn-error">
                  <Trash color="#ffffff" className="w-4 h-4"/>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;