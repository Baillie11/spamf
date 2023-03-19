const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs');

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
  const selectedItem = req.body.item;
  const reasonForAmf = req.body['reasonforamf'];
  const agencyType = req.body['agency-type'];
  const agencyNumber = req.body['agency-number'];
  const mid = req.body['mid'];
  const merchantName = req.body['merchant-name']
  const startDate = req.body['start-date'];
  const endDate = req.body['end-date'];
  const agencyCustomerNo = req.body['agency-customer-no'];
  const agencyPrincipleName = req.body['agency-principle-name'];
  const account = req.body.account;
  const email = req.body.email;
  const address = req.body.address;
  const settlementType = req.body['settlement-type'];
  const period = req.body.period;
  
  console.log ('Reason for AMF=', reasonForAmf)
  console.log ('Agency Number=', agencyNumber)
  console.log ('MID=', mid)
  console.log ('Merchant Name=', merchantName)
  console.log ('Start Date', startDate)

  // Load the existing PDF file
  const pdfBytes = fs.readFileSync('template.pdf');

  // Create a new PDF document based on the existing one
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Get the first page
  const pages = pdfDoc.getPages();
  const page = pages[0];

  // Embed a font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Set the font size and write the user input to the page
  const fontSize = 12;
  const headingfontsize = 40;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  let y = page.getHeight() - margin;
  page.drawText(`Agency Management Form – Post Billpay and IDV`, {
    x: margin,
    y,
    size: headingfontsize,
    font,
  });
  y -= lineHeight;
  page.drawText(`Reason for AMF: ${reasonForAmf}`, {
    x: margin,
    y,
    size: fontSize,
    font,
  });
  y -= lineHeight;
  page.drawText(`Agency Type: ${agencyType}`, {
    x: margin,
    y,
    size: fontSize,
    font,
  });
  y -= lineHeight;
  page.drawText(`Agency Number: ${agencyNumber}`, {
    x: margin,
    y,
    size: fontSize,
    font,
  });

  // save the filled PDF as a file and send it as a response
//  const pdfBytes = await pdfDoc.save();
  fs.writeFile(mid + '.pdf', pdfBytes, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to generate PDF');
    } else {
      console.log('PDF generated successfully');
      res.download(mid + '.pdf');
    }
  });
});

// start the server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});