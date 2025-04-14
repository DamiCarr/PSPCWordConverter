<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Check if the content is sent via POST
if (isset($_POST['content'])) {
    // Capture the content from the POST request
    $content = $_POST['content'];
	$title = $_POST['title'];
	$topics = $_POST['topics'];
	$description = $_POST['description'];
	$language = $_POST['language'];
	$nameFile = $_POST['nameFile'];
	$keywords = $_POST['keywords'];
	$nameFile = $_POST['nameFile'];
	$language = $_POST['language'];
	$current_date = date('Y-m-d');

    if($language==="eng"){
   $html_template = <<<HTML
<!DOCTYPE html>
<!--[if lt IE 9]><html class="no-js lt-ie9" lang="en" dir="ltr"><![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en" dir="ltr">
<head>
<!--#include virtual="/includes/aa/AA_header.html" -->

<meta charset="utf-8"/>
<!-- Start of Title -->
<title>{$title} - GCIntranet - PSPC</title>
<!-- End of Title --> 
<!-- Start of Metadata -->
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta name="description" content="{$description}" />
<meta name="dcterms.description" content="{$description}" />
<meta name="dcterms.creator" content="Government of Canada, Public Services and Procurement Canada, Public Service Pay Centre" />
<meta name="dcterms.title" content="{$title}" />
<meta name="dcterms.issued" title="W3CDTF" content="{$current_date}" />
<meta name="dcterms.modified" title="W3CDTF" content="<!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'-->" />
<meta name="dcterms.subject" title="gccore" content="{$topics}" />
<meta name="dcterms.language" title="ISO639-2" content="eng" />
<meta name="keywords" content="{$keywords}" />
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
.checkbox label, .radio label {
    padding-left: 15px;
}
</style>
<!-- End of Custom CSS--> 

<!-- Start of no script code -->
<noscript>
<link rel="stylesheet" href="/boew-wet/wet4.0/css/noscript.min.css"/>
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
	{$content}
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
HTML;
} else{
		$html_template = <<<HTML
<!DOCTYPE html>
<!--[if lt IE 9]><html class="no-js lt-ie9" lang="fr" dir="ltr"><![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="fr" dir="ltr">
<!--<![endif]-->
<head>
<!--#include virtual="/includes/aa/AA_header.html" -->

<meta charset="utf-8" />
<title>{$title} - GCIntranet - PSPC</title>
<!-- Start of Metadata -->
<meta content="width=device-width, initial-scale=1" name="viewport" />
<meta name="description" content="{$description}" />
<meta name="dcterms.description" content="{$description}" />
<meta name="dcterms.creator" content="Gouvernement du Canada, Services publics et Approvisionnement Canada" />
<meta name="dcterms.title" content="{$title}" />
<meta name="dcterms.issued" title="W3CDTF" content="{$current_date}" />
<meta name="dcterms.modified" title="W3CDTF" content="<!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'-->" />
<meta name="dcterms.subject" title="gccore" content="{$topics}" />
<meta name="dcterms.language" title="ISO639-2" content="fra" />
<meta name="keywords" content="{$keywords}"/>
<!--#include virtual="/includes/aa/AA_metadata.html" --> 

<!-- End of Metadata--> 
<!-- Start of tete-head.html / D&eacute;but de tete-head.html --> 
<!--#include virtual="/site/wet4.0/html5/includes/tete-head.html" --> 
<!-- End of tete-head.html / Fin de tete-head.html --> 
<!-- Start of Custom CSS -->
<style>
.div-line {
    display: block;
    height: 1px;
    border: 0;
    border-top: 2px solid #3c6b69;
    margin: 1.5em 0;
    padding: 0;
}
</style>
<!-- End of Custom CSS--> 
<!-- Start of no script code -->

<noscript>
<link rel="stylesheet" href="/boew-wet/wet4.0/css/noscript.min.css" />
</noscript>
<!-- End of no script code--> 
<script>
    dataLayer1 = [];
    </script>
</head>

<body vocab="http://schema.org/" typeof="WebPage">
<ul id="wb-tphp">
  <li class="wb-slc"> <a class="wb-sl" href="#wb-cont">Passer au contenu principal</a></li>
  <li class="wb-slc visible-sm visible-md visible-lg"> <a class="wb-sl" href="#wb-info">Passer &agrave; &laquo;&#160;&Agrave; propos de ce site&#160;&raquo;</a></li>
</ul>
<!-- Start of banner_site-site_banner-fra.html / D&eacute;but de banner_site-site_banner-fra.html --> 
<!--#include virtual="/site/wet4.0/html5/includes/banner_site-site_banner-fra.html" --> 
<!-- End of banner_site-site_banner-fra.html / Fin de banner_site-site_banner-fra.html --> 
<!-- Start of nav_mega-mega_nav-fra.html / D&eacute;but de nav_mega-mega_nav-fra.html --> 
<!--#include virtual="/site/wet4.0/html5/includes/nav_mega-mega_nav-fra.html" --> 
<!-- End of nav_mega-mega_nav-fra.html / Fin de nav_mega-mega_nav-fra.html -->
<nav id="wb-bc" class="" property="breadcrumb">
  <h2 class="wb-inv">Vous &ecirc;tes ici&nbsp;:</h2>
  <div class="container">
    <div class="row">
      <ol class="breadcrumb">
        <!-- Start of pain-bread-fra.html (main site and sub-site) / D&eacute;but de pain-bread-fra.html (site principale et sous-site) --> 
        <!--#include virtual="/site/wet4.0/html5/includes/pain-bread-fra.html" --> 
        <!-- End of pain-bread-fra.html (main site and sub-site) / Fin de pain-bread-fra.html (site principale et sous-site) -->
        <li><a href="/remuneration-compensation/index-fra.html">Rémunération</a></li>
        <li><a href="/remuneration-compensation/comm-fra.html">Carrefour de la communauté de la rémunération</a></li>
        <li><a href="/remuneration-compensation/instructions-fra.html">Instructions et documentation sur le système de paye</a></li>
        <li><a href="/remuneration-compensation/utiliser-use-fra.html">Comment utiliser le système de paye</a></li>
        <li><a href="/remuneration-compensation/procedures/recherche-search-fra.html">Procédures, outils de travail et instructions de Phénix</a></li>
      </ol>
    </div>
  </div>
</nav>

<main property="mainContentOfPage" class="container"> 
  <!-- Start of Main Content -->
{$content}
  <!-- End of Main Content -->
  
  <div class="row pagedetails">
    <div class="col-sm-5 col-xs-12 datemod">
      <dl id="wb-dtmd">
        <dt>Date de modification&#160;:&#32;</dt>
        <dd>
          <time property="dateModified"><!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'--></time>
        </dd>
      </dl>
    </div>
    
  </div>
</main>
<!-- End of Main Content --> 
<!-- Start of pied_site-site_footer-fra.html / D&eacute;but de pied_site-site_footer-fra.html --> 
<!--#include virtual="/site/wet4.0/html5/includes/pied_site-site_footer-fra.html" --> 
<!-- End of pied_site-site_footer-fra.html / Fin de pied_site-site_footer-fra.html --> 
<!-- Start of script-pied_site-site_footer.html / D&eacute;but de script-pied_site-site_footer.html --> 
<!--#include virtual="/site/wet4.0/html5/includes/script-pied_site-site_footer.html" --> 
<!-- End of script-pied_site-site_footer.html / Fin de script-pied_site-site_footer.html --> 
<!-- Start of Custom Scripts --> 
<!--#set var="piwikSiteId" value="308" --> 
<!--#include virtual="/includes/piwik/piwik.html" --> 

<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script> 
<script>	
	
	var topics = [
				  "affectation intérimaire", 
				  "approbations",
				  "arriérés", 
				  "autoriser la paye",
				  "avance de salaire d’urgence et paiements prioritaires", 
				  "cadres supérieurs", 
				  'cessation d’emploi', 
				  "codes", 
				  "congé",
				  "consignes de sécurité",
				  "décès en cours d’emploi", 
				  "double emploi et rémunération",
				  "échéanciers",
				  "embauche",
				  "erreurs et exceptions",
				  "état des gains", 
				  "formulaires",
				  "gestion des salaires", 
				  'gestion temps',
				  "impôt",
				  "intégration", 
				  "interrogations et rapports",
				  "libre-service pour les employés",
				  "libre-service pour les gestionnaires",
				  "modalités d'emploi spéciales",
		          "mutation",
				  "outils", 
				  "paramètres et navigation",
				  "paye pour services supplémentaires",
		 		  "pension et avantages sociaux",
				  "prestations et indemnités", 
				  "réadaptation",
				  "ressources du centre des services de paye",
				  "retenues",
				  "retour de congé", 
				  "retraite",
				  "rétroactivité", 
				  "rôles et responsabilités",
				  "saisie directe",
				  "saisies-arrêts",
			      "séquence des mouvements",
		  	 	  "soumission d’une feuille de temps",
				  "srp",
				  "syndicat", 
				  "système central d’indexation",
				  "traitement d’une demande d’intervention de paye",
				  "trop-payé" 
	];
	
	var roles = ["conseiller en rémunération", "employé", "gestionnaire", "agent financier", "ressources humaines", "approbateur (article 33)", "agent de contrôle de l’accès pour la sécurité", "responsable de la comptabilisation du temps"]; 
	
	var alt = "Aller à la page ";
	var url = '/remuneration-compensation/procedures/json/repo-fra.json';
	
	var lang = "fra";
	
	var topicString = "Sujet";
	var roleString = "Rôle";
	
</script> 

<!-- End of Custom Scripts --> 
<!--#include virtual="/includes/aa/AA_footer.html" -->

</body>
</html>
HTML;
}
	



   

    // Create a temporary file to save the generated HTML
    $filename = $nameFile . '.html';
    file_put_contents($filename, $html_template);

    // Return the file to the browser for downloading
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($filename));
    readfile($filename);

    

    // Delete the temporary file after it's downloaded
    unlink($filename);
    
    
} else {
    // If content is not sent, log an error
    error_log("No content received in POST request", 3, "debug_log.txt");
    echo "Error: No content received!";
}
?>