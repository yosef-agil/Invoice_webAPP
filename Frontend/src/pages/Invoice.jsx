import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { Trash2 } from 'lucide-react';

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
  const [displayValues, setDisplayValues] = useState({});
  
  const subtotal = values.items.reduce((acc, item) => acc + Number(item.price), 0);
  const discountAmount = (subtotal * (values.discount || 0)) / 100;
  const total = subtotal - discountAmount;
  

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
    if (field === "price") {
        let rawValue = value.replace(/\D/g, ""); // Hanya angka
        let formattedValue = formatRupiah(rawValue); // Format angka dengan titik

        // Simpan nilai asli ke values
        setValues(prevValues => {
            const newItems = [...prevValues.items];
            newItems[index][field] = rawValue; // Simpan angka mentah ke state
            return { ...prevValues, items: newItems };
        });

        // Simpan nilai tampilan di displayValues
        setDisplayValues(prevDisplay => ({
            ...prevDisplay,
            [index]: formattedValue
        }));
    } else {
        setValues(prevValues => {
            const newItems = [...prevValues.items];
            newItems[index][field] = value;
            return { ...prevValues, items: newItems };
        });
    }
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
    return new Intl.NumberFormat("id-ID").format(num);
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

                <div key={index} className="flex gap-4 items-end mb-4">
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
                        
                        <input type="text" placeholder="Type here" value={displayValues[index] || item.price} className="input input-bordered w-full " 
                            onChange={(e) => handleItemChange(index, "price", e.target.value)}
                        />
                  </label>
                  <button onClick={() => removeItem(index)} className="btn btn-error btn-md"><Trash2 size={20} color="#ffffff"/></button>
                </div>

                ))}
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); // Cegah reload halaman
                      addItem();
                    }} 
                    className="btn btn-sm btn-primary"
                  >
                   Add Item
                  </button>
                </div>
              </div>

              <div className="discount">
                  <label className="form-control w-full">
                      <div className="label">
                          <span className="label-text">Discount</span>
                      </div>
                      
                      <input type="number" placeholder="Enter discount (e.g. 10)" value={values.discount} className="input input-bordered w-full " 
                          onChange={(e) => setValues({ ...values, discount: e.target.value })}
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
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">Invoice</h3>
                <p className="text-sm text-gray-500">Due date: {values.due_date || "dd/mm/yyyy"}</p>

                <div className="mt-4">
                  <p className="text-md font-semibold">Bill to:</p>
                  <p className="text-gray-700">{values.customer || "Customer Name"}</p>
                </div>

                <div className="mt-4 overflow-x-auto">

                  <p className="text-md font-semibold">Invoice Items:</p>
                  <div className="wrap-table rounded-md overflow-hidden border border-gray-300">
                    <table className="table-auto rounded-lg w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="w-3/4 px-4 py-2">Items</th>
                          <th className="w-1/4 px-4 py-2 text-left">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.items.length > 0 ? (
                          values.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">{item.description || "No description"}</td>
                              <td className="w-1/4 px-4 py-2 text-left whitespace-nowrap">
                                Rp{formatNumber(item.price) || "0.00"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-gray-700 text-center py-2">No items added</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">Rp{formatNumber(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Discount ({values.discount || 0}%):</span>
                      <span>- Rp{formatNumber(discountAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold mt-2">
                      <span>Total:</span>
                      <span>Rp{formatNumber(total)}</span>
                    </div>
                  </div>


                  {/* {values.items.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {values.items.map((item, index) => (
                        <li key={index}>
                          {item.description || "No description"} - Rp{formatNumber(item.price) || "0.00"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">No items added</p>
                  )} */}

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
