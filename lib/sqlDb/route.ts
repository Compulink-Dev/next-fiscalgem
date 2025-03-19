import sql from "mssql";

const config: sql.config = {
  user: process.env.DB_USER || "default_user",
  password: process.env.DB_PASSWORD || "default_password",
  server: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "default_db",
  options: { encrypt: false, trustServerCertificate: true },
};

export async function fetchInvoices() {
  try {
    await sql.connect(config);
    const query = `
      SELECT 
          doc.strInvDocID,
          doc.dteJournalDate,
          doc.dteSystemDate,
          doc.strUserName,
          doc.strCustName,
          doc.decSubTotal,
          doc.decVAT,
          doc.decTotal,
          doc.strPaidBy,
          doc.strTerm,
          doc.strNotes,
          dt.intLineNo,
          dt.strPartNumber,
          dt.strPartDesc,
          dt.decQty,
          dt.strUnit,
          dt.decPriceEaExc,
          dt.decLineTotExc,
          dt.decLineTaxAmt,
          dt.decPriceEaInc,
          dt.decLineTotInc,
          dt.strTaxCode
      FROM dbo.tblInvoiceDoc AS doc
      INNER JOIN dbo.tblInvoiceDocDT AS dt 
          ON doc.strInvDocID = dt.strInvDocID
      ORDER BY doc.dteJournalDate DESC;
    `;
    const result = await sql.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}
