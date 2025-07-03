import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Home() {

  const [data, setData] = useState([])

  useEffect(()=>{
      axios.get('${import.meta.env.VITE_API_URL}/test')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [])

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
                {data.map((invoice, index) => {
                    return <tr key={index} >
                        <td>{invoice.inv_id}</td>
                        <td>{invoice.customer}</td>
                        <td>{invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : "N/A"}</td>
                        <td>Rp {invoice.downpayment?.toLocaleString('id-ID')}</td>
                        <td>Rp {invoice.total?.toLocaleString('id-ID')}</td>
                        <td className='gap-3 flex'>
                            <Link to={`/read/${invoice.id}`} className="btn btn-sm">View</Link>
                            <Link to={`/edit/${invoice.id}`} className='btn btn-sm'>Edit</Link>
                            <button className="btn btn-sm btn-outline btn-error">Delete</button>
                        </td>

                    </tr>
                })}
            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
}

export default Home;
