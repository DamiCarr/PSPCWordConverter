// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Select the <h1> element
    const h1Element = document.querySelector("h1");

    // Check if the <h1> element exists
    if (h1Element) {
        // Add the attributes
        h1Element.setAttribute("property", "name");
        h1Element.setAttribute("id", "wb-cont");
    } else {
        console.warn("No <h1> element found to add attributes.");
    }
});

// Declare json_data variable
let json_data;

// Load JSON data for acronyms and handle errors
$.getJSON("json/abbr.json", (data) => {
    json_data = data;

    // Populate the template with the data
    const populatedHtml = populateTemplate(template, data);

    // Inject the populated HTML into the DOM (for example, into a <div>)
    document.body.innerHTML = populatedHtml;

    // OR: Log the populated HTML to the console
    console.log(populatedHtml);
    const documentInput = document.getElementById("yourDocumentInputId");
    if (documentInput) {
        documentInput.addEventListener("change", (event) => {
            documentInput.disabled = true; // Temporarily disable to prevent multiple triggers
            resetState(); // Reset the state for a new file
            handleFileSelect(event);
            setTimeout(() => {
                documentInput.disabled = false; // Re-enable after processing
            }, 1000); // Adjust timeout as needed
        });
    }

    // Add event listener to download HTML content
    document.getElementById("download-html").addEventListener("click", downloadHtml);

    // Add event listener to copy HTML content to clipboard
    $('#copy-txt').on("click", copyToClipboard);

    // Add event listener for the image download button
    document.getElementById("download-images").addEventListener("click", downloadImages);

    // Add event listener to download HTML content
    document.getElementById("download-html").addEventListener("click", downloadHtml);

    // Add event listener to copy HTML content to clipboard
    $('#copy-txt').on("click", copyToClipboard);

    // Add event listener for the image download button
    document.getElementById("download-images").addEventListener("click", downloadImages);
// Inject the populated HTML into the DOM (for example, into a <div>)
document.body.innerHTML = populatedHtml;

// OR: Log the populated HTML to the console
console.log(populatedHtml);
if (documentInput) {
        documentInput.addEventListener("change", (event) => {
            documentInput.disabled = true; // Temporarily disable to prevent multiple triggers
            resetState(); // Reset the state for a new file
            handleFileSelect(event);
            setTimeout(() => {
                documentInput.disabled = false; // Re-enable after processing
            }, 1000); // Adjust timeout as needed
        });
    }

    // Add event listener to download HTML content
    document.getElementById("download-html").addEventListener("click", downloadHtml);

    // Add event listener to copy HTML content to clipboard
    $('#copy-txt').on("click", copyToClipboard);

    // Add event listener for the image download button
    document.getElementById("download-images").addEventListener("click", downloadImages);
});

// Reset the state for a new file
function resetState() {
    // Clear the HTML data textarea
    document.getElementById("html-data").value = "";

    // Clear the preview section
    document.getElementById("output").innerHTML = "";

    // Clear the image download queue
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

        // Use Mammoth.js to convert the document to HTML
        const result = await mammoth.convertToHtml(
            { arrayBuffer: arrayBuffer },
            {
                convertImage: mammoth.images.imgElement((image) => {
                    return image.read("base64").then((imageBuffer) => {
                        const imageName = `image-${Date.now()}.png`;

                        // Store image data for manual download
                        addImageToDownloadQueue(imageBuffer, imageName);

                        // Reference the image in HTML without downloading
                        return {
                            src: `images/${imageName}`, // Reference the saved image in HTML
                            data: "data:" + image.contentType + ";base64," + imageBuffer // Base64-encoded image
                        };
                    });
                }),
            }
        );

        // Ensure processHtml is called only once and safely
        let processedOutput;
        try {
            processedOutput = processHtml(result.value);
        } catch (error) {
            console.error("Error processing HTML:", error);
            processedOutput = result.value; // Fallback to unprocessed HTML
        }

        // Remove 'data' attributes for the textarea content
        const htmlDataOutput = processedOutput.replace(/ data="[^"]*"/g, "");

        // Flip 'data' and 'src' attributes for the preview section
        const previewOutput = processedOutput.replace(/<img[^>]*>/g, (imgTag) => {
            return imgTag.replace(/src="([^"]+)" data="([^"]+)"/, 'src="$2" data="$1"');
        });

        // Extract the first <h1> tag for the title
        const titleMatch = processedOutput.match(/<h1[^>]*>(.*?)<\/h1>/);
        const title = titleMatch ? titleMatch[1] : "Default Title";

        // Populate the template with dynamic content
        const templateData = {
            title: title,
            description: "Generated HTML content from the uploaded file.",
            keywords: "HTML, Mammoth.js, File Conversion",
            date: new Date().toISOString().split('T')[0],
            content: htmlDataOutput
        };
        const populatedHtml = populateTemplate(template, templateData);

        // Display the populated HTML in the preview section
        document.getElementById("output").innerHTML = populatedHtml;

        // Optionally, set the textarea value to the populated HTML
        document.getElementById("html-data").value = populatedHtml;
    };

    reader.readAsArrayBuffer(file);
}

