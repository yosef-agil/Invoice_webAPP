import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFInvoice from "./PDFInvoice";
import { FileDown } from 'lucide-react';


function Read() {
  // Define the id with useParams to show the id and data
  const { id } = useParams();
  const [invoice, setInvoice] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8081/read/${id}`)
      .then(res => {
        console.log("API Response:", res.data);
        setInvoice(res.data); // Gunakan res.data langsung karena sudah objek
      })
      .catch(err => console.error(err));
  }, [id]);  

    // Hitung subtotal dari items
    const subtotal = invoice?.items
      ? invoice.items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0)
      : 0;
  
    const downpayment = parseFloat(invoice?.downpayment || 0);

    // Ambil nilai diskon dan pastikan itu angka
    const discount = parseFloat(invoice?.discount || 0) / 100 * subtotal;
  
    // Hitung total akhir
    const total = subtotal - downpayment - discount;
    
  

  return (
    <div>
        <div className="createNewInvoice items-center border-b justify-between flex px-6 py-4">
            <h2 className="text-lg font-semibold">Detail Invoice</h2>
    
            <div className="action-btn flex gap-3">
                <Link to="/" className="btn btn-md">
                Back
                </Link>
                <Link to={`/edit/${invoice?.id}`} className="btn btn-md">
                Edit
                </Link>

                <PDFDownloadLink
                    document={<PDFInvoice invoice={invoice} />}
                    fileName={`Invoice_${invoice?.id}.pdf`}
                    className="btn btn-md btn-primary"
                    ><FileDown /> Download PDF
                    {({ loading }) => (loading ? "Loading PDF..." : "Download PDF")}
                </PDFDownloadLink>
            </div>

        </div>

        <div className="container px-8 py-8">
            <div className="w-full max-w-4xl mx-auto overflow-x-auto ">


            <div className="Preview">
            <div className="p-6 border rounded-lg bg-gray-50 shadow">
                <div className="header flex justify-between items-center w-full pb-6">
                <h2 className="font-semibold text-lg">Invoice Preview</h2>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">INVOICE {invoice?.inv_id}</h3>
                <p className="text-sm text-gray-500">
                    Due date: {invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : "N/A"}
                </p>

                <div className="mt-4">
                    <p className="text-md font-semibold">Bill to:</p>
                    <p className="text-gray-700">{invoice?.customer || "N/A"}</p>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <p className="text-md font-semibold">Invoice Items:</p>
                    <div className="wrap-table rounded-md overflow-hidden border border-gray-300">
                    <table className="table-auto rounded-lg w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-100 border-gray-300">
                            <th className="w-3/4 px-4 py-2 border-gray-300">Items</th>
                            <th className="w-1/4 px-4 py-2 text-left border-gray-300">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoice?.items?.length > 0 ? (
                            invoice.items.map((item, index) => (
                            <tr key={index} className=" border-gray-200">
                                <td className="px-4 py-2">{item.description}</td>
                                <td className="w-1/4 px-4 py-2 text-left whitespace-nowrap">
                                Rp{parseFloat(item.price).toLocaleString("id-ID")}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr className="border-gray-200">
                            <td colSpan="2" className="text-gray-700 text-center py-2 ">
                                No items added
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>


                    {/* Tambahkan Subtotal, Diskon, dan Total */}
                    <div className="mt-6 border-t pt-6 pb-6 text-right gap-2 flex flex-col">
                    <p className="text-lg font-semibold">Subtotal: Rp{subtotal.toLocaleString("id-ID")}</p>
                    <p className="text-lg font-semibold">Down Payment: Rp{downpayment.toLocaleString("id-ID")}</p>
                    <p className="text-md text-red-600">Diskon ({invoice.discount || 0}%): Rp{discount.toLocaleString("id-ID")}</p>
                    <p className="text-xl font-bold">Total: Rp{total.toLocaleString("id-ID")}</p>
                    </div>

                    <div className="mt-4 border-t pt-4 pb-4">
                    <p className="text-gray-700">Note: {invoice?.note || "N/A"}</p>
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
