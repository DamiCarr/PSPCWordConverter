// Wait for the DOM to be fully loaded
$(document).ready(() => {
    // Load JSON data for acronyms and handle errors
    $.getJSON("json/abbr.json", (data) => {
        json_data = data;
    }).fail(() => {
        console.log("An error has occurred.");
    });
});

(function () {
    // Add event listener to handle file input changes
    document.getElementById("document").addEventListener("change", handleFileSelect, false);

    // Handle file selection and convert the file to HTML using Mammoth.js
    function handleFileSelect(event) {
        readFileInputEventAsArrayBuffer(event, (arrayBuffer) => {
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(displayResult)
                .done();
        });
    }

    // Process and display the converted HTML content
    function displayResult(result) {
        let output = result.value;

        // Remove extra whitespace and trim the output
        output = output.replace(/\s+/g, ' ').trim();

        // Define regex patterns and their replacements
        const rgxArray = [
            /.+?(?=<h1>)/g, // Remove everything before the first <h1> tag
            /(?!(<\/[a-z0-9]+>))(<)/g, // Add a newline before opening angle brackets not part of a closing tag
            /(\sid=".*")/g, // Remove id attributes from HTML tags
            /<([a-z0-9]+)>(\n+|)<\/\1>/gm, // Remove empty HTML tags
            /<table(.*?)>/gm, // Replace <table> tags with styled table attributes
            /(?<=<table(.*?)>\n*?)(<tr>)/gm, // Add a class "active" to <tr> tags immediately following a <table> tag
            /<strong>(\s)?<\/strong>/g, // Remove empty <strong> tags
            /<p>(\s)?<\/p>/g, // Remove empty <p> tags
            /<br(\s)?\/>/g, // Remove <br> tags
            /(<h2> )/g, // Remove spaces after opening <h2> tags
            /(\W<\/h2>)/g, // Remove non-word characters before closing </h2> tags
            /(>)\n+(?=\w)/gm, // Remove newlines after closing tags and before word characters
            /<em> <\/em>/g, // Remove empty <em> tags
            /(?<=<)\s+|\s+(?=>)/g, // Remove whitespace at the beginning and end of tags
            /\s<strong>/g, // Remove a space between <p> and <strong>
            /\s<sup>/g, // Remove a space in front of <sup>
            /\s(?=<a(.*?)\n*?)>/g, // Remove a space in front of <a>
            /<p>\s/g, // Remove a space in front of <p>
        ];
        
        const rgxReplaceArray = [
            "", // Remove everything before the first <h1> tag
            "\n<", // Add a newline before opening angle brackets that are not part of a closing tag
            "", // Remove id attributes from HTML tags
            "", // Remove empty HTML tags (e.g., <tag></tag>)
            '<table class="table table-bordered" style="table-layout: fixed;">', // Replace <table> tags with a styled table
            '<tr class="active">', // Add a class "active" to <tr> tags immediately following a <table> tag
            "", // Remove empty <strong> tags
            "", // Remove empty <p> tags
            "", // Remove <br> tags
            "<h2>", // Remove spaces after opening <h2> tags
            "</h2>", // Remove non-word characters before closing </h2> tags
            ">", // Remove newlines after closing tags and before word characters
            "", // Remove empty <em> tags
            "", // Remove whitespace at the beginning and end of tags
            "<strong>", // Remove a space between <p> and <strong>
            "<sup>", // Remove a space in front of <sup>
            "", // Remove a space in front of <a>
            "<p>", // Remove a space in front of <p>
        ];   

        // Apply regex replacements iteratively
        rgxArray.forEach((regex, i) => {
            if (i === 3 || i === 9) { // Special handling for specific patterns
                let e = 0;
                const limit = i === 3 ? 6 : 3; // Limit iterations for these patterns
                while (e < limit) {
                    output = output.replaceAll(regex, rgxReplaceArray[i]);
                    e++;
                }
            }
            output = output.replaceAll(regex, rgxReplaceArray[i]);
        });

        // Add IDs to <h2> tags and update navigation links
        $("#h2button").click(() => {
            function H2sRegex() {
                let IDs = [];
                output.match(/<h2>.+<\/h2>/g).forEach(element => {
                    let elementID = element.match(/(?!<h2>)([a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ]+)(?=<\/h2>)/g);
                    let negLook = element.match(/(?!<h2>)([a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ]|\d|\s)+<\/h2>/g);
                    IDs.push(elementID);
                    output = output.replace(element, `<h2 id="${elementID[0]}">${negLook[0]}`);
                });

                // Update navigation links if the first ID is "page"
                if (IDs[0] === 'page') {
                    IDs.shift();
                    const groupOnThisPage = /((id="page")(.|\n)+?<ul>)(.|\n)+?(<\/ul>+?)/gm;
                    const liOnThisPage = /<li>(.)+<\/li>/g;
                    const posLookBehind = /(?<=<li>)(.)+(?=<\/li>)/g;
                    const group = output.match(groupOnThisPage);
                    const allLI = group[0].match(liOnThisPage);
                    allLI.forEach((element, i) => {
                        let content = element.match(posLookBehind);
                        output = output.replace(element, `<li><a href="#${IDs[i]}">${content}</a></li>`);
                    });
                }
            }
            H2sRegex();
        });

        // Replace acronyms with their corresponding tags
        $.each(json_data, (i, e) => {
            let tag = JSON.stringify(e.tag).slice(1, -1).replaceAll("'", '"');
            let accronym = RegExp(e.accronym, "g");
            output = output.replaceAll(accronym, tag);
        });

        // Update the output HTML and textarea
        document.getElementById("output").innerHTML = output;
        $("#html-data").val(output);
    }

    // Read the selected file as an ArrayBuffer
    function readFileInputEventAsArrayBuffer(event, callback) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (loadEvent) => callback(loadEvent.target.result);
        reader.readAsArrayBuffer(file);
    }

    // Escape HTML characters to prevent XSS
    function escapeHtml(value) {
        return value.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
})();

// Copy the HTML content to the clipboard
$('#copy-txt')[0].onclick = () => {
    navigator.clipboard.writeText($('#html-data')[0].value);
    alert("copied text to clipboard");
};