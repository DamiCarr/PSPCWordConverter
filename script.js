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
            /(?<=<)\s+|\s+(?=>)/g, // Remove whitespace at the beginning and end of tags
            /\s+/g, // Remove all whitespace characters
            /<p><strong>/g // Match <p><strong> without space
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
            "<p> <strong>" // Add a space between <p> and <strong>
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