$(document).ready(() => {
    // Declare json_data in a higher scope
    let json_data = null;

    $.getJSON("json/abbr.json", (data) => {
        json_data = data; // Assign data to json_data
    }).fail(() => {
        console.log("An error has occurred.");
    });

    document.getElementById("document")
        .addEventListener("change", handleFileSelect, false);

    function handleFileSelect(event) {
        if (!json_data) {
            console.error("JSON data is not loaded yet. Please try again.");
            return;
        }

        readFileInputEventAsArrayBuffer(event, function(arrayBuffer) {
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(displayResult)
                .done();
        });
    }

    function displayResult(result) {
        let output = result.value;

        // Regular expressions to remove whitespace
        const whitespaceRegex = [
            /\s+/g, // Replace multiple whitespace characters with a single space
            /^\s+|\s+$/g // Remove whitespace from the beginning and end of the string
        ];

        // Apply the regular expressions
        whitespaceRegex.forEach(regex => {
            output = output.replace(regex, ' ').trim();
        });

        /*----------------------------------------------------------------*/
        const rgxArray = [
            /.+?(?=<h1>)/g, // Remove all above the h1
            /(?!(<\/[a-z0-9]+>))(<)/g, // Adds a new line to every closing tag
            /(\sid=".*")/g, // Remove ids
            /<([a-z0-9]+)>(\n+|)<\/\1>/gm, // Gets all tags with nothing between themselves
            /<table(.*?)>/gm, // Gets the table tag
            /(?<=<table(.*?)>\n*?)(<tr>)/gm, // Gets the first tr tag after table
            /<strong>(\s)?<\/strong>/g,
            /<p>(\s)?<\/p>/g,
            /<br(\s)?\/>/g,
            /(<h2> )/g,
            /(\W<\/h2>)/g,
            /(>)\n+(?=\w)/gm,
            /<em> <\/em>/g,
            /<p>\s*<strong>/g // Match <p> followed by spaces and <strong>
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
            "<p><strong>" // Replace with <p><strong> without spaces
        ];

        // Applying the arrays above
        rgxArray.forEach((regex, i) => {
            if (i === 3 || i === 9) {
                let e = 0;
                const limit = i === 3 ? 6 : 3;
                while (e < limit) {
                    output = output.replaceAll(regex, rgxReplaceArray[i]);
                    e++;
                }
            } else {
                output = output.replaceAll(regex, rgxReplaceArray[i]);
            }
        });

        $("#h2button").click(function() {
            function H2sRegex() {
                console.log("H2sRegex");
                let IDs = [];

                output.match(/<h2>.+<\/h2>/g).forEach(element => {
                    let elementID = element.match(/(?!<h2>)([a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ]+)(?=<\/h2>)/g);
                    let negLook = element.match(/(?!<h2>)([a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ]|\d|\s)+<\/h2>/g);
                    IDs.push(elementID);
                    output = output.replace(element, '<h2 id="' + elementID[0] + '">' + negLook[0]);
                });

                if (IDs[0] === 'page') {
                    IDs.shift();
                    const groupOnThisPage = /((id="page")(.|\n)+?<ul>)(.|\n)+?(<\/ul>+?)/gm;
                    const liOnThisPage = /<li>(.)+<\/li>/g;
                    const posLookBehind = /(?<=<li>)(.)+(?=<\/li>)/g;
                    const group = output.match(groupOnThisPage);
                    const allLI = group[0].match(liOnThisPage);
                    allLI.forEach((element, i) => {
                        let content = element.match(posLookBehind);
                        output = output.replace(element, '<li><a href="#' + IDs[i] + '">' + content + '</a></li>');
                    });
                } else {
                    console.log(false);
                }
            }
        });

        // Applying acronyms
        $.each(json_data, function(i, e) {
            let tag = JSON.stringify(e.tag);
            let accronym = RegExp(e.accronym, "g");
            tag = tag.slice(1, -1).replaceAll("'", '"');
            output = output.replaceAll(accronym, tag);
        });

        /*----------------------------------------------------------------*/
        document.getElementById("output").innerHTML = output;
        $("#html-data").val(output);
    }

    function readFileInputEventAsArrayBuffer(event, callback) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(loadEvent) {
            const arrayBuffer = loadEvent.target.result;
            callback(arrayBuffer);
        };

        reader.readAsArrayBuffer(file);
    }

    function escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
});

$('#copy-txt')[0].onclick = () => {
    navigator.clipboard.writeText($('#html-data')[0].value);
    alert("Copied text to clipboard");
};