// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    initializePage();
    loadJsonData();
    setupEventListeners();
});

// Global variables
let json_data = null;
const imageDownloadQueue = [];

// Initialize the page
function initializePage() {
    const h1Element = document.querySelector("h1");
    if (h1Element) {
        h1Element.setAttribute("property", "name");
        h1Element.setAttribute("id", "wb-cont");
    } else {
        console.warn("No <h1> element found to add attributes.");
    }
}

// Load JSON data for acronyms and handle errors
function loadJsonData() {
    $.getJSON("json/abbr.json", (data) => {
        json_data = data;
        console.log("JSON data loaded successfully.");
    }).fail(() => {
        console.error("Failed to load JSON data.");
    });
}

// Set up event listeners
function setupEventListeners() {
    const documentInput = document.getElementById("yourDocumentInputId");
    if (documentInput) {
        documentInput.addEventListener("change", handleDocumentInputChange);
    }

    document.getElementById("download-html")?.addEventListener("click", downloadHtml);
    document.getElementById("download-images")?.addEventListener("click", downloadImages);
    document.getElementById("copy-txt")?.addEventListener("click", copyToClipboard);
}

// Handle document input change
function handleDocumentInputChange(event) {
    const documentInput = event.target;
    documentInput.disabled = true; // Temporarily disable to prevent multiple triggers
    resetState();
    handleFileSelect(event);
    setTimeout(() => {
        documentInput.disabled = false; // Re-enable after processing
    }, 1000);
}

// Reset the state for a new file
function resetState() {
    document.getElementById("html-data").value = "";
    document.getElementById("output").innerHTML = "";
    imageDownloadQueue.length = 0;
    updateImageDownloadButton();
}

// Handle file selection and convert the file to HTML using Mammoth.js
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const arrayBuffer = e.target.result;

        try {
            const result = await mammoth.convertToHtml(
                { arrayBuffer: arrayBuffer },
                {
                    convertImage: mammoth.images.imgElement(processImage),
                }
            );

            const processedOutput = processHtml(result.value);
            const htmlDataOutput = processedOutput.replace(/ data="[^"]*"/g, "");
            const title = extractTitle(processedOutput);

            const templateData = {
                title: title,
                description: "Generated HTML content from the uploaded file.",
                keywords: "HTML, Mammoth.js, File Conversion",
                date: new Date().toISOString().split("T")[0],
                content: htmlDataOutput,
            };

            const populatedHtml = populateTemplate(template, templateData);
            displayPopulatedHtml(populatedHtml);
        } catch (error) {
            console.error("Error processing file:", error);
        }
    };

    reader.readAsArrayBuffer(file);
}

// Process image for Mammoth.js
function processImage(image) {
    return image.read("base64").then((imageBuffer) => {
        const imageName = `image-${Date.now()}.png`;
        addImageToDownloadQueue(imageBuffer, imageName);
        return {
            src: `images/${imageName}`,
            data: `data:${image.contentType};base64,${imageBuffer}`,
        };
    });
}

// Extract the first <h1> tag for the title
function extractTitle(html) {
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    return titleMatch ? titleMatch[1] : "Default Title";
}

// Automatically populate and display the template
function autoPopulateTemplate(data) {
    const populatedHtml = populateTemplate(template, data);
    displayPopulatedHtml(populatedHtml);
}

// Display the populated HTML
function displayPopulatedHtml(html) {
    document.getElementById("output").innerHTML = html;
    document.getElementById("html-data").value = html;
}

