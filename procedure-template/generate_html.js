const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/generate-html', (req, res) => {
    const { content, title, topics, description, language, nameFile, keywords } = req.body;
    const currentDate = new Date().toISOString().split('T')[0];

    if (!content || !title || !language || !nameFile) {
        console.error("Missing required fields in POST request");
        return res.status(400).send("Error: Missing required fields!");
    }

    let htmlTemplate = '';
    if (language === "eng") {
        htmlTemplate = `
<!DOCTYPE html>
<html class="no-js" lang="en" dir="ltr">
<head>
<meta charset="utf-8"/>
<title>${title} - GCIntranet - PSPC</title>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta name="description" content="${description}" />
<meta name="dcterms.description" content="${description}" />
<meta name="dcterms.creator" content="Government of Canada, Public Services and Procurement Canada, Public Service Pay Centre" />
<meta name="dcterms.title" content="${title}" />
<meta name="dcterms.issued" title="W3CDTF" content="${currentDate}" />
<meta name="dcterms.modified" title="W3CDTF" content="${currentDate}" />
<meta name="dcterms.subject" title="gccore" content="${topics}" />
<meta name="dcterms.language" title="ISO639-2" content="eng" />
<meta name="keywords" content="${keywords}" />
<style>
.div-line {
    display: block;
    height: 1px;
    border: 0;
    border-top: 2px solid #3c6b69;
    margin: .5em 0;
    padding: 0;
}
</style>
</head>
<body vocab="http://schema.org/" typeof="WebPage">
<main role="main" property="mainContentOfPage" class="container">
  ${content}
  <div class="row pagedetails">
    <div class="col-sm-5 col-xs-12 datemod">
      <dl id="wb-dtmd">
        <dt>Date modified:&#32;</dt>
        <dd>
          <time property="dateModified">${currentDate}</time>
        </dd>
      </dl>
    </div>
  </div>
</main>
</body>
</html>`;
    } else {
        htmlTemplate = `
<!DOCTYPE html>
<html class="no-js" lang="fr" dir="ltr">
<head>
<meta charset="utf-8"/>
<title>${title} - GCIntranet - PSPC</title>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta name="description" content="${description}" />
<meta name="dcterms.description" content="${description}" />
<meta name="dcterms.creator" content="Gouvernement du Canada, Services publics et Approvisionnement Canada" />
<meta name="dcterms.title" content="${title}" />
<meta name="dcterms.issued" title="W3CDTF" content="${currentDate}" />
<meta name="dcterms.modified" title="W3CDTF" content="${currentDate}" />
<meta name="dcterms.subject" title="gccore" content="${topics}" />
<meta name="dcterms.language" title="ISO639-2" content="fra" />
<meta name="keywords" content="${keywords}" />
<style>
.div-line {
    display: block;
    height: 1px;
    border: 0;
    border-top: 2px solid #3c6b69;
    margin: .5em 0;
    padding: 0;
}
</style>
</head>
<body vocab="http://schema.org/" typeof="WebPage">
<main role="main" property="mainContentOfPage" class="container">
  ${content}
  <div class="row pagedetails">
    <div class="col-sm-5 col-xs-12 datemod">
      <dl id="wb-dtmd">
        <dt>Date de modification&#160;:&#32;</dt>
        <dd>
          <time property="dateModified">${currentDate}</time>
        </dd>
      </dl>
    </div>
  </div>
</main>
</body>
</html>`;
    }

    const filePath = path.join(__dirname, `${nameFile}.html`);
    fs.writeFile(filePath, htmlTemplate, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Error generating HTML file!");
        }

        res.download(filePath, `${nameFile}.html`, (err) => {
            if (err) {
                console.error("Error sending file:", err);
            }
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting file:", unlinkErr);
                }
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});