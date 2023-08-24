const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { readFile, writeFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');

// var reason=""

app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    res.set('Content-Type', 'text/css');
  }
}));

const port = 3000;

// use EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static("./"));

// parse request bodies as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// handle requests to the home page
app.get('/', (req, res) => {
  res.render('index');
});

// handle POST requests to the form submission
app.post('/submit', async (req, res) => {
  const selectedValue=req.body.item;
  const reasonForAmf = req.body['reasonforamf'];
  const agencyType = req.body['agency-type'];
  const agencyNumber = req.body['agency-number'];
  const mid = req.body['mid'];
  const merchantName = req.body['merchant-name']
  const startDate = req.body['start-date'];
  const endDate = req.body['end-date'];
  const agencyCustomerNo = req.body['agency-customer-number'];
  const agencyPrincipleName = req.body['merchant-name'];
  const account = req.body['account'];
  const email = req.body['email'];
  const address1 = req.body['address1'];
  const address2 = req.body['address2'];
  const suburb = req.body['suburb'];
  const state = req.body['state'];
  const postcode = req.body['postcode'];
  const settlementType = req.body['settlement-type'];
  const period = req.body['period'];
  const splitConditions = 'No';
  const bankName = req.body['bank-name'];
  const bsb = req.body['bsb'];
  const accountNumber = req.body['account-number'];
  const vendor = req.body['vendor'];
  const negativeAdjustments = req.body['negative-adjustments'];

  async function createPDF(input, output) {
    try {
        const pdfDoc = await PDFDocument.load(await readFile(input));

        //Modify doc - Fill out the form.
        const fieldNames =pdfDoc
        .getForm()
        .getFields()
        .map((f) => f.getName());

        //update pdf document with form data
        const form = pdfDoc.getForm();

        const reason = selectedValue;
        //console.log(reason);
               
        form.getTextField('Reason_for_AMF').setText(reasonForAmf); // Reason for AMF
        form.getTextField('Agency_Type').setText(agencyType); // Agency Type
        


        switch(reason) {
          case "close-account":
            console.log(reason);
            form.getTextField('Agency_Principle_Number').setText(agencyNumber);
            form.getTextField('Contract_End_Date').setText(endDate);
            form.getTextField('Vendor').setText(vendor);
            break;
          
          case "change-pricing":
            console.log("To change pricing");
            form.getTextField('Agency_Customer_Number_1').setText(agencyCustomerNo);
            form.getTextField('Agency_Principle_Number').setText(agencyNumber);
            form.getTextField('Distribution_Channel').setText('03');
            form.getTextField('Pricing_Start_Date').setText(startDate);
            form.getTextField('Pricing_End_Date').setText("31.12.9999");
            break;

          case "settlement-account":
            console.log("To change settlement account");
            form.getTextField('Agency_Principle_Name').setText(agencyPrincipleName);
            form.getTextField('Agency_Principle_Number').setText(agencyNumber);
            //form.getTextField('Agency_Customer_Number_1').setText(agencyCustomerNo);
            form.getTextField('Bank_Branch_Name').setText(bankName);
            form.getTextField('BSB').setText(bsb);
            form.getTextField('Account').setText(accountNumber);
            form.getTextField('Vendor').setText(vendor);
            break;
          
          case "customer-email":
            console.log("To change email address");
            form.getTextField('Agency_Principle_Name').setText(agencyPrincipleName);
            form.getTextField('Agency_Principle_Number').setText(agencyNumber);
            form.getTextField('Email').setText(email);
            form.getTextField('Vendor').setText(vendor);
            break;
          
          case "customer-address":
            console.log("To change customer address");
            form.getTextField('Agency_Principle_Number').setText(agencyNumber);
            form.getTextField('Agency_Customer_Number_1').setText(agencyCustomerNo);
            form.getTextField('Vendor').setText(vendor);
            form.getTextField('Address_Line_1').setText(address1);
            form.getTextField('Address_Line_2').setText(address2);
            form.getTextField('Suburb').setText(suburb);
            form.getTextField('State').setText(state);
            form.getTextField('Postcode').setText(postcode);
            break;
            
          case "change-settlement-period":
            console.log("To change settlement period to immediate");
            form.getTextField('Agency_Principle_Number').setText(agencyNumber);
            form.getTextField('Agency_Customer_Number_1').setText(agencyCustomerNo);
            form.getTextField('Contract_End_DateNegative_Adjustments_Dishonours').setText(negativeAdjustments);
            form.getTextField('Vendor').setText(vendor);         
            break;
          
          case "change-trading":
            console.log("To change trading name");
            form.getTextField('Agency_Principle_Name').setText(agencyPrincipleName);
            form.getTextField('Agency_Principle_Number').setText(agencyNumber);
            form.getTextField('Agency_Customer_Number_1').setText(agencyCustomerNo);
            form.getTextField('Vendor').setText(vendor);         
       }
       
        const pdfBytes = await pdfDoc.save();

        await writeFile(output, pdfBytes);
        console.log('PDF created, Output = '+ output);
    } catch (err) {
        console.log(err);
    }
}


var directoryPath = `C:/SecurePay/${mid}-${agencyPrincipleName}-${reasonForAmf}`;

fs.mkdir(directoryPath, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating directory:', err);
  } else {
    console.log('Directory created successfully at '+ directoryPath);

      
  }
});

    pdfName=mid + "-" + agencyPrincipleName + ".pdf"


  createPDF('template.pdf', directoryPath + "/"+ pdfName);
  
  
});

// start the server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});