const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

// load the existing PDF document
const pdfBytes = fs.readFileSync('existing_document.pdf');

// parse the PDF document using pdf-lib
const pdfDoc = await PDFDocument.load(pdfBytes);

// get the form fields in the PDF document
const form = pdfDoc.getForm();
const reasonForAmfField = form.getTextField('reason_for_amf');
const agencyTypeField = form.getTextField('agency_type');
const agencyNumberField = form.getTextField('agency_number');
const midField = form.getTextField('mid');
const merchantNameField = form.getTextField('merchant_name');
const startDateField = form.getTextField('start_date');
const endDateField = form.getTextField('end_date');
const agencyCustomerNoField = form.getTextField('agency_customer_no');
const agencyPrincipleNameField = form.getTextField('agency_principle_name');
const accountField = form.getTextField('account');
const emailField = form.getTextField('email');
const addressField = form.getTextField('address');
const settlementTypeField = form.getTextField('settlement_type');
const periodField = form.getTextField('period');

// update the field values with the data from your form
reasonForAmfField.setText(req.body.reasonForAmf);
agencyTypeField.setText(req.body.agencyType);
agencyNumberField.setText(req.body.agencyNumber);
midField.setText(req.body.mid);
merchantNameField.setText(req.body.merchantName);
startDateField.setText(req.body.startDate);
endDateField.setText(req.body.endDate);
agencyCustomerNoField.setText(req.body.agencyCustomerNo);
agencyPrincipleNameField.setText(req.body.agencyPrincipleName);
accountField.setText(req.body.account);
emailField.setText(req.body.email);
addressField.setText(req.body.address);
settlementTypeField.setText(req.body.settlementType);
periodField.setText(req.body.period);

// save the updated PDF document
const updatedPdfBytes = await pdfDoc.save();
fs.writeFileSync('updated_document.pdf', updatedPdfBytes);