// Define the HTML template as a string
const template = `
<!DOCTYPE html>
<html class="no-js" lang="en" dir="ltr">
<head>
    <meta charset="utf-8"/>
    <title>*TITLE*</title>
    <meta name="description" content="*DESCRIPTION*" />
    <meta name="keywords" content="*KEYWORDS*" />
    <meta name="dcterms.title" content="*TITLE*" />
    <meta name="dcterms.issued" content="*DATE*" />
</head>
<body>
    <header>
        <h1 property="name" id="wb-cont">*TITLE*</h1>
    </header>
    <main>
        *CONTENT*
    </main>
    <footer>
        <p>Last updated: *DATE*</p>
    </footer>
</body>
</html>
`;

// Function to populate the template with dynamic content
function populateTemplate(template, data) {
    return template
        .replace(/\*TITLE\*/g, data.title || "Default Title")
        .replace(/\*DESCRIPTION\*/g, data.description || "Default Description")
        .replace(/\*KEYWORDS\*/g, data.keywords || "Default Keywords")
        .replace(/\*DATE\*/g, data.date || new Date().toISOString().split('T')[0])
        .replace(/\*CONTENT\*/g, data.content || "Default Content");
}

// Queue to store images for manual download
const imageDownloadQueue = [];

// Add image to the download queue
function addImageToDownloadQueue(base64Data, imageName) {
    imageDownloadQueue.push({ base64Data, imageName });
    updateImageDownloadButton();
}

// Update the image download button visibility
function updateImageDownloadButton() {
    const downloadButton = document.getElementById("download-images");
    if (imageDownloadQueue.length > 0) {
        downloadButton.style.display = "block";
    } else {
        downloadButton.style.display = "none";
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
    let output = html.replace(/\s+/g, ' ').trim();

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

    // Ensure no unintended recursion occurs by processing each regex independently
    for (let i = 0; i < rgxArray.length; i++) {
        const regex = rgxArray[i];
        const replacement = rgxReplaceArray[i];
        output = output.replace(regex, replacement);
    }

    // Add IDs to <h2> tags and update navigation links
    output = addH2Ids(output);

    // Replace acronyms with their corresponding tags
    if (json_data) {
        $.each(json_data, (i, e) => {
            const tag = JSON.stringify(e.tag).slice(1, -1).replaceAll("'", '"');
            const acronym = new RegExp(e.accronym, "g");
            output = output.replace(acronym, tag);
        });
    }

    return output;
}

function addH2Ids(output) {
    const h2Tags = output.match(/<h2>.+<\/h2>/g) || [];
    const ids = [];

    // Generate updated tags with IDs
    const updatedOutput = h2Tags.reduce((acc, tag) => {
        const id = tag.match(/(?!<h2>)([a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ]+)(?=<\/h2>)/g)?.[0];
        if (id) {
            ids.push(id);
            const updatedTag = tag.replace(/<h2>(.+)<\/h2>/, `<h2 id="${id}">$1</h2>`);
            return acc.replace(tag, updatedTag);
        }
        return acc;
    }, output);

    // Handle "page" ID logic
    if (ids[0] === "page") {
        ids.shift();
        const groupOnThisPage = /((id="page")(.|\n)+?<ul>)(.|\n)+?(<\/ul>+?)/gm;
        const liOnThisPage = /<li>(.)+<\/li>/g;
        const posLookBehind = /(?<=<li>)(.)+(?=<\/li>)/g;
        const group = updatedOutput.match(groupOnThisPage)?.[0];
        const allLI = group?.match(liOnThisPage) || [];
        allLI.forEach((element, i) => {
            const content = element.match(posLookBehind)?.[0];
            output = updatedOutput.replace(element, `<li><a href="#${ids[i]}">${content}</a></li>`);
        });
    }

    return updatedOutput;
}

// Copy the HTML content to the clipboard
function copyToClipboard() {
    navigator.clipboard.writeText($('#html-data').val());
    alert("Copied text to clipboard");
}

// Download the HTML content
function downloadHtml() {
    const htmlContent = document.getElementById("html-data").value;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "converted.html";
    link.click();
}

// Save the image (Base64 to file)
function saveImage(base64Data, imageName) {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = imageName;
    link.click();
}