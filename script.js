$(document).ready(() => {
    $.getJSON("json/abbr.json", (data) => {
        json_data = data;
    }).fail(() => {
        console.log("An error has occurred.");
    });
});

(function () {
    document.getElementById("document").addEventListener("change", handleFileSelect, false);

    function handleFileSelect(event) {
        readFileInputEventAsArrayBuffer(event, (arrayBuffer) => {
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(displayResult)
                .done();
        });
    }

    function displayResult(result) {
        let output = result.value;

        // Consolidated whitespace removal
        output = output.replace(/\s+/g, ' ').trim();

        // Regex and replacements
        const rgxArray = [
            /.+?(?=<h1>)/g, // Matches everything before the first <h1> tag (non-greedy).
            /(?!(<\/[a-z0-9]+>))(<)/g, // Matches opening angle brackets (<) that are not part of a closing tag.
            /(\sid=".*")/g, // Matches the id attribute (e.g., id="...") in HTML tags.
            /<([a-z0-9]+)>(\n+|)<\/\1>/gm, // Matches empty HTML tags (e.g., <tag></tag>) with optional newlines inside.
            /<table(.*?)>/gm, // Matches <table> tags with any attributes inside.
            /(?<=<table(.*?)>\n*?)(<tr>)/gm, // Matches <tr> tags that immediately follow a <table> tag.
            /<strong>(\s)?<\/strong>/g, // Matches empty <strong> tags (e.g., <strong></strong>) with optional whitespace inside.
            /<p>(\s)?<\/p>/g, // Matches empty <p> tags (e.g., <p></p>) with optional whitespace inside.
            /<br(\s)?\/>/g, // Matches <br> tags with optional whitespace before the closing slash.
            /(<h2> )/g, // Matches <h2> tags with a space after the opening tag.
            /(\W<\/h2>)/g, // Matches non-word characters before a closing </h2> tag.
            /(>)\n+(?=\w)/gm, // Matches newlines after a closing tag (>) and before a word character.
            /<em> <\/em>/g, // Matches empty <em> tags (e.g., <em></em>) with a space inside.
            /(?<=<)\s+|\s+(?=>)/g, // Remove whitespace at the beginning and end of tags
            /\s<strong>/g, // Match <p><strong> with space
            /\s<sup>/g, // Match <sup> with space
            /\s<a>/g, // Match <a> with space
            /<p>\s/g, // Match <p> with space
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
            "<a>", // Remove a space in front of <a>
            "<p>", // Remove a space in front of <p>
        ];   

        rgxArray.forEach((regex, i) => {
            if (i === 3 || i === 9) {
                let e = 0;
                const limit = i === 3 ? 6 : 3;
                while (e < limit) {
                    output = output.replaceAll(regex, rgxReplaceArray[i]);
                    e++;
                }
            }
            output = output.replaceAll(regex, rgxReplaceArray[i]);
        });

        // Apply H2 IDs
        $("#h2button").click(() => {
            function H2sRegex() {
                let IDs = [];
                output.match(/<h2>.+<\/h2>/g).forEach(element => {
                    let elementID = element.match(/(?!<h2>)([a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ]+)(?=<\/h2>)/g);
                    let negLook = element.match(/(?!<h2>)([a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ]|\d|\s)+<\/h2>/g);
                    IDs.push(elementID);
                    output = output.replace(element, `<h2 id="${elementID[0]}">${negLook[0]}`);
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
                        output = output.replace(element, `<li><a href="#${IDs[i]}">${content}</a></li>`);
                    });
                }
            }
            H2sRegex();
        });

        // Apply acronyms
        $.each(json_data, (i, e) => {
            let tag = JSON.stringify(e.tag).slice(1, -1).replaceAll("'", '"');
            let accronym = RegExp(e.accronym, "g");
            output = output.replaceAll(accronym, tag);
        });

        document.getElementById("output").innerHTML = output;
        $("#html-data").val(output);
    }

    function readFileInputEventAsArrayBuffer(event, callback) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (loadEvent) => callback(loadEvent.target.result);
        reader.readAsArrayBuffer(file);
    }

    function escapeHtml(value) {
        return value.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
})();

$('#copy-txt')[0].onclick = () => {
    navigator.clipboard.writeText($('#html-data')[0].value);
    alert("copied text to clipboard");
};