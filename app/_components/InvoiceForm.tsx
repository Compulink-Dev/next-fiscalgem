// 'use client'
// import React, { useState } from 'react';
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'; // Use legacy build for compatibility
// import 'pdfjs-dist/legacy/build/pdf.worker.entry'; // Worker entry

// const InvoiceForm = () => {
//     const [jsonOutput, setJsonOutput] = useState<string | null>(null);

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();

//         const form = event.target as HTMLFormElement;
//         const fileInput = form.elements.namedItem("pdfFile") as HTMLInputElement;
//         const file = fileInput.files ? fileInput.files[0] : null;

//         if (!file) {
//             console.error("No file selected.");
//             return;
//         }

//         const arrayBuffer = await file.arrayBuffer();
//         const pdfData = new Uint8Array(arrayBuffer);

//         try {
//             const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
//             let textContent = '';

//             for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//                 const page = await pdf.getPage(pageNum);
//                 const text = await page.getTextContent();
//                 textContent += text.items.map((item: any) => item.str).join(' ');
//             }

//             setJsonOutput(textContent);
//         } catch (error) {
//             console.error("Error parsing PDF:", error);
//         }
//     };

//     return (
//         <div className='p-8 space-y-4'>
//             <form className='space-y-4' onSubmit={handleSubmit}>
//                 <label className='text-lg font-bold'>Upload Pdf File to Convert</label>
//                 <input type="file" name="pdfFile" required />
//                 <button type="submit">Upload and Convert</button>
//             </form>
//             {jsonOutput && (
//                 <pre>{jsonOutput}</pre>
//             )}
//         </div>
//     );
// };

// export default InvoiceForm;
