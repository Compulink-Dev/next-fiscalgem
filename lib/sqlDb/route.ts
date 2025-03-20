import sql from "mssql";

const config: sql.config = {
  user: process.env.DB_USER || "default_user",
  password: process.env.DB_PASSWORD || "default_password",
  server: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "1433"),
  database: process.env.DB_NAME || "default_db",
  options: { encrypt: false, trustServerCertificate: true },
};

export async function fetchInvoices() {
  try {
    console.log("Connecting to database...");
    await sql.connect(config);
    console.log("Connected to database!");

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

    console.log("Fetched Data:", result.recordset); // Log fetched data
    return result.recordset;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}
