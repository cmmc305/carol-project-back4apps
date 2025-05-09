// Função utilitária para gerar PDF com pdfMake a partir dos dados do formulário

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.addVirtualFileSystem(pdfFonts);
import Parse from '@/utils/back4app';

export type RequestFormData = {
  processor: string;
  businessName: string;
  ein: string;
  merchantName: string;
  ssn: string;
  balanceDue: string;
  defaultDate: string;
  additionalEntities: string;
  contractFileId: string;
  type: string;
};

export async function generateRequestPdf(formData: RequestFormData) {
  const logo = await new Parse.Query('File').get('Bo3RF2PNE1').then((file) => file.get('file').url());
  const logoBase64 = await convertImageToBase64(logo);
  const docDefinition = {
    content: [
      {
        columns: [
          { text: '', width: '*' },
          {
            image: logoBase64,
            width: 100,
            alignment: 'right'
          }
        ],
        margin: [0, 0, 0, 10]
      },
      { text: '3/26/2025', style: 'paragraph' },
      { text: formData.processor, style: 'paragraph' },
      { text: 'Attn: Legal Department/Accounts Payable', style: 'paragraph' },
      { text: 'UCC LIEN NOTICE OF ASSIGNMENT', style: 'title', alignment: 'center' },
      { text: '\n' },

      { text: `Re: ${formData.businessName}`, style: 'bold' },
      { text: `EIN: ${formData.ein}`, style: 'bold' },
      { text: '\n' },

      { text: 'Personal Guarantor:', style: 'bold' },
      { text: formData.merchantName, style: 'bold' },
      { text: `SSN:XXX-XX-${formData.ssn}`, style: 'bold' },
      { text: '\n' },

      { text: 'Additional Entities:', style: 'bold' },
      { text: 'BUSINESS NAME 2 LLC', style: 'bold' },
      { text: `Balance Due: $${formData.balanceDue}`, style: 'bold' },
      { text: `Default Date: ${formData.defaultDate}`, style: 'bold' },
      { text: '\n' },

      { text: 'To Whom It May Concern:', style: 'subtitle' },
      { text: `This notice is being sent pursuant to UCC § 9-404, 9-406, and 9-607 as it has come to our attention that PROCESSOR has been conducting business with ${formData.businessName} / ${formData.merchantName} (the “Merchant). Please be advised that the Merchant has defaulted on a Merchant Agreement (“Agreement”) entered by and between the Merchant and SPARTAN CAPITAL, which copies are enclosed for your reference. The balance due to and owing to SPARTAN CAPITAL is $${formData.balanceDue}.`, style: 'paragraph' },
      { text: '\n' },
      { text: 'As holders of a perfected UCC with respect to the accounts receivable of the Merchant, and in accordance with the Agreement, SPARTAN CAPITAL hereby demands that PROCESSOR comply with this request to pay all funds processed on behalf of the Merchant to SPARTAN CAPITAL. All such payments must be made to SPARTAN CAPITAL until $39,394.32 is paid in full.', style: 'paragraph' },
      { text: '\n' },

      { text: 'Timeline for Compliance', style: 'subtitle' },
      { text: 'You are required to comply with this notice and redirect all payments within five (5) business days of receipt of this letter. You are further instructed to hold any current and future funds due to the Merchant in your possession, with no release to any party other than SPARTAN CAPITAL, until directed otherwise in writing.', style: 'paragraph' },
      { text: '\n\nPlease remit all payments to:', style: 'subtitle', alignment: 'center' },
      { text: '\n' },
      {
        table: {
          body: [
            [
              {
                text: [
                  { text: 'By Check:\n', style: 'bold', alignment: 'center' },
                  { text: 'Spartan Business Solutions, LLC\nd/b/a Spartan Capital\n1301 State Route 36, Bldg 2, Ste 15\nHazlet, NJ 07730\nRe : Barrio Dogg LLC', alignment: 'center' }
                ],
                alignment: 'center',
              },
              {
                text: [
                  { text: 'By Wire:\n', style: 'bold', alignment: 'center' },
                  { text: 'Spartan Business Solutions, LLC\nBank Name: TD Bank, N.A.\n1301 State Route 36, Bldg 2, Ste 15\nHazlet, NJ 07730\nAccount Number: 4364889803\nRouting Number (Wires): 031101266\nRe:Barrio Dogg LLC', alignment: 'center' }
                ],
                alignment: 'center',
              }
            ]
          ],
          dontBreakRows: true,
        }
      },
      { text: '\n' },
      {
        text: 'As per UCC Article 9-406 and §9-607, SPARTAN holds a perfected security interest in the Merchant’s assets, including all accounts receivable. This perfected security interest requires that you redirect all payments due to the Merchant to SPARTAN. Any release of funds to the Merchant would be in violation of SPARTAN’s secured rights.',
        style: 'paragraph'
      },
      { text: '\n' },
      { text: 'Consequences of Non-Compliance', style: 'subtitle' },
      {
        text: 'Failure to comply with this notice within the specified timeline will result in liability under UCC §9-406. SPARTAN reserves the right to pursue all available legal remedies, including but not limited to: Recovery of the outstanding balance, statutory damages, attorney\'s fees, court costs, and equitable relief. Failure to redirect the required funds to SPARTAN may subject you to additional penalties for non-compliance and may result in SPARTAN seeking injunctive relief or other court orders to enforce its rights under the UCC.',
        style: 'paragraph'
      },
      { text: '\n\nPlease comply with the above immediately and contact us if you have any questions or concerns.', style: 'paragraph' },
      { text: '\n\nSincerely,\nSpartan Capital\nLiens Department\n122 East 42nd Street, 4th Floor #1011\nNew York, NY 10168\nEmail: liens@spartancapitalgroup.com', style: 'closing' }
    ],
    styles: {
      paragraph: {
        fontSize: 12,
        margin: [0, 2, 0, 2]
      },
      title: {
        fontSize: 12,
        bold: true,
        decoration: 'underline',
        margin: [0, 20, 0, 20]
      },
      bold: {
        fontSize: 12,
        bold: true,
        margin: [0, 2, 0, 2]
      },
      subtitle: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'black'
      },
      closing: {
        fontSize: 12,
        margin: [0, 10, 0, 0] // Add space before the closing
      }
    }
  };
  pdfMake.createPdf(docDefinition).download('request.pdf');
}

// Helper function to convert an image URL to base64
async function convertImageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Enable CORS for external images
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } else {
        reject(new Error('Failed to get 2D context from canvas.'));
      }
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}