const fileInput = document.getElementById('fileInput');
let Nfilterable = 1;
let Nbuttons =0;

function toLetters(num) {
    "use strict";
    var mod = num % 26,
        pow = Math.floor(num / 26),
        out = mod ? String.fromCharCode(97 + mod) : 'a';  
    
    return pow ? toLetters(pow) + out : out;
}
var letter = toLetters(Nbuttons);
console.log(toLetters(0));
  let language = "";
let nameWithoutExtension = "";
let nameFile = "";
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0]; 
    if (file) {
      console.log(file.name); 
    }
	  if (file.name.endsWith('-fra.docx')) {
    language = "fra";
	  console.log(language);
  } else if (file.name.endsWith('-eng.docx')) {
    language = "eng";
	  console.log(language);
  }
	  
	  nameWithoutExtension = file.name.replace('.docx', '');
	  nameFile = nameWithoutExtension;
	 nameWithoutExtension = nameWithoutExtension.replace(/-(fra|eng)$/, ''); 
	  console.log(nameWithoutExtension);
  });

//storing metadata
	var topics = "";
   var title = "";
	var description = "";
	var keywords = "";
let code = "";
  
function transformer() {
	console.log("Transformer function is called");
	
	var abbr = [];
	var abbrFull = [];
    const container = document.getElementById('output'); 
    
    
    if (container) {
        
        const elements = container.querySelectorAll('*');
		
		var firstTable = true;
        
        elements.forEach(element => {
           
			//test
            if (element.tagName.toLowerCase() === 'p' && element.textContent.includes('certain content')) {
                
                element.style.color = 'red'; 
            }
			
			
			if (element.tagName.toLowerCase() === 'ol') {
    // Get the next sibling of the <ol> element
    const nextSibling = element.nextElementSibling;

    // Check if the next sibling is a <ul> element
    if (nextSibling && nextSibling.tagName.toLowerCase() === 'ul') {
        // Append the <ul> element as the last child of the <ol> element
        element.appendChild(nextSibling);
    }
}
			
			
			
			
			
			//tables
			
			if (element.tagName.toLowerCase() === 'table') {
				const firstTd = element.querySelector('td');
				if (firstTd) {
					 firstTd.style.width = '25%';
				}

				 const rows = element.querySelectorAll('tr');
                
				
				//Getting metadata
                if (firstTable) {
				rows.forEach(row => {
					const cols = row.querySelectorAll('td');

					
					if (cols.length >= 2) {
						const varName = cols[0].textContent.trim()
							.replace(/[^a-zA-Z0-9_]/g, '_');  // Replace special characters with underscores
						const varValue = cols[1].textContent.trim();  // Use the second column's content as the variable value
						
						//Sets metadata
						if(varName==="Sujets__" || varName === "Topics_"){
						   topics = varValue;
							console.log("Topics : " + topics);
						   }
						if(varName==="Titre___Doit_exprimer_aussi_pr_cis_ment_que_possible_le_contenu_de_la_page__5___10_mots_ou_80___100_caract_res_" || varName === "Title___Should_express_as_precisely_as_possible__the_content_of_the_page__5___10_words_or_80_100_characters_"){
						   title = varValue;
							console.log("title : " + title);
						   }
						if(varName==="Description___Br_ve_description_du_contenu_d_une_page_Web___vitez_d_utiliser_le_titre_comme_description_" || varName==="Description__Short_content_descriptor_to_a_web_page__avoid_using_the_title_as_the_description_"){
						   description = varValue;
							console.log("description : " + description);
							
						}
						if(varName==="Mots_cl_s___Les_termes_peuvent__tre_n_importe_quoi_en_rapport_avec_le_contenu_de_la_page__5___10_mots_descriptifs_" || varName === "Keywords__Terms_can_be_anything_relevant_to_the_content_of_the_page__5_10_descriptive_words_"){
						   keywords = varValue;
							console.log("keywords : " + keywords);
						   }
						
						//Sets abbr in 2 arrays
						if(varName==="Abr_viations__" || varName === "Abbreviation_"){
							const regex = /([A-Za-zÀ-ÿ\s]+)\s\((\w+)\)/g;
							let match;
							
							while ((match = regex.exec(varValue)) !== null) {
							  const fullForm = match[1].trim(); 
							  const abbreviation = match[2];   

						   abbr.push(abbreviation);
							abbrFull.push(fullForm);
							
						   }
							console.log("Abbreviations:", abbr);
						console.log("Full Forms:", abbrFull);
						}
						
						
						
						
						
					}
				});
					element.remove();
				}
				
				firstTable = false;

                element.classList.add('table','table-bordered'); 
				const firstRow = element.querySelector('tr');
    			if (firstRow) {
        		firstRow.classList.add('label-default','active');
    			}
				
				
            }
			//filterable list
			if (element.tagName.toLowerCase() === 'p' && element.textContent.includes('_filterable_list_')) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('mrgn-tp-lg');
        const newTable = document.createElement('table');
        newTable.classList.add('table', 'table-bordered', 'table-small', 'table-condensed', 'wb-tables', 'table-hover');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const rows = element.nextElementSibling.querySelectorAll('tr');
        const columns = [];
        if (rows.length > 0) {
            const headerRow = rows[0]; 
            const headers = headerRow.querySelectorAll('td, th');
            const headerRowElement = document.createElement('tr');
            headerRowElement.classList.add('label-default', 'active');
            
            headers.forEach((header, index) => {
                const th = document.createElement('th');
                th.setAttribute('scope', 'col');
                th.classList.add(`width-change${index + 1}`);
                th.textContent = header.textContent; 
                headerRowElement.appendChild(th);

                columns.push({ "data": header.textContent.trim() });
            });

            thead.appendChild(headerRowElement);
            rows.forEach((row, rowIndex) => {
                if (rowIndex > 0) { 
                    const newRow = document.createElement('tr');
                    const cells = row.querySelectorAll('td');
                    
                    cells.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.textContent; 
                        newRow.appendChild(td);
                    });
                    
                    tbody.appendChild(newRow);
                }
            });
        }
        newTable.appendChild(thead);
        newTable.appendChild(tbody);
        var url = "/remuneration-compensation/procedures/json/" + nameWithoutExtension + "-" + language + ".json";
if (Nfilterable >= 2) {
    url = "/remuneration-compensation/procedures/json/" + nameWithoutExtension + "-" + language + "-"+ Nfilterable +".json";
}

newTable.setAttribute('data-wb-tables', JSON.stringify({
    "ordering": false,
    "pageLength": 5,
    "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]],
    "ajax": { "url": url, "dataSrc": "data" },
    "columns": columns
}));
        newDiv.appendChild(newTable);
				element.nextElementSibling.remove();
        element.replaceWith(newDiv);
		Nfilterable ++;
			}
			
			
			
			
			if (element.tagName.toLowerCase() === 'h1'){
				element.setAttribute('id', 'wb-cont'); 
				element.setAttribute('property', 'name'); 
				
			}
			if (element.tagName.toLowerCase() === 'a' && element.hasAttribute('id')){
				
				element.remove();
				
			}
			
			
			//on this page links
			if (element.tagName.toLowerCase() === 'h2' && (element.textContent.includes('Sur cette page') || element.textContent.includes('On this page'))) {
    
			let nextList = element.nextElementSibling;
			while (nextList && nextList.tagName.toLowerCase() !== 'ul' && nextList.tagName.toLowerCase() !== 'ol') {
				nextList = nextList.nextElementSibling;
			}

			if (nextList) {
				// Loop through each <li> in the list
				const listItems = nextList.querySelectorAll('li');
				listItems.forEach(item => {
					// Loop through all <h2> elements to find the one with matching text content
					const correspondingH2 = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === item.textContent.trim());
					
					if (correspondingH2) {
						if (!correspondingH2.id) {
							correspondingH2.id = correspondingH2.textContent.trim().replace(/\s+/g, '-');
						}

						const link = document.createElement('a');
						link.href = `#${correspondingH2.id}`;
						link.textContent = item.textContent;
						item.textContent = ''; 
						item.appendChild(link); 
					}
				});
			}	
			}
			
			
			
			
			
			
			
			//add abbr in p and li
			if (element.tagName.toLowerCase() === 'p' || element.tagName.toLowerCase() === 'li') {
    let paragraphContent = element.innerHTML;

    // Check if <li> contains a link
    let link = element.querySelector('a');

    if (link) {
        let linkText = link.innerHTML; // Extract only the link text content

        // Loop through abbreviations and replace in the link text only
        for (let i = 0; i < abbrFull.length; i++) {
            const fullForm = abbrFull[i];
            const abbreviation = abbr[i];
            const abbrTag = `<abbr title="${fullForm}">${abbreviation}</abbr>`;

            // Ensure only standalone abbreviations are replaced (not inside other words)
            const regex = new RegExp(`\\b${abbreviation}\\b`, 'g'); 
            linkText = linkText.replace(regex, abbrTag);
        }

        // Update the link content but keep href unchanged
        link.innerHTML = linkText;
    } else {
        // If no link, apply abbreviation replacement to the whole element
        for (let i = 0; i < abbrFull.length; i++) {
            const fullForm = abbrFull[i];
            const abbreviation = abbr[i];
            const abbrTag = `<abbr title="${fullForm}">${abbreviation}</abbr>`;

            const regex = new RegExp(`\\b${abbreviation}\\b`, 'g');
            paragraphContent = paragraphContent.replace(regex, abbrTag);
        }

        element.innerHTML = paragraphContent;
    }
}
			
			

			
				
			

        });
    }
	    if (container) {
        
        const elements = container.querySelectorAll('*');
		
		
        
        elements.forEach(element => {
			//expand collapse tags, really buggy
			
				function processExpand(element, parentDetails) {
    console.log("Processing element:", element);

 // Identify the next heading that follows the *expand* element
let nextElement = element.nextElementSibling;

// Find the next heading (h1-h6) element
while (nextElement && !nextElement.tagName.toLowerCase().match(/^h[1-6]$/)) {
    nextElement = nextElement.nextElementSibling;
}

// If no heading is found, stop
if (!nextElement) {
    console.log("No heading found, stopping.");
    return;
}

const headingTag = nextElement.tagName.toLowerCase();
console.log(`Found ${headingTag}:`, nextElement);

// Create a <details> element to wrap everything
const details = document.createElement('details');
const summary = document.createElement('summary');

// Create a heading element of the same level and set its text content
const heading = document.createElement(headingTag);
heading.textContent = nextElement.textContent;

// Append the heading to the <summary>
summary.appendChild(heading);

// Append the <summary> to the <details>
details.appendChild(summary);

    // Add the new details element to the parentDetails (initially document)
    if (parentDetails) {
        parentDetails.appendChild(details);  // If inside another details, append here
    } else {
        element.parentNode.insertBefore(details, element);  // Insert <details> before the _expand_ element
    }
    console.log("Created new <details> and inserted before _expand_");

    // Remove the <h3> after adding it to <summary>
    nextElement.remove();
    console.log("Removed <h3>:", nextElement);

    // Move the next siblings (paragraphs) into the <details> block
    let currentElement = element.nextElementSibling;

    // Continue moving elements until _collapse_ is found
    while (currentElement && !currentElement.textContent.includes('_collapse_')) {
		
    console.log("Next element:", currentElement);

    if (currentElement.tagName.toLowerCase() === 'p' && currentElement.textContent.includes('_expand_')) {
        // Found a new _expand_ tag, handle it recursively
        console.log("Found nested <p>_expand_, handling recursively");
        processExpand(currentElement, details);  // Recursively process this _expand_ tag inside the current details
        
    }
		console.log(currentElement);
		console.log(currentElement.previousElementSibling);
						console.log(currentElement.nextElementSibling);
		
		
    // Only clone and append elements that are not already removed
    if (currentElement && !currentElement.textContent.includes('_expand_')) {
        const clone = currentElement.cloneNode(true);
        details.appendChild(clone);
        console.log("Cloned and appended element:", currentElement);
    } 
let nextSibling = currentElement.nextElementSibling;
    if(!nextSibling){
    nextSibling = element.nextElementSibling;
		console.log(details);
		console.log(element);
		console.log("FIXED CURRENT ELEMENT");
	}
    currentElement.remove();
    currentElement = nextSibling; // Update to the next sibling element
}


    // If we encounter a _collapse_ tag, remove it
					if(currentElement){
    if (currentElement.textContent.includes('_collapse_')) {
        console.log("Removing _collapse_ element");
        currentElement.remove();
    } else {
		console.log("NEXT ELEMENT IS A COLLAPSE");
	}
					} else{
						console.log(details);
						console.log("NO NEXT ELEMENT");
						console.log(element);
						
						console.log(currentElement);
						
					}

    // Now remove the original _expand_ element (as it's processed)
    console.log("Removed _expand_ element:", element);
    element.remove();
}



		if (element.tagName.toLowerCase() === 'p' && element.textContent.includes('_expand_')) {	
			processExpand(element);
		}
			});
}
			
			
	
	if (container) {
    const elements = container.querySelectorAll('*');

    elements.forEach(element => {
		
        // Check if it's a <p> tag and contains "_expand_button_"
        if (element.tagName.toLowerCase() === 'p' && element.textContent.includes('_buttons_')) {
            console.log("Found <p> with '_expand_button_' text:", element);

          
			letter = toLetters(Nbuttons);
            // Create the HTML structure for the button group based on language
            const btnGroup = document.createElement('div');
            btnGroup.classList.add('btn-group', 'pull-right');

            if (language === "fra") {
                btnGroup.innerHTML = `
                    <button type="button" class="btn btn-primary wb-toggle btn-sm mrgn-rght-sm" data-toggle='{"selector": "details", "parent": "#duties-${letter}", "type": "on"}'>Tout afficher</button>
                    <button type="button" class="btn btn-primary wb-toggle btn-sm" data-toggle='{"selector": "details", "parent": "#duties-${letter}", "type": "off"}'>Tout réduire</button>
                `;
            } else if (language === "eng") {
                btnGroup.innerHTML = `
                    <button type="button" class="btn btn-primary wb-toggle btn-sm mrgn-rght-sm" data-toggle='{"selector": "details", "parent": "#duties-${letter}", "type": "on"}'>Expand all</button>
                    <button type="button" class="btn btn-primary wb-toggle btn-sm" data-toggle='{"selector": "details", "parent": "#duties-${letter}", "type": "off"}'>Collapse all</button>
                `;
            }

            console.log("Created button group:", btnGroup);

            const clearfixDiv = document.createElement('div');
            clearfixDiv.classList.add('clearfix');
            console.log("Created clearfix div:", clearfixDiv);

            // Find the parent of the <p> tag
            const parentElement = element.parentNode;

            // Find the div#duties-a or create it if it doesn't exist
            let dutiesDiv = document.querySelector('#duties-'+letter);
            if (!dutiesDiv) {
                dutiesDiv = document.createElement('div');
                dutiesDiv.id = 'duties-'+letter;
                dutiesDiv.classList.add('mrgn-tp-sm');
                console.log("Created new #duties-a div");
            } else {
                console.log("Found existing #duties-a div:", dutiesDiv);
            }

            // Insert the button group and clearfix div where the <p> element is
            parentElement.insertBefore(btnGroup, element);
            parentElement.insertBefore(clearfixDiv, element);

            // Insert the duties div after the button group
            parentElement.insertBefore(dutiesDiv, element.nextSibling);
            console.log("Inserted #duties-a div after the button group.");
            let nextElement = dutiesDiv.nextElementSibling; 
            let detailsCount = 0;
            while (nextElement) {
                console.log(`Checking next element:`, nextElement); // Log the current element being checked

                if (nextElement.tagName.toLowerCase() === 'details') {
                    dutiesDiv.appendChild(nextElement); 
                    console.log(`Appended <details> element:`, nextElement); 
                    nextElement = dutiesDiv.nextElementSibling; 
                    detailsCount++; 
                } else {
                    // If it's not a <details> element, break the loop
                    console.log(`Stopped: Found a ${nextElement.tagName.toLowerCase()} element instead.`);
                    break;
                }
            }

            // After the loop, check if any <details> elements were appended
            if (detailsCount > 0) {
                console.log(`Successfully appended ${detailsCount} <details> elements to #duties-a.`);
            } else {
                console.log("No <details> elements found after #duties-a.");
            }
            element.remove();
            console.log("Removed <p> element after processing.");
			Nbuttons ++;
        }
		
		
		//fixing broken list
		if (element.tagName.toLowerCase() === 'ol') {
			let nextSibling = element.nextElementSibling;
			while (nextSibling && nextSibling.tagName.toLowerCase() === 'ol') {
			while (nextSibling.firstChild) {
				element.appendChild(nextSibling.firstChild);
			}
			nextSibling = nextSibling.nextElementSibling;
			}

		}
		
		//formating
    
		
    });
}

let div = document.getElementById('output');
    let doc = new DOMParser().parseFromString(`<body>${div.innerHTML}</body>`, "text/html");
    let prettyHTML = doc.body.innerHTML.trim();
    prettyHTML = prettyHTML.replace(/></g, ">\n<");
    console.log(prettyHTML);
		code = prettyHTML;
}

//html generation
document.getElementById('generate').addEventListener('click', function() {
            // Get the content of the div
            var content = code;

            // Send the content to the server (PHP) via fetch
            fetch('generate_html.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'content=' + encodeURIComponent(content) +
				'&title=' + encodeURIComponent(title) + 
				'&topics=' + encodeURIComponent(topics) +
				'&description=' + encodeURIComponent(description) + 
				'&language=' + encodeURIComponent(language) + 
				'&nameFile=' + encodeURIComponent(nameFile) + 
              '&keywords=' + encodeURIComponent(keywords)
            })
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = nameFile + '.html';
                link.click();
            })
            .catch(error => console.error('Error:', error));
        });
 // JavaScript Document