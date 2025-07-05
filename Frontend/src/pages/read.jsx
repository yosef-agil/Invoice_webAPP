import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFInvoice from "./PDFInvoice";
import { FileDown, Edit, ArrowLeft } from 'lucide-react';

function Read() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/read/${id}`)
      .then(res => {
        console.log("API Response:", res.data);
        setInvoice(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);  

  // Hitung subtotal dari items
  const subtotal = invoice?.items
    ? invoice.items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0)
    : 0;

  const downpayment = parseFloat(invoice?.downpayment || 0);
  const discount = parseFloat(invoice?.discount || 0) / 100 * subtotal;
  const total = subtotal - downpayment - discount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Detail
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Link 
                to={`/edit/${invoice?.id}`} 
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                <Edit size={16} />
                Edit
              </Link>

              <PDFDownloadLink
                document={<PDFInvoice invoice={invoice} />}
                fileName={`Invoice_${invoice?.id}.pdf`}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <FileDown size={16} />
                PDF
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            
            {/* Invoice Header */}
            <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
            </div>

            {/* Invoice Content */}
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* Invoice Title & Due Date */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900">
                    INVOICE {invoice?.inv_id}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Due date: {invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : "N/A"}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">Bill to:</p>
                <p className="text-gray-700 text-base">
                  {invoice?.customer || "N/A"}
                </p>
              </div>

              {/* Invoice Items */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-900">Invoice Items:</p>
                
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {invoice?.items?.length > 0 ? (
                          invoice.items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Rp{parseFloat(item.price).toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                              No items added
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                  {invoice?.items?.length > 0 ? (
                    invoice.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-500">Item {index + 1}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              Rp{parseFloat(item.price).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center border">
                      <p className="text-sm text-gray-500">No items added</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Calculations */}
              <div className="border-t pt-6">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        Rp{subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Down Payment:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        Rp{downpayment.toLocaleString("id-ID")}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-red-600">
                        Discount ({invoice.discount || 0}%):
                      </span>
                      <span className="text-sm font-semibold text-red-600">
                        Rp{discount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-gray-900">
                          Rp{total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="border-t pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Notes:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      {invoice?.note || "No additional notes"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Read;