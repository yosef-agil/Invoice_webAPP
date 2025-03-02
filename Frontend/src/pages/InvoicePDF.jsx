import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
  text: { fontSize: 12, marginBottom: 5 },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1 },
  tableRow: { flexDirection: 'row' },
  tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, padding: 5 },
});

const InvoicePDF = ({ values }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      <View style={styles.section}>
        <Text style={styles.title}>Invoice</Text>
        <Text style={styles.text}>Customer: {values.customer || "N/A"}</Text>
        <Text style={styles.text}>Date: {values.date || "dd/mm/yyyy"}</Text>
        <Text style={styles.text}>Due Date: {values.due_date || "dd/mm/yyyy"}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Description</Text>
          <Text style={styles.tableCol}>Price</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>{values.description || "Service Description"}</Text>
          <Text style={styles.tableCol}>Rp{values.price.toLocaleString('id-ID') || "0.00"}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Notes: {values.note || "No additional notes"}</Text>
      </View>
      
    </Page>
  </Document>
);

export default InvoicePDF;
