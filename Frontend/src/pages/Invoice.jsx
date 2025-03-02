import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const Invoice = () => {

  const [values, setValues] = useState({
    customer: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    note: '',
    items: [], // Tambahkan items ke dalam state
  });

  const navigate = useNavigate();
  const [items, setItems] = useState([]);

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

  // Function to delete and new items button
  const addItem = () => {
    setValues(prevValues => ({
      ...prevValues,
      items: [...prevValues.items, { description: '', price: '' }]
    }));
  };

  const removeItem = (index) => {
    setValues(prevValues => ({
      ...prevValues,
      items: prevValues.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setValues(prevValues => {
      const newItems = [...prevValues.items];
      newItems[index][field] = value;
      return { ...prevValues, items: newItems };
    });
  };

  // titik otomatis
  const formatRupiah = (value) => {
    // Hanya ambil angka, hapus karakter non-digit
    let numberString = value.replace(/\D/g, "");

    // Tambahkan titik setiap 3 digit dari belakang
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // titik di preview
  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num.replace(/\./g, ""));
  };


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

                <div className="items-wrap p-4 bg-gray-50 border rounded-md">
                {values.items.map((item, index) => (

                <div key={index} className="flex gap-4 items-center">
                  <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Description</span>
                        </div>
                        
                        <input type="text" placeholder="Type here" value={item.description} className="input input-bordered w-full " 
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                  </label>


                  <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Price</span>
                        </div>
                        
                        <input type="number" placeholder="Type here" value={item.price} className="input input-bordered w-full " 
                            onChange={(e) => handleItemChange(index, "price", formatRupiah(e.target.value))}
                        />
                  </label>
                  <button onClick={() => removeItem(index)} className="btn btn-error btn-sm">X</button>
                </div>

                ))}
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); // Cegah reload halaman
                      addItem();
                    }} 
                    className="btn btn-sm btn-primary mt-2"
                  >
                    + Add Item
                  </button>
                </div>
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
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">Invoice</h3>
                <p className="text-sm text-gray-500">Due date: {values.due_date || "dd/mm/yyyy"}</p>

                <div className="mt-4">
                  <p className="text-md font-semibold">Bill to:</p>
                  <p className="text-gray-700">{values.customer || "Customer Name"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-md font-semibold">Invoice Items:</p>
                  {values.items.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {values.items.map((item, index) => (
                        <li key={index}>
                          {item.description || "No description"} - Rp{formatNumber(item.price) || "0.00"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">No items added</p>
                  )}
                </div>

                {/* <div className="mt-4">
                  <p className="text-md font-semibold">Due Date:</p>
                  <p className="text-gray-700">{values.due_date || "dd/mm/yyyy"}</p>
                </div> */}

                {/* <div className="mt-4">
                  <p className="text-md font-semibold">Package Price:</p>
                  <p className="text-gray-700">Rp{values.price || "0.00"}</p>
                </div> */}

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
