import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from "./InvoicePDF";

const Invoice = () => {

  const [values, setValues] = useState({
    customer: '',
    description: '',
    due_date: '',
    price: '',
    note: '',
  })

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/invoice', values)
    
    //use navigate in here
    .then(res => {
        console.log(res);
        navigate('/')
    })
    .catch(err => console.log(err))
  }

  return (
    <div>
      <div className="createNewInvoice items-center border-b justify-between flex px-6 py-4">
        <h2 className="text-lg font-semibold">Create New Invoice</h2>
        <button className="btn btn-md rounded-full">Cancel</button>
      </div>
      <div className="container px-8 py-8">
        <div className="grid grid-cols-2 gap-8">

          <div className="invoice-details p-6 border rounded-lg">

            <form onSubmit={handleSubmit}>
            <div className="form-package divide-y grid gap-4">

              <div className="bill-to">
                <h2 className="font-semibold pb-4">Bill to</h2>
                <label className="form-control w-full">
                      <div className="label">
                          <span className="label-text">Customer name</span>
                      </div>
                      
                      <input type="text" placeholder="Type here" className="input input-bordered w-full " 
                          onChange={e => setValues({...values, customer: e.target.value})}
                      />
                  </label>

                  {/* <label className="form-control w-full">
                      <div className="label">
                          <span className="label-text">Date</span>
                      </div>
                      
                      <input type="date" placeholder="Type here" className="input input-bordered w-full " 
                          onChange={e => setValues({...values, date: e.target.value})}
                      />
                  </label> */}

                  <label className="form-control w-full">
                      <div className="label">
                          <span className="label-text">Due date payment</span>
                      </div>
                      
                      <input type="date" placeholder="Type here" className="input input-bordered w-full " 
                          onChange={e => setValues({...values, due_date: e.target.value})}
                      />
                  </label>
              </div>

              <div className="invoice-items pt-4">
                <h2 className="font-semibold pb-4">Invoice Details</h2>
                <label className="form-control w-full">
                      <div className="label">
                          <span className="label-text">Description</span>
                      </div>
                      
                      <input type="text" placeholder="Type here" className="input input-bordered w-full " 
                          onChange={e => setValues({...values, description: e.target.value})}
                      />
                  </label>


                  <label className="form-control w-full">
                      <div className="label">
                          <span className="label-text">Package price</span>
                      </div>
                      
                      <input type="number" placeholder="Type here" className="input input-bordered w-full " 
                          onChange={e => setValues({...values, price: e.target.value})}
                      />
                  </label>
              </div>

              <div className="notes">
                  <label className="form-control w-full">
                      <div className="label">
                          <span className="label-text">Notes</span>
                      </div>
                      
                      <input type="text" placeholder="Type here" className="input input-bordered w-full " 
                          onChange={e => setValues({...values, note: e.target.value})}
                      />
                  </label>
              </div>

                <button className="btn btn-md btn-success text-white mt-6">Save</button>
            </div>

            </form>

          </div>

          {/* NOTE: This code for preview the Invoice */}
          <div className="Preview">
            <div className="p-6 border rounded-lg bg-gray-50 shadow">
              <div className="header flex justify-between items-center w-full pb-6">
                <h2 className="font-semibold text-lg">Invoice Preview</h2>
                  <PDFDownloadLink document={<InvoicePDF values={values} />} fileName="invoice.pdf">
                    {({ loading }) => (
                      <button className="btn btn-primary btn-sm">
                        {loading ? 'Loading...' : 'Download PDF'}
                      </button>
                    )}
                  </PDFDownloadLink>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">Invoice</h3>
                <p className="text-sm text-gray-500">Date: {values.date || "dd/mm/yyyy"}</p>

                <div className="mt-4">
                  <p className="text-md font-semibold">Bill to:</p>
                  <p className="text-gray-700">{values.customer || "Customer Name"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-md font-semibold">Description:</p>
                  <p className="text-gray-700">{values.description || "Service Description"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-md font-semibold">Due Date:</p>
                  <p className="text-gray-700">{values.due_date || "dd/mm/yyyy"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-md font-semibold">Package Price:</p>
                  <p className="text-gray-700">Rp{values.price || "0.00"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-md font-semibold">Notes:</p>
                  <p className="text-gray-700 italic">{values.note || "No additional notes"}</p>
                </div>
            </div>
          </div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default Invoice;
