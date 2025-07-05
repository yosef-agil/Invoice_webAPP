import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { Link } from "react-router-dom";
import { Layout, Trash2, Eye, EyeOff } from 'lucide-react';

const Invoice = () => {
  const [values, setValues] = useState({
    customer: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    note: '',
    items: [],
    discount: '',
    downpayment: ''
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [displayValues, setDisplayValues] = useState({});
  
  const subtotal = values.items.reduce((acc, item) => acc + Number(item.price), 0);
  const downpayment = Number(values.downpayment) || 0;
  const discountAmount = (subtotal * (values.discount || 0)) / 100;
  const total = subtotal - downpayment - discountAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const invoiceData = {
      ...values,
      downpayment: Number(values.downpayment) || 0,
      discount: values.discount || 0,
      total: total,
    };
  
    axios
      .post(`${import.meta.env.VITE_API_URL}/invoice`, invoiceData)
      .then((res) => {
        console.log(res);
        setPopupMessage("Data berhasil disimpan!");
        setPopupType("success");
        setTimeout(() => {
          setPopupMessage("");
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setPopupMessage("Gagal menyimpan data!");
        setPopupType("error");
        setTimeout(() => {
          setPopupMessage("");
        }, 3000);
      });
  };

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
        let rawValue = value.replace(/\D/g, "");
        let formattedValue = formatRupiah(rawValue);

        setValues(prevValues => {
            const newItems = [...prevValues.items];
            newItems[index][field] = rawValue;
            return { ...prevValues, items: newItems };
        });

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

  // Handler khusus untuk input date
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    console.log('Date value:', dateValue); // Debug log
    setValues(prevValues => ({
      ...prevValues,
      due_date: dateValue
    }));
  };

  const formatRupiah = (value) => {
    if (!value) return "";
    let numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {popupMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white ${
            popupType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {popupMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Invoice</h2>
            
            {/* Toggle Preview Button - Hanya tampil di mobile */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Form Section */}
          <div className={`${showPreview ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Bill To Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Bill to</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer name
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter customer name" 
                        value={values.customer}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        onChange={e => setValues({...values, customer: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due date payment
                      </label>
                      <input 
                        type="date" 
                        value={values.due_date}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        onChange={handleDateChange}
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Items Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Invoice Details</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {values.items.map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                          <button 
                            type="button"
                            onClick={() => removeItem(index)} 
                            className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <input 
                              type="text" 
                              placeholder="Enter description" 
                              value={item.description} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price
                            </label>
                            <input 
                              type="text" 
                              placeholder="Enter price" 
                              value={displayValues[index] || item.price} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                              onChange={(e) => handleItemChange(index, "price", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      type="button"
                      onClick={addItem}
                      className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                    >
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Discount and Payment Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input 
                      type="number" 
                      placeholder="Enter discount" 
                      value={values.discount} 
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={(e) => setValues({ ...values, discount: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Down Payment
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter down payment" 
                      value={formatRupiah(values.downpayment)} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        setValues({ ...values, downpayment: rawValue });
                      }}
                    />
                  </div>
                </div>

                {/* Notes Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea 
                    placeholder="Enter additional notes" 
                    rows="3"
                    value={values.note}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    onChange={e => setValues({...values, note: e.target.value})}
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Invoice
                </button>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <EyeOff size={20} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Invoice</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Due date: {values.due_date || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Bill to:</p>
                  <p className="text-gray-700">{values.customer || "Customer Name"}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Invoice Items:</p>
                  
                  {values.items.length > 0 ? (
                    <div className="space-y-2">
                      {values.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded border text-sm">
                          <span className="flex-1 text-gray-700">
                            {item.description || "No description"}
                          </span>
                          <span className="font-medium text-gray-900 ml-2">
                            Rp{formatNumber(item.price) || "0"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-white rounded border">
                      <p className="text-sm">No items added yet</p>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">Rp{formatNumber(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Down Payment:</span>
                    <span className="font-medium">Rp{formatNumber(downpayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Discount ({values.discount || 0}%):</span>
                    <span>- Rp{formatNumber(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>Rp{formatNumber(total)}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2 pt-4">
                  <p className="text-sm font-semibold text-gray-900">Notes:</p>
                  <p className="text-sm text-gray-700 italic">
                    {values.note || "No additional notes"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;