// Wait for the DOM to be fully loaded
$(document).ready(() => {
    // Load JSON data for acronyms and handle errors
    $.getJSON("json/abbr.json", (data) => {
        json_data = data;
    }).fail(() => {
        console.log("An error has occurred.");
    });

    // Add event listener to handle file input changes
    document.getElementById("document").addEventListener("change", handleFileSelect);

    // Add event listener to download HTML content
    document.getElementById("download-html").addEventListener("click", downloadHtml);

    // Add event listener to copy HTML content to clipboard
    $('#copy-txt').on("click", copyToClipboard);
});

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
                        saveImage(imageBuffer, imageName); // Save the image locally
        
                        // Return both the saved image reference and the base64-encoded image
                        return {
                            src: `images/${imageName}`, // Reference the saved image in HTML
                            data: "data:" + image.contentType + ";base64," + imageBuffer // Base64-encoded image
                        };
                    });
                }),
            }
        );

        // Display the HTML in the textarea and preview section
        const output = processHtml(result.value);
        document.getElementById("html-data").value = output;
        document.getElementById("output").innerHTML = output;
    };

    reader.readAsArrayBuffer(file);
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