// Define the HTML template as a string
const template = `
<!DOCTYPE html>
<!--[if lt IE 9]><html class="no-js lt-ie9" lang="en" dir="ltr"><![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en" dir="ltr">
<head>
  <!--#include virtual="/includes/aa/AA_header.html" -->
  <meta charset="utf-8" />
  <!-- Start of Title -->
  <title> *TITLE* </title>
  <!-- End of Title -->
  <!-- Start of Metadata -->
  <meta content="width=device-width, initial-scale=1" name="viewport" />
  <meta name="description" content=" *DESCRPTION* " />
  <meta name="dcterms.description" content="*DESCRPTION*" />
  <meta name="dcterms.creator" content="Government of Canada, Public Services and Procurement Canada, Public Service Pay Centre" />
  <meta name="dcterms.title" content=" *TITLE* " />
  <meta name="dcterms.issued" title="W3CDTF" content=" *DATE* " />
  <meta name="dcterms.modified" title="W3CDTF" content="<!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'-->" />
  <meta name="dcterms.subject" title="gccore" content="Pension and benefits" />
  <meta name="dcterms.language" title="ISO639-2" content="eng" />
  <meta name="keywords" content="*KEYWORDS*" />
  <!--#include virtual="/includes/aa/AA_metadata.html" -->
  <!-- End of Metadata-->
  <!--#include virtual="/site/wet4.0/html5/includes/tete-head.html" -->
  <!-- Start of Custom CSS -->
  <style>
    .div-line {
      display: block;
      height: 1px;
      border: 0;
      border-top: 2px solid #3c6b69;
      margin: .5em 0;
      padding: 0;
    }

    .checkbox label,
    .radio label {
      padding-left: 15px;
    }
  </style>
  <!-- End of Custom CSS-->
  <!-- Start of no script code -->
  <noscript>
    <link rel="stylesheet" href="/boew-wet/wet4.0/css/noscript.min.css" />
  </noscript>
  <!-- End of no script code-->
  <script>dataLayer1 = [];</script>
</head>
<body vocab="http://schema.org/" typeof="WebPage">
  <ul id="wb-tphp">
    <li class="wb-slc"> <a class="wb-sl" href="#wb-cont">Skip to main content</a> </li>
    <li class="wb-slc visible-sm visible-md visible-lg"> <a class="wb-sl" href="#wb-info">Skip to "About this site"</a> </li>
  </ul>
  <!--#include virtual="/site/wet4.0/html5/includes/banner_site-site_banner-eng.html" -->
  <!--#include virtual="/site/wet4.0/html5/includes/nav_mega-mega_nav-eng.html" -->
  <nav role="navigation" id="wb-bc" class="" property="breadcrumb">
    <h2 class="wb-inv">You are here:</h2>
    <div class="container">
      <div class="row">
        <ol class="breadcrumb">
          <!-- Start of pain-bread-eng.html (main site and sub-site) / D&eacute;but de pain-bread-eng.html (site principale et sous-site) -->
          <!--#include virtual="/site/wet4.0/html5/includes/pain-bread-eng.html" -->
          <!-- End of pain-bread-eng.html (main site and sub-site) / Fin de pain-bread-eng.html (site principale et sous-site) -->
          <li><a href="/remuneration-compensation/index-eng.html">Compensation</a></li>
          <li><a href="/remuneration-compensation/comm-eng.html">Compensation community hub</a></li>
          <li><a href="/remuneration-compensation/instructions-eng.html">Pay system instructions and documentation </a></li>
          <li><a href="/remuneration-compensation/utiliser-use-eng.html">How to use the pay system</a></li>
          <li><a href="/remuneration-compensation/procedures/recherche-search-eng.html">Phoenix procedures, job aids and instructions</a></li>
        </ol>
      </div>
    </div>
  </nav>
  <main role="main" property="mainContentOfPage" class="container">
    <!-- Start of Main Content -->
    <h1 property="name" id="wb-cont">*HEADER*</h1> *CONTENT* <!-- End of Main Content -->
    <div class="row pagedetails">
      <div class="col-sm-5 col-xs-12 datemod">
        <dl id="wb-dtmd">
          <dt>Date modified:&#32;</dt>
          <dd>
            <time property="dateModified">
              <!--#config timefmt='%Y-%m-%d'-->
              <!--#echo var='LAST_MODIFIED'-->
            </time>
          </dd>
        </dl>
      </div>
    </div>
  </main>
  <!--#include virtual="/site/wet4.0/html5/includes/pied_site-site_footer-eng.html" -->
  <!--#set var="piwikSiteId" value="308" -->
  <!--#include virtual="/includes/piwik/piwik.html" -->
  <!--#include virtual="/site/wet4.0/html5/includes/script-pied_site-site_footer.html" -->
  <!--#include virtual="/includes/aa/AA_footer.html" -->
</body>
</html>
`;

