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
        // Pastikan response adalah array
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          // Jika bukan array, lempar error
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
    <div>
      <div className="createNewInvoice items-center border-b justify-between flex px-6 py-4">
        <h2 className="text-lg font-semibold">Home</h2>
      </div>   

      <div className="container px-8 py-8">
        <div className="tabel-invoice border overflow-hidden rounded-lg">
          <table className="table">
            <thead>
              <tr>
                <th className="htable">ID</th>
                <th className="htable">Customer</th>
                <th className="htable">Due Date</th>
                <th className="htable">Down Payment</th>
                <th className="htable">Total</th>
                <th className="htable">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((invoice, index) => (
                <tr key={invoice.id || index}>
                  <td>{invoice.inv_id}</td>
                  <td>{invoice.customer}</td>
                  <td>
                    {invoice?.due_date 
                      ? new Date(invoice.due_date).toLocaleDateString("id-ID") 
                      : "N/A"}
                  </td>
                  <td>Rp {invoice.downpayment?.toLocaleString('id-ID')}</td>
                  <td>Rp {invoice.total?.toLocaleString('id-ID')}</td>
                  <td className='gap-3 flex'>
                    <Link to={`/read/${invoice.id}`} className="btn btn-sm">View</Link>
                    <Link to={`/edit/${invoice.id}`} className='btn btn-sm'>Edit</Link>
                    <button className="btn btn-sm btn-outline btn-error">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;