import React from "react";
import { Document, Page, Text, Image, View, StyleSheet,} from "@react-pdf/renderer";

// Tailwind-like styles using StyleSheet
const styles = StyleSheet.create({
  page: {
    padding: 20, // p-8
    fontSize: 12, // text-sm
    fontFamily: "Helvetica", // font-sans
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row", // flex
    justifyContent: "space-between", // justify-between
    marginBottom: 20, // mb-5
    backgroundColor: "#F6F6F8",
    padding: 24,
  },
  brand: {
    fontWeight: "bold",
    fontSize: 20,
  },
  headerBrand: {
    fontWeight: "bold",
    fontSize: 20,
  },
  image: {
    width: 120, // w-24
    height: 69, // h-12
  },
  section: {
    marginBottom: 10, // mb-2.5
  },
  text: {
    fontSize: 12, // text-sm
    marginBottom: 5, // mb-1
  },
  table: {
    width: "100%", // w-full
    borderStyle: "solid", // border
    borderWidth: 1, // border
    marginTop: 10, // mt-2.5
  },
  row: {
    flexDirection: "row", // flex
  },
  Details:{
    flexDirection: "row", // flex
    justifyContent: "space-between",
  },
  textNote:{
    fontStyle: "italic",
    width:200,
  },
  cellHeader: {
    flex: 1, // flex-1
    borderWidth: 1, // border
    padding: 8, // p-2
    backgroundColor: "#2E2E48", // bg-[#2E2E48]
    color: "white", // text-white
    fontWeight: "bold", // font-bold
  },
  cell: {
    flex: 1, // flex-1
    borderWidth: 1, // border
    padding: 8, // p-2
  },
  totalContainer: {
    marginTop: 30, // mt-4
    alignItems: "flex-end", // items-end
    gap: 4,
  },
  totalText: {
    fontSize: 14, // text-base
    fontWeight: "bold", // font-bold
  },
  sectionFooter: {
    marginTop: 30, // mt-8
    fontSize: 10, // text-xs
    textAlign: "center", // text-center
    backgroundColor: "#F6F6F8",
    padding: 30,
  },
});

const PDFInvoice = ({ invoice }) => {
  const subtotal = invoice?.items?.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0) || 0;
  const downpayment = parseFloat(invoice?.downpayment || 0);
  const discount = (invoice?.discount / 100) * subtotal || 0;
  const total = subtotal - downpayment - discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.wrap}>
          {/* Header */}
          <View style={styles.header}>
            {/* Use the image from the public folder */}
            <Text style={styles.brand}>Thirtyone Studio</Text>
            <Text style={styles.headerBrand}>Invoice</Text>
          </View>

          {/* Info Bisnis dan Pelanggan */}
          <View style={styles.section}>
            <Text style={styles.text}>From: Thirtyone Studio</Text>
            <Text style={styles.text}>Jl. Cungkup No. 466, Sidorejo, Salatiga 50711</Text>
            <Text style={styles.text}>082371097483</Text>
          </View>

          <View style={styles.customer}>
            <Text style={[styles.text, { marginTop: 10 }]}>For: {invoice?.customer || "N/A"}</Text>
            <Text style={styles.text}>Due Date: {invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : "N/A"}</Text>
          </View>

          {/* Tabel Invoice */}
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>Description</Text>
              <Text style={styles.cellHeader}>Total</Text>
            </View>
            {invoice?.items?.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{item.description}</Text>
                <Text style={styles.cell}>Rp {parseFloat(item.price).toLocaleString("id-ID")}</Text>
              </View>
            ))}
          </View>

          <View style={styles.Details}>
            <View>
              <Text style={[styles.textNote, { marginTop: 30 }]}>Note: {invoice?.note || "N/A"}</Text>
            </View>

            {/* Total */}
            <View style={styles.totalContainer}>
              <Text style={styles.text}>Subtotal: Rp{subtotal.toLocaleString("id-ID")}</Text>
              <Text style={styles.text}>Subtotal: Rp{downpayment.toLocaleString("id-ID")}</Text>
              <Text style={styles.text}>Discount {invoice?.discount || 0}%: -Rp{discount.toLocaleString("id-ID")}</Text>
              <Text style={styles.totalText}>Total: Rp{total.toLocaleString("id-ID")}</Text>
            </View>
          </View>

        </View>

        {/* Footer */}
        <View>
          {/* Metode Pembayaran */}
          <View style={styles.section}>
            <Text style={[styles.text, { fontWeight: "bold", marginTop: 10 }]}>Metode Pembayaran:</Text>
            <Text style={styles.text}>BCA (Nadhita Crisya) - 580201024795533</Text>
            <Text style={styles.text}>BRI (Nadhita Crisya) - 0132189968</Text>
            <Text style={styles.text}>BCA (Yosef Agil) - 8445203480</Text>
            <Text style={styles.text}>Jago (Yosef Agil) - 102328996443</Text>
            <Text style={[styles.text, { fontSize: 10, marginTop: 5 }]}>
              *Wajib mengirimkan bukti pembayaran ke WhatsApp admin
            </Text>
          </View>

          <View style={styles.sectionFooter}>
            <Text style={styles.footer}>Thirtyone Studio | thirtyone.studio1@gmail.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Preview Component
// const PDFPreview = () => {
//   // Sample invoice data
//   const sampleInvoice = {
//     customer: "John Doe",
//     discount: 10,
//     items: [
//       { description: "Website Development", due_date: "2023-10-31", price: "5000000" },
//       { description: "Logo Design", due_date: "2023-11-05", price: "1500000" },
//     ],
//   };

//   return (
//     <PDFViewer width="100%" height="600px">
//       <PDFInvoice invoice={sampleInvoice} />
//     </PDFViewer>
//   );
// };

export default PDFInvoice;