// Function to populate the template with dynamic content
function populateTemplate(template, data) {
    return template
        .replace(/\*TITLE\*/g, data.title || "Default Title")
        .replace(/\*DESCRIPTION\*/g, data.description || "Default Description")
        .replace(/\*KEYWORDS\*/g, data.keywords || "Default Keywords")
        .replace(/\*DATE\*/g, data.date || new Date().toISOString().split("T")[0])
        .replace(/\*CONTENT\*/g, data.content || "Default Content");
}

// Add image to the download queue
function addImageToDownloadQueue(base64Data, imageName) {
    imageDownloadQueue.push({ base64Data, imageName });
    updateImageDownloadButton();
}

// Update the image download button visibility
function updateImageDownloadButton() {
    const downloadButton = document.getElementById("download-images");
    if (downloadButton) {
        downloadButton.style.display = imageDownloadQueue.length > 0 ? "block" : "none";
    }
}

// Download all queued images
function downloadImages() {
    imageDownloadQueue.forEach(({ base64Data, imageName }) => {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${base64Data}`;
        link.download = imageName;
        link.click();
    });
    imageDownloadQueue.length = 0; // Clear the queue after downloading
    updateImageDownloadButton();
}

// Process and clean up the converted HTML content
function processHtml(html) {
    let output = html.replace(/\s+/g, " ").trim();

    const rgxArray = [
        /.+?(?=<h1>)/g,
        /(?!(<\/[a-z0-9]+>))(<)/g,
        /(\sid=".*")/g,
        /<([a-z0-9]+)>(\n+|)<\/\1>/gm,
        /<table(.*?)>/gm,
        /(?<=<table(.*?)>\n*?)(<tr>)/gm,
        /<strong>(\s)?<\/strong>/g,
        /<p>(\s)?<\/p>/g,
        /<br(\s)?\/>/g,
        /(<h2> )/g,
        /(\W<\/h2>)/g,
        /(>)\n+(?=\w)/gm,
        /<em> <\/em>/g,
        /(?<=<)\s+|\s+(?=>)/g,
        /\s<strong>/g,
        /\s<sup>/g,
        /\s(?=<a(.*?)\n*?)>/g,
        /<p>\s/g,
    ];

    const rgxReplaceArray = [
        "",
        "\n<",
        "",
        "",
        '<table class="table table-bordered" style="table-layout: fixed;">',
        '<tr class="active">',
        "",
        "",
        "",
        "<h2>",
        "</h2>",
        ">",
        "",
        "",
        "<strong>",
        "<sup>",
        "",
        "<p>",
    ];

    rgxArray.forEach((regex, i) => {
        output = output.replace(regex, rgxReplaceArray[i]);
    });

    output = addH2Ids(output);

    if (json_data) {
        $.each(json_data, (i, e) => {
            const tag = JSON.stringify(e.tag).slice(1, -1).replaceAll("'", '"');
            const acronym = new RegExp(e.accronym, "g");
            output = output.replace(acronym, tag);
        });
    }

    return output;
}

// Add IDs to <h2> tags
function addH2Ids(output) {
    const h2Tags = output.match(/<h2>.+<\/h2>/g) || [];
    const ids = [];

    const updatedOutput = h2Tags.reduce((acc, tag) => {
        const id = tag.match(/(?!<h2>)([a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ]+)(?=<\/h2>)/g)?.[0];
        if (id) {
            ids.push(id);
            const updatedTag = tag.replace(/<h2>(.+)<\/h2>/, `<h2 id="${id}">$1</h2>`);
            return acc.replace(tag, updatedTag);
        }
        return acc;
    }, output);

    return updatedOutput;
}

// Copy the HTML content to the clipboard
function copyToClipboard() {
    const htmlData = document.getElementById("html-data")?.value;
    if (htmlData) {
        navigator.clipboard.writeText(htmlData);
        alert("Copied text to clipboard");
    }
}

// Download the HTML content
function downloadHtml() {
    const htmlContent = document.getElementById("html-data")?.value;
    if (htmlContent) {
        const blob = new Blob([htmlContent], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "converted.html";
        link.click();
    }
}