import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Home() {

  const [data, setData] = useState([])

  useEffect(()=>{
      axios.get('http://localhost:8081/invoice')
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
                <th></th>
                <th>Customer</th>
                <th>Due date</th>
                <th>Total</th>
                <th>Action</th>
            </tr>
            </thead>

            <tbody>
                {data.map((invoice, index) => {
                    return <tr key={index} >

                        <td>{invoice.invoice_id}</td>
                        <td>{invoice.customer}</td>
                        <td>{invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : "N/A"}</td>
                        <td>Rp {invoice.total?.toLocaleString('id-ID')}</td>
                        <td className='gap-3 flex'>
                            <Link to={`/read/${invoice.id}`} className="btn btn-sm">View</Link>
                            <Link to={`/edit/${invoice.id}`} className='btn btn-sm'>Edit</Link>
                            <button className="btn btn-error btn-sm">Delete</button>
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
