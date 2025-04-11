$(document).ready(() => {
    let json_data = {}; // Declare json_data properly

    $.getJSON("json/abbr.json", (data) => {
        json_data = data;
    }).fail(() => {
        console.error("An error has occurred while fetching the JSON file.");
    });

    (function () {
        document.getElementById("document")
            .addEventListener("change", handleFileSelect, false);

        function handleFileSelect(event) {
            readFileInputEventAsArrayBuffer(event, function (arrayBuffer) {
                mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                    .then(displayResult)
                    .done();
            });
        }

        function displayResult(result) {
            let output = result.value;

            // Remove unnecessary whitespace
            output = output.replace(/\s+/g, ' ').trim();

            // Regex transformations
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
                /<em> <\/em>/g
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
                ""
            ];

            // Apply regex transformations
            rgxArray.forEach((regex, i) => {
                if (i === 3 || i === 9) {
                    let iterations = i === 3 ? 6 : 3;
                    for (let e = 0; e < iterations; e++) {
                        output = output.replaceAll(regex, rgxReplaceArray[i]);
                    }
                } else {
                    output = output.replaceAll(regex, rgxReplaceArray[i]);
                }
            });

            // Apply acronyms
            $.each(json_data, function (i, e) {
                let tag = JSON.stringify(e.tag).slice(1, -1).replaceAll("'", '"');
                let accronym = RegExp(e.accronym, "g");
                output = output.replaceAll(accronym, tag);
            });

            // Update the DOM
            document.getElementById("output").innerHTML = output;
            $("#html-data").val(output);
        }

        $("#h2button").click(function () {
            function H2sRegex() {
                console.log("H2sRegex");
                let IDs = [];
                let output = document.getElementById("output").innerHTML; // Ensure output is scoped

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

                // Update the DOM with modified output
                document.getElementById("output").innerHTML = output;
                $("#html-data").val(output);
            }

            H2sRegex(); // Invoke the function
        });

        $('#copy-txt')[0].onclick = () => {
            navigator.clipboard.writeText($('#html-data')[0].value);
            alert("copied text to clipboard");
        };
    })();
},

function readFileInputEventAsArrayBuffer(event, callback) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (loadEvent) {
        var arrayBuffer = loadEvent.target.result;
        callback(arrayBuffer);
    };

    reader.readAsArrayBuffer(file);
},

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}