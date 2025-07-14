import { Type } from './enums.js';
import { Polysyllogism, PropositionParameter } from './syllogisms.js';
import { ValidityChecker } from './rules.js';
import { verbes , ajouterVerbesAuxSelects,ajouterVerbesAuSelectParIndex} from './input.js';
import {
    universalPositive,
    universalNegative,
    existentialPositive,
    existentialNegative,
    loadQuantifiersFromLocalStorage
} from './editor.js';


/**
 * Récupère les détails de la conclusion dans le formulaire HTML.
 * @returns {Object} Contient le quantificateur, la qualité, le sujet et le prédicat de la conclusion.
 */
export function getConclusionDetails(): { quantifier: string; quality: string; subject: string; predicate: string } {
    const quantifier = document.querySelector('input[name="quantity99"]:checked')?.id || "";
    const quality = document.querySelector('input[name="quantifierQuality99"]:checked')?.id || "";
    const subjectElement = document.getElementById('conclusion-subject');
    const subject = subjectElement ? (subjectElement as HTMLInputElement).value : "";
    const predicateElement = document.getElementById('conclusion-predicate');
    const predicate = predicateElement ? (predicateElement as HTMLInputElement).value : "";
    
   /* // Afficher les détails dans la console
    console.log("Quantifier:", quantifier);
    console.log("Quality:", quality);
    console.log("Subject:", subject);
    console.log("Predicate:", predicate);*/

    return {
        quantifier,
        quality,
        subject,
        predicate,
    };
}



/**
 * Récupère le type de verbe statique sélectionné dans la prémisse donnée.
 * @param {number} index - Index de la prémisse.
 * @returns {string | null} Verbe statique sélectionné.
 */
export function getSelectedVerb(index: number): string | null {
    const negativeRadio = document.getElementById(`NegativeQ${index}`) as HTMLInputElement;
    const positiveRadio = document.getElementById(`PositiveQ${index}`) as HTMLInputElement;

    if (negativeRadio && negativeRadio.checked) {
        return "negative";
    } else if (positiveRadio && positiveRadio.checked) {
        return "affirmative";
    }
    return null;
}


/**
 * Affiche les résultats et les détails des prémisses et de la conclusion.
 * @param {Event} event - Événement associé au clic sur le bouton.
 */
export function getSelectedOption(index: number): string | null {
    const selectElement = document.getElementById(`selectQuantifier${index * 2}`) as HTMLSelectElement;
    return selectElement ? selectElement.value : null;
}

/**
 * Récupère le verbe statique sélectionné pour une prémisse spécifique.
 * @param {number} index - Index de la prémisse.
 * @returns {string | null} Le verbe statique sélectionné ou null si aucun n'est sélectionné.
 */

export function getSelectedStativeVerb(index: number): string | null {
    const stativeVerb = document.getElementById(`selectQuantifier${index}`) as HTMLSelectElement;
    return stativeVerb ? stativeVerb.value : null;
}


/**
 * Récupère le sujet sélectionné pour une prémisse spécifique.
 * @param {number} index - Index de la prémisse.
 * @returns {string | null} Le sujet sélectionné ou null si aucun n'est défini.
 */
export function getSelectedSubject(index: number): string | null {
    const subjectInput = document.getElementById(`conclusion-subject`) as HTMLInputElement;
    return subjectInput ? subjectInput.value : null;
}


/**
 * Récupère le prédicat sélectionné pour une prémisse spécifique.
 * @param {number} index - Index de la prémisse.
 * @returns {string | null} Le prédicat sélectionné ou null si aucun n'est défini.
 */
export function getSelectedPredicate(index: number): string | null {
    const predicateInput = document.getElementById(`conclusion-predicate`) as HTMLInputElement;
    return predicateInput ? predicateInput.value : null;
}


/**
 * Récupère la figure sélectionnée parmi les options disponibles.
 * @returns {string | null} Le numéro de la figure sélectionnée ou null si aucune figure n'est sélectionnée.
 */
export function getSelectedFigure(): string | null {
    for (let i = 1; i <= 4; i++) {
        const figure = document.getElementById(`figure${i}`) as HTMLInputElement;
        if (figure && figure.checked) {
            return `${i}`;
        }
    }
    return null;
}


/**
 * Vérifie si l'hypothèse d'existence est cochée dans le formulaire.
 * @returns {boolean} True si l'hypothèse est cochée, sinon False.
 */

export function getHypothesisOfExistence(): boolean {
    const existenceCheckbox = document.getElementById('existence') as HTMLInputElement;
    return existenceCheckbox ? existenceCheckbox.checked : false;
}


/**
 * Récupère la liste des règles sélectionnées dans le formulaire.
 * @returns {string[]} Un tableau contenant les noms des règles sélectionnées.
 */

export function getSelectedRules(): string[] {
    const rules: string[] = [];
    const ruleCheckboxes = document.querySelectorAll('.rule input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    ruleCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Vérifie que labels n'est pas null avant d'accéder à innerText
            if (checkbox.labels && checkbox.labels.length > 0) {
                rules.push(checkbox.labels[0].innerText); // Ajoute le texte de l'étiquette associée à la case à cocher
            }
        }
    });

    return rules;
}


/**
 * Récupère et affiche les informations des prémisses, de la figure, des règles et de la conclusion.
 * @param {Event} event - Événement déclenché par le clic sur le bouton.
 */
export function show(event: Event): void {
    event.preventDefault();
    //console.log("je suis dans la fonction show");

    const numPremises = 2; // Nombre de prémisses dans le HTML
    const results: string[] = [];

    for (let i = 1; i <= numPremises; i++) {
        const selectedQuantifier = getSelectedQuantifier(i);
        const selectedVerb = getSelectedVerb(i);
        const selectedOption = getSelectedOption(i);
        const selectedStativeVerb = getSelectedStativeVerb(i);
        const selectedSubject = getSelectedSubject(i);
        const selectedPredicate = getSelectedPredicate(i);

        const premiseResult = `
            <h4>Premise ${i}:</h4>
            <p>Quantifier: ${selectedQuantifier}</p>
            <p>Verb: ${selectedVerb}</p>
            <p>Option: ${selectedOption}</p>
            <p>Stative Verb: ${selectedStativeVerb}</p>
            <p>Subject: ${selectedSubject}</p>
            <p>Predicate: ${selectedPredicate}</p>
        `;
        results.push(premiseResult);
    }

    const selectedFigure = getSelectedFigure();
    if (selectedFigure) {
        results.push(`<h4>Figure sélectionnée: ${selectedFigure}</h4>`);
    } else {
        results.push("<h4>Aucune figure sélectionnée</h4>");
    }

    const hypothesisOfExistence = getHypothesisOfExistence();
    results.push(`<h4>Hypothesis of existence: ${hypothesisOfExistence}</h4>`);

    // Récupérer les détails de la conclusion
    const conclusionDetails = getConclusionDetails();
    results.push(`
        <h4>Conclusion:</h4>
        <p>Quantifier: ${conclusionDetails.quantifier}</p>
        <p>Quality: ${conclusionDetails.quality}</p>
        <p>Subject: ${conclusionDetails.subject}</p>
        <p>Predicate: ${conclusionDetails.predicate}</p>
    `);

    // Récupérer et afficher les règles sélectionnées
    const selectedRules = getSelectedRules();
    if (selectedRules.length > 0) {
        results.push(`<h4>Règles sélectionnées:</h4><p>${selectedRules.join(', ')}</p>`);
    } else {
        results.push("<h4>Aucune règle sélectionnée</h4>");
    }

    displayResults(results.join(''));
}


/**
 * Affiche les résultats des prémisses, des règles et de la conclusion dans une section dédiée.
 * @param {string} resultHtml - Chaîne HTML contenant les résultats à afficher.
 */

export function displayResults(resultHtml: string): void {
    const resultDiv = document.querySelector('.Result') as HTMLElement;
    resultDiv.innerHTML = `
        <h3>********** Result ***********</h3>
        ${resultHtml}
    `;
}

// Add event listener for the validate button
document.getElementById('btn_valid_page_mode2')?.addEventListener('click', show);


/**
 * Récupère la valeur du moyen terme à partir d'un champ texte.
 * @returns {string} La valeur du moyen terme ou une chaîne vide si le champ est vide.
 */
export function getMediumTermValue(): string {
    // Récupérer l'élément input par son ID
    const mediumTermInput = document.getElementById('mediumtermtxt') as HTMLInputElement;
    
    // Vérifier si l'élément existe et retourner sa valeur, sinon une chaîne vide
    return mediumTermInput ? mediumTermInput.value : "";
}


/**
 * Récupère le quantificateur sélectionné pour une prémisse donnée.
 * @param {number} premiseNumber - Numéro de la prémisse.
 * @returns {string} L'ID du quantificateur sélectionné ou une chaîne vide si aucun n'est sélectionné.
 */

export function getSelectedQuantifier(premiseNumber: number): string {
    const quantifierRadios = document.getElementsByName(`quantity${premiseNumber}`);
    for (const radio of quantifierRadios) {
        if ((radio as HTMLInputElement).checked) {
            return (radio as HTMLInputElement).id; // ID du radio sélectionné
        }
    }
    return ""; // Chaîne vide si aucun n'est sélectionné
}


/**
 * Récupère la qualité sélectionnée (positive ou négative) pour une prémisse donnée.
 * @param {number} premiseNumber - Numéro de la prémisse.
 * @returns {string} L'ID de la qualité sélectionnée ou une chaîne vide si aucune n'est sélectionnée.
 */

export function getSelectedQuality(premiseNumber: number): string {
    const qualityRadios = document.getElementsByName(`quantifierQuality${premiseNumber}`);
    for (const radio of qualityRadios) {
        if ((radio as HTMLInputElement).checked) {
            return (radio as HTMLInputElement).id; // ID du radio sélectionné
        }
    }
    return ""; // Chaîne vide si aucun n'est sélectionné
}


/**
 * Détermine le type de quantificateur en fonction de son type (universel ou existentiel) et de sa qualité.
 * @param {string} quantifier - Le quantificateur sélectionné.
 * @param {string} quality - La qualité sélectionnée.
 * @returns {string} Le type de quantificateur (A, E, I, O) ou une chaîne vide si aucune correspondance.
 */

export function getQuantifierType(quantifier: string, quality: string): string {
    //console.log(quantifier + " " + quality);
   
    if ( (quantifier.startsWith("Universal") || quantifier.startsWith("universal")) && quality.startsWith("positive")) {
        return "A"; // Universel Affirmatif
    } else if ((quantifier.startsWith("Universal") || quantifier.startsWith("universal")) && quality.startsWith("negative")) {
        return "E"; // Universel Négatif
    } else if ((quantifier.startsWith("Existentiel") || quantifier.startsWith("existentiel"))&& quality.startsWith("positive")) {
        return "I"; // Existentiel Affirmatif
    } else if ((quantifier.startsWith("Existentiel") || quantifier.startsWith("existentiel")) && quality.startsWith("negative")) {
        return "O"; // Existentiel Négatif
    }
    return ""; // Retourner une chaîne vide si rien ne correspond
}


/**
 * Réinitialise tous les champs d'entrée du formulaire.
 */
export function resetForm(): void {
    const inputs = document.querySelectorAll('input[type="text"], input[type="radio"], input[type="checkbox"], select');
    
    inputs.forEach(input => {
        // Type assertion to identify the specific type of the element
        if (input instanceof HTMLInputElement) {
            if (input.type === "text") {
                input.value = ""; // Clear text inputs
            } else if (input.type === "radio" || input.type === "checkbox") {
                input.checked = false; // Uncheck radio and checkbox inputs
            }
        } else if (input instanceof HTMLSelectElement) {
            input.selectedIndex = 0; // Reset select to the first option
        }
    });

    // Clear the result display
    const resultDiv = document.querySelector('.Result') as HTMLElement;
    resultDiv.innerHTML = "********** Result ***********"; // Reset result message
}

// Add event listener for the reset button
document.getElementById('reset')?.addEventListener('click',  function(event) {
    event.preventDefault(); // Prevent the default reset action
    resetForm(); // Call the reset export function to clear fields
});


/**
 * Crée un tableau contenant un seul élément `true` positionné aléatoirement.
 * @param {number} size - Taille du tableau.
 * @returns {boolean[]} Tableau avec un seul `true`.
 */

export function createArrayWithOneTrue(size: number): boolean[] {
    // Initialize an array filled with falsee
    const array: boolean[] = new Array(size).fill(false);

    // Randomly select an index to set to true
    const trueIndex = Math.floor(Math.random() * size);
    array[trueIndex] = true;

    return array;
}



const arrayOfTrue: boolean[] = createArrayWithOneTrue(8);
/**
 * Vérifie quelles règles sont cochées dans le formulaire et retourne leur état.
 * @returns {boolean[]} Un tableau contenant l'état des règles (true si cochée, false sinon).
 */
export function checkRules() {
    const rules: boolean[] = [
        (document.getElementById('rmt') as HTMLInputElement).checked,
        (document.getElementById('rnn') as HTMLInputElement).checked,
        (document.getElementById('raa') as HTMLInputElement).checked,
        (document.getElementById('rp') as HTMLInputElement).checked,
        (document.getElementById('rlh') as HTMLInputElement).checked,
        (document.getElementById('rn') as HTMLInputElement).checked,
        (document.getElementById('rpp') as HTMLInputElement).checked,
        (document.getElementById('ruu') as HTMLInputElement).checked,
    ];

  
    /*
    console.log("Règles sélectionnées :");
    console.log("Rmt : " + rules[0]);
    console.log("Rnn : " + rules[1]);
    console.log("Raa : " + rules[2]);
    console.log("Rp : " + rules[3]);
    console.log("Rlh : " + rules[4]);
    console.log("Rn : " + rules[5]);
    console.log("Rpp : " + rules[6]);
    console.log("Ruu : " + rules[7]);*/

    return rules; 
}


/**
 * Fonction pour valider et analyser les prémisses et la conclusion, selon le mode 1.
 * @param {Event} event - L'événement déclenché lors de l'exécution.
 */
 export function mode1(event: Event): void {
   
    event.preventDefault();

     // Validate fields before proceeding
     /*if (!validateFields()) {
        alert("Veuillez remplir tous les champs avant de continuer."); // Alert the user
        return; // Exit the export function if validation fails
    }*/

    const propositions: PropositionParameter[] = [
        { subject: "", predicate: "", type: Type.A }, // Proposition 1
        { subject: "", predicate: "", type: Type.A }, // Proposition 2
        { subject: "", predicate: "", type: Type.A }  // Proposition 3, si nécessaire
    ];

    const numPremises = 2; // Nombre de prémisses dans le HTML
    const results: string[] = [];
    const conclusionDetails = getConclusionDetails();
    let typetmp = getQuantifierType(conclusionDetails.quantifier,conclusionDetails.quality);

    let typec :Type ;
    switch (typetmp) {
        case "A":
            typec = Type.A;
            break;
        case "E":
            typec = Type.E;
            break;
        case "I":
            typec = Type.I;
            break;
        case "O":
            typec = Type.O;
            break;
        default:
            typec = Type.A; 
            break;
    }
    

    // Récupérer la figure sélectionnée avant la boucle
    const selectedFigure = getSelectedFigure();

    for (let i = 1; i <= numPremises; i++) {
        const selectedQuantifier = getSelectedQuantifier(i);
        const selectedQuality = getSelectedQuality(i);
        const selectedVerb = getSelectedVerb(i);
        const selectedOption = getSelectedOption(i);
        const selectedStativeVerb = getSelectedStativeVerb(i);
        const selectedSubject = getSelectedSubject(i) || "";
        const selectedPredicate = getSelectedPredicate(i) || "";
        const selectedType = getQuantifierType(selectedQuantifier, selectedQuality);

        let typeValue: Type;
        switch (selectedType) {
            case "A":
                typeValue = Type.A;
                break;
            case "E":
                typeValue = Type.E;
                break;
            case "I":
                typeValue = Type.I;
                break;
            case "O":
                typeValue = Type.O;
                break;
            default:
                typeValue = Type.A; // Valeur par défaut si aucun type n'est sélectionné
                break;
        }
        const term = getMediumTermValue();

        
        // Ajout d'un switch case pour gérer la logique en fonction de la figure sélectionnée
        let figureMessage = "";
        switch (selectedFigure) {
            
            case "1":
                if(i == 1){
                    propositions[i - 1].subject = term;
                    
                    propositions[i - 1].predicate = selectedPredicate;
                    propositions[i -1 ].type = typeValue;
                    //console.log("premise 1 " + " " + typeValue.getString());

                }
                if(i == 2){
                    propositions[i - 1].subject = selectedSubject;
                    propositions[i - 1].predicate = term;
                    propositions[i -1 ].type = typeValue;
                   // console.log("premise 2 "+ " " +typeValue.getString());

                    propositions[i ].subject = selectedSubject;
                    propositions[i ].predicate = selectedPredicate;;
                    propositions[i  ].type = typec;
                   // console.log( "c " + " " +typec.getString());
                }
                
                break;
            case "2":
                if(i == 1){
                    propositions[i - 1].subject = selectedPredicate;
                    
                    propositions[i - 1].predicate = term;
                    propositions[i -1 ].type = typeValue;
                    //console.log(typeValue);

                }
                if(i == 2){
                    propositions[i - 1].subject = selectedSubject;
                    propositions[i - 1].predicate = term;
                    propositions[i -1 ].type = typeValue;
                    //console.log(typeValue);

                    propositions[i ].subject = selectedSubject;
                    propositions[i ].predicate = selectedPredicate;;
                    propositions[i  ].type = typec;
                    //console.log(typec);
                }
                break;
            case "3":
                if(i == 1){
                    propositions[i - 1].subject = term;
                    
                    propositions[i - 1].predicate = selectedPredicate;
                    propositions[i -1 ].type = typeValue;
                   // console.log(typeValue);

                }
                if(i == 2){
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedSubject;
                    propositions[i -1 ].type = typeValue;
                    //console.log(typeValue);

                    propositions[i ].subject = selectedSubject;
                    propositions[i ].predicate = selectedPredicate;;
                    propositions[i  ].type = typec;
                   // console.log(typec);
                }
                break;
            case "4":
                if(i == 1){
                    propositions[i - 1].subject = selectedPredicate;
                    
                    propositions[i - 1].predicate = term;
                    propositions[i -1 ].type = typeValue;
                    //console.log(typeValue);

                }
                if(i == 2){
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedSubject;
                    propositions[i -1 ].type = typeValue;
                   // console.log(typeValue);

                    propositions[i ].subject = selectedSubject;
                    propositions[i ].predicate = selectedPredicate;;
                    propositions[i  ].type = typec;
                   // console.log(typec);
                }
                break;
            default:
                figureMessage = "Aucune figure sélectionnée.";
                break;
        }

        const premiseResult = `
            <h4>Premise ${i}:</h4>
            <p>Quantifier: ${selectedQuantifier}</p>
            <p>Quality: ${selectedQuality}</p>
            <p>Verb: ${selectedVerb}</p>
            <p>Option: ${selectedOption}</p>
            <p>Stative Verb: ${selectedStativeVerb}</p>
            <p>Subject: ${selectedSubject}</p>
            <p>Predicate: ${selectedPredicate}</p>
            <p>${figureMessage}</p> <!-- Afficher le message basé sur la figure -->
        `;
        results.push(premiseResult);
    }

    // Logique pour le reste des résultats...

    const hypothesisOfExistence = getHypothesisOfExistence();
    results.push(`<h4>Hypothesis of existence: ${hypothesisOfExistence}</h4>`);

    // Récupérer les détails de la conclusion
    
    results.push(`
        <h4>Conclusion:</h4>
        <p>Quantifier: ${conclusionDetails.quantifier || ""}</p>
        <p>Quality: ${conclusionDetails.quality || ""}</p>
        <p>Subject: ${conclusionDetails.subject || ""}</p>
        <p>Predicate: ${conclusionDetails.predicate || ""}</p>
    `);

    // Récupérer et afficher les règles sélectionnées
    const selectedRules = getSelectedRules();
    if (selectedRules.length > 0) {
        results.push(`<h4>Règles sélectionnées:</h4><p>${selectedRules.join(', ')}</p>`);
    } else {
        results.push("<h4>Aucune règle sélectionnée</h4>");
    }


    console.log(propositions);
    let poly: Polysyllogism = new Polysyllogism(2, propositions);
    let checker: ValidityChecker = new ValidityChecker( checkRules());
    
    console.log(poly.toString());
    // Appel à checkValidity et stockage du résultat
    const validityResult = checker.checkValidity(poly);
    console.log(validityResult);
    
    // Ajouter le texte final avec la valeur du résultat
    results.push(`<h4>Votre syllogisme est ${validityResult}</h4>`);
    

    displayResults(results.join(''));
}


document.getElementById('validerm1')?.addEventListener('click', mode1);



/**
 * Supprime une proposition existante et réindexe les autres propositions.
 * @param {number} index - L'index de la proposition à supprimer.
 */

export function deleteProposition(index: number): void {
    const propositionElement = document.getElementById(`premise${index}`);
    if (!propositionElement) {
        //console.warn(`Proposition avec index ${index} introuvable.`);
        return;
    }

    propositionElement.remove();

    const propositions = Array.from(document.querySelectorAll('.card'));
    //console.log(propositions);
    propositions.forEach((prop, i) => {
        const newIndex = i + 1;

        prop.id = `premise${newIndex}`;

        const header = prop.querySelector('h3') as HTMLHeadingElement;
        if (header) {
            header.innerText = `Premise ${newIndex}`;
        }

        const quantifierInputs = prop.querySelectorAll('input[name^="quantity"], input[name^="quantifierQuality"]');
        quantifierInputs.forEach((input) => {
            if (input instanceof HTMLInputElement) {
                if (input.name) {
                    const oldName = input.name;
                    input.name = input.name.replace(/\d+$/, newIndex.toString());
                    //console.log(`Nom du quantificateur modifié : ${oldName} → ${input.name}`);
                }

                if (input.id) {
                    const oldId = input.id;
                    input.id = input.id.replace(/\d+$/, newIndex.toString());
                    //console.log(`ID du quantificateur modifié : ${oldId} → ${input.id}`);
                }
            }
        });

        const quantifierSelect = prop.querySelector(`select[id^="selectQuantifier"]`);
        if (quantifierSelect instanceof HTMLSelectElement) {
            const oldId = quantifierSelect.id;
            quantifierSelect.id = `selectQuantifier${newIndex * 2}`;
            //console.log(`ID du select modifié : ${oldId} → ${quantifierSelect.id}`);
        }

        const inputs = prop.querySelectorAll('input, select, label, button');
        inputs.forEach((input) => {
            if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLLabelElement) {
                if (input.id) {
                    const oldId = input.id;
                    input.id = input.id.replace(/\d+$/, newIndex.toString());
                    //console.log(`ID modifié : ${oldId} → ${input.id}`);
                }

                if (input instanceof HTMLInputElement && input.name) {
                    const oldName = input.name;
                    input.name = input.name.replace(/\d+$/, newIndex.toString());
                    //console.log(`Nom modifié : ${oldName} → ${input.name}`);
                }
            }
        });

        attachEventsToProposition(newIndex);
        updateSelectOptions(newIndex);
        showQmode1mode2();
        ajouterVerbesAuxSelects();
        updateSelectOptions(99);
    });
}

(window as any).deleteProposition = deleteProposition;


/**
 * Crée le HTML pour une nouvelle proposition.
 * @param {number} index - L'index de la nouvelle proposition.
 * @returns {string} - HTML de la nouvelle proposition.
 */
export function createProposition(index: number): string {
    // Obtenir le nombre actuel de propositions
    const propositions = Array.from(document.querySelectorAll('.card'));

    // Calculer l'index précédent (le dernier index de proposition existante)
    const previousIndex = propositions.length > 0 ? propositions.length : 0;

    return `
    <div id="premise${index}" class="card">
                <h3>
            <span>Premise ${index}</span>
            <span class="tooltip">&#x24D8;<span class="tooltiptext" id="tooltip_premise2">Relie le terme mineur au moyen terme</span></span>
        </h3>
        <span class="close" onclick="deleteProposition(${index}-1)">&#x2716;</span>


        <!-- Section Quantification -->
        <div class="subCard">
            <h4 id="quantifier_h4">Quantifier</h4>
            <div class="radio-group">
                <input type="radio" id="Universal${index}" name="quantity${index}" value="universal" checked/>
                <label id="universal${index}_page_mode2_label" for="Universal${index}">Universal</label>

                <input type="radio" id="Existentiel${index}" name="quantity${index}" value="existential"/>
                <label id="existentiel${index}_page_mode2_label" for="Existentiel${index}">Existentiel</label>
            </div>
            <div class="radio-group">
                <input type="radio" id="negativeQ${index}" name="quantifierQuality${index}" value="negative" checked/>
                <label id="negativeQ${index}_page_mode2_label" for="negativeQ${index}">Negative</label>

                <input type="radio" id="positiveQ${index}" name="quantifierQuality${index}" value="positive"/>
                <label id="positiveQ${index}_page_mode2_label" for="positiveQ${index}">Positive</label>
            </div>
            <select id="selectQuantifier${index}" class="select">
                <option value="" disabled selected hidden>PlaceHolder</option>
            </select>
        </div>

        <!-- Section Sujet -->
        <div class="subCard">
            <h4>Subject</h4>
            <div class="radio-group">
                <input type="radio" id="subject_premise${index}_previous_subject" name="subject${index}" value="previousSubject" />
                <label id="subject_premise${index}_previous_subject" for="subject_premise${index}_previous_subject">Sujet P${previousIndex}</label>

                <input type="radio" id="subject_premise${index}_previous_predicate" name="subject${index}" value="previousPredicate" />
                <label for="subject_premise${index}_previous_predicate">Prédicat P${previousIndex}</label>

                <input type="radio" id="subject_premise${index}_other" name="subject${index}" value="other" />
                <label for="subject_premise${index}_other">Autre</label>

                <input type="text" id="custom_subject_premise${index}" class="textField" placeholder="Saisir un sujet" style="display: none;" />
            </div>
        </div>

        <!-- Section Stative Verb -->
        <div class="subCard">
            <h4 id="title_stative_verb_premise${index}_page_mode2">Stative Verb</h4>
            <div class="radio-group">
                <input type="radio" id="negativeSV${index}_page_mode2" name="stativeQuality${index}" value="negative" checked/>
                <label id="negativeSV${index}_page_mode2_label" for="negativeSV${index}_page_mode2">Negative</label>

                <input type="radio" id="positiveSV${index}_page_mode2" name="stativeQuality${index}" value="positive"/>
                <label id="positiveSV${index}_page_mode2_label" for="positiveSV${index}_page_mode2">Positive</label>
            </div>
            <select id="selectStativeVerb${index}" class="select">
                <option value="" disabled selected hidden>PlaceHolder</option>
            </select>
        </div>

        <!-- Section Prédicat -->
        <div class="subCard">
            <h4>Predicate</h4>
            <div class="radio-group">
                <input type="text" id="custom_predicate_premise${index}" class="textField" placeholder="Saisir un prédicat" style="display: none;" />

                <div id="predicate_options_premise${index}" style="display: none;">
                    <input type="radio" id="predicate_premise${index}_previous_subject" name="predicate${index}" value="previousSubject" />
                    <label for="predicate_premise${index}_previous_subject">Sujet P${previousIndex}</label>

                    <input type="radio" id="predicate_premise${index}_previous_predicate" name="predicate${index}" value="previousPredicate" />
                    <label for="predicate_premise${index}_previous_predicate">Prédicat P${previousIndex}</label>
                </div>
            </div>
        </div>

        
    </div>
    `;
}

/**
 * Attache des événements aux éléments d'une proposition.
 * @param {number} index - L'index de la proposition.
 */
export function attachEventsToProposition(index: number) {
    const subjectRadios = document.querySelectorAll(`input[name="subject${index}"]`);
    const customSubjectField = document.getElementById(`custom_subject_premise${index}`);
    const customPredicateField = document.getElementById(`custom_predicate_premise${index}`);
    const predicateOptions = document.getElementById(`predicate_options_premise${index}`);

    if (!subjectRadios.length) {
        //console.log(`Aucun radio trouvé pour subject${index}`);
        return;
    }

    subjectRadios.forEach((radio) => {
        radio.addEventListener('change', (event) => {
            const value = (event.target as HTMLInputElement).value;
            //console.log(`Radio sélectionné pour subject${index}:`, value);

            if (value === 'other') {
                //console.log('Sujet "Autre" sélectionné');
                customSubjectField!.style.display = 'block';
                predicateOptions!.style.display = 'block';
                customPredicateField!.style.display = 'none';
            } else {
                //console.log(`Sujet précédent sélectionné: ${value}`);
                customSubjectField!.style.display = 'none';
                predicateOptions!.style.display = 'none';
                customPredicateField!.style.display = 'block';
            }
        });
    });

    //console.log(`Événements attachés à subject${index}`);
}

/**
 * Ajoute une nouvelle prémisse à l'interface utilisateur.
 */
export function addProposition(): void {
    const propositionsContainer = document.querySelector('.propositions-container') as HTMLElement;

    if (!propositionsContainer) {
        console.error("Le conteneur de propositions n'a pas été trouvé.");
        return; // Sortir de la fonction si le conteneur n'existe pas
    }

    const lastPremiseIndex = propositionsContainer.children.length + 1; // Nombre total de propositions + 1
    //console.log(`Ajout d'une nouvelle proposition avec l'index ${lastPremiseIndex}`);

    const newPropositionHTML = createProposition(lastPremiseIndex); // Créez la nouvelle proposition

    // Insérer la nouvelle proposition avant le bouton "ADD PROPOSITION"
    const addPropositionButton = document.getElementById('addPropositionButton');

    if (!addPropositionButton) {
       // console.error("Le bouton 'ADD PROPOSITION' n'a pas été trouvé.");
        return; // Sortir de la fonction si le bouton n'existe pas
    }

    // Insérer la nouvelle proposition
    propositionsContainer.insertBefore(createElementFromHTML(newPropositionHTML), addPropositionButton);

    // Réindexer toutes les propositions après l'ajout
    const propositions = Array.from(document.querySelectorAll('.card'));
    propositions.forEach((prop, i) => {
        const newIndex = i+1; // Les nouveaux indices commencent à 1
        prop.id = `premise${newIndex}`;
        const header = prop.querySelector('h3') as HTMLHeadingElement;
        if (header) {
            header.innerText = `Premise ${newIndex}`;
        }
    });

    // Attacher les événements à la nouvelle proposition
    attachEventsToProposition(lastPremiseIndex);
    updateSelectOptions(lastPremiseIndex);
    showQmode1mode2();
    ajouterVerbesAuSelectParIndex(lastPremiseIndex);
    updateSelectOptions(99);
}


/**
 * Convertit une chaîne HTML en un élément DOM.
 * 
 * @param {string} htmlString - La chaîne contenant le code HTML à convertir.
 * @returns {HTMLElement} - L'élément DOM correspondant au premier enfant de la chaîne HTML.
 */
export function createElementFromHTML(htmlString: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim(); // Nettoyer les espaces
    return div.firstChild as HTMLElement; // Retourner le premier enfant
}

/**
 * Ajoute un écouteur d'événements pour le bouton "ADD PROPOSITION".
 * 
 * Ajoute une nouvelle prémisse en déclenchant l'appel à `addProposition` lorsqu'un clic est détecté sur le bouton.
 * 
 * @listens DOMContentLoaded - Ajoute l'écouteur après que le DOM est chargé.
 */
document.addEventListener("DOMContentLoaded", () => {
    const addPropositionButton = document.getElementById('addPropositionButton') as HTMLButtonElement;
    if (addPropositionButton) {
        addPropositionButton.addEventListener('click', (event) => {
            event.preventDefault();
            addProposition(); 
        });
    }
});


/**
 * Ajoute un gestionnaire d'événements pour les clics sur les boutons de suppression.
 * 
 * Identifie les boutons de suppression en fonction de leur ID (`deletePropositionX`) et appelle `deleteProposition`.
 * 
 * @param {Event} event - L'événement déclenché par le clic.
 */

document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    // Vérifier si le clic est sur un bouton de suppression
    if (target && target.matches('button[id^="deleteProposition"]')) {
        event.preventDefault(); // Empêche le comportement par défaut

        // Extraire l'index du bouton "Supprimer"
        const index = parseInt(target.id.replace('deleteProposition', ''), 10);
        if (!isNaN(index)) {
            //console.log(`Bouton supprimer cliqué : deleteProposition${index}`);
            deleteProposition(index);
        } else {
            console.error('Échec de la détection de l\'index à partir de l\'ID du bouton:', target.id);
        }
    }
});

/**
 * Affiche les options d'un menu déroulant spécifique en fonction de la sélection.
 * 
 * Modifie dynamiquement les options d'un élément `<select>` en fonction de la combinaison de quantificateur
 * (universel/existentiel) et valence (positive/négative).
 * 
 * @param {string} selection - La combinaison sélectionnée (ex. "UP" pour Universel Positif).
 * @param {HTMLSelectElement} selectElement - L'élément `<select>` à mettre à jour.
 */


export function showQuantifierOptionsForSelect(selection: string, selectElement: HTMLSelectElement): void {
    // Efface les options existantes
    selectElement.innerHTML = "";

    // Vérifie si des données sont disponibles pour la sélection
    let options: string[] = [];

    // Choisir les options selon la sélection
    switch (selection) {
        case "UP": // Universel Positif
            options = universalPositive;
            break;
        case "UN": // Universel Négatif
            options = universalNegative;
            break;
        case "EP": // Existentiel Positif
            options = existentialPositive;
            break;
        case "EN": // Existentiel Négatif
            options = existentialNegative;
            break;
    }

    // Parcourt chaque élément de données et l'ajoute comme option
    options.forEach((text, index) => {
        
        const option = document.createElement("option");
        option.value = text;
        option.textContent = text;

        // Définit la première option comme "placeholder"
        if (index === 0) {
            option.disabled = true;
            option.selected = true;
        }

        // Ajoute l'option au <select>
        selectElement.appendChild(option);
    });

    selectElement.style.display = "block"; // Affiche le <select>
}


/**
 * Met à jour les options d'un quantificateur spécifique.
 * 
 * Détecte les changements dans les boutons radio pour le quantificateur et la valence,
 * puis met à jour les options du menu déroulant correspondant.
 * 
 * @param {number} quantifierId - L'identifiant du quantificateur à mettre à jour.
 */
 export function updateSelectOptions(quantifierId: number): void {
    
    // Obtenir les éléments radio pour le quantificateur spécifié
    const universalRadio = document.getElementById(`Universal${quantifierId}`) as HTMLInputElement | null;
    const existentialRadio = document.getElementById(`Existentiel${quantifierId}`) as HTMLInputElement | null;
    const positiveRadio = document.getElementById(`positiveQ${quantifierId}`) as HTMLInputElement | null;
    const negativeRadio = document.getElementById(`negativeQ${quantifierId}`) as HTMLInputElement | null;
    const selectElement = document.getElementById(`selectQuantifier${quantifierId}`) as HTMLSelectElement | null;
    /*if (!selectElement) {
        console.error(`Select element not found for quantifier ID: ${quantifierId}`);
        return;
    }*/

    if (!selectElement) return; // Si le <select> n'existe pas, arrêter la fonction

    // Déterminer la combinaison sélectionnée
    let quantifier = "";
    let valence = "";

    if (universalRadio && universalRadio.checked) {
        quantifier = "U"; // Universel
    } else if (existentialRadio && existentialRadio.checked) {
        quantifier = "E"; // Existentiel
    }

    if (positiveRadio && positiveRadio.checked) {
        valence = "P"; // Positive
    } else if (negativeRadio && negativeRadio.checked) {
        valence = "N"; // Negative
    }

    const selection = quantifier + valence; 
    
    showQuantifierOptionsForSelect(selection, selectElement); // Afficher les options appropriées dans le <select>
}


/**
 * Initialise les événements pour les quantificateurs dans le document.
 * 
 * Ajoute des gestionnaires d'événements pour chaque bouton radio de quantificateur et valence,
 * et appelle `updateSelectOptions` lors d'un changement.
 * 
 * @listens DOMContentLoaded - Ajoute l'écouteur après que le DOM est chargé.
 */
  document.addEventListener("DOMContentLoaded",  function() {
    const quantifierIds = [1, 2, 99]; // Ajoute l'ID pour la conclusion (3 pour selectQuantifier6)

    quantifierIds.forEach(id => {
        
        // Obtenir les boutons radio pour chaque quantificateur
        const quantifierRadios = document.querySelectorAll<HTMLInputElement>(`input[name="quantity${id}"]`);
        const valenceRadios = document.querySelectorAll<HTMLInputElement>(`input[name="quantifierQuality${id}"]`);

        // Ajouter un événement de changement pour chaque bouton radio du quantificateur
        quantifierRadios.forEach(radio => {
            radio.addEventListener("change", () => updateSelectOptions(id));
        });

        valenceRadios.forEach(radio => {
            radio.addEventListener("change", () => updateSelectOptions(id));
        });
    });
    ajouterVerbesAuxSelects();
    updateSelectOptions(99);
    
});


/**
 * Ajoute les gestionnaires d'événements pour les options des quantificateurs en mode 1 et mode 2.
 * 
 * Parcourt toutes les propositions et détecte les changements dans les sélections de quantificateur.
 * Appelle `updateSelectOptions` pour chaque modification détectée.
 */
export function showQmode1mode2() {
    //logPropositionsDetails();
     let  propositions = Array.from(document.querySelectorAll('.card')); // Récupérer toutes les propositions
     
    propositions.forEach((proposition, index) => {
        // Trouver l'élément <input> radio avec l'ID "Universal" dans cette proposition
        const universalRadio = proposition.querySelector<HTMLInputElement>(`input[id^="Universal"]`);

        if (universalRadio) {
            // Extraire l'entier de l'ID
            const match = universalRadio.id.match(/\d+/);
            const id = match ? parseInt(match[0], 10) : null;

            //console.log(`Proposition index: ${index + 1}, Universal ID: ${id}`);

            // Obtenir les boutons radio correspondants pour quantity et quantifierQuality
            const quantifierRadios = proposition.querySelectorAll<HTMLInputElement>(`input[name="quantity${id}"]`);
            const valenceRadios = proposition.querySelectorAll<HTMLInputElement>(`input[name="quantifierQuality${id}"]`);

            //console.log(`Quantifier Radios trouvés pour ID ${id}: ${quantifierRadios.length}`);
            //console.log(`Valence Radios trouvés pour ID ${id}: ${valenceRadios.length}`);

            // Ajouter un événement de changement pour chaque bouton radio du quantificateur
            quantifierRadios.forEach(radio => {
                radio.addEventListener("change", () => updateSelectOptions(id!));
            });

            valenceRadios.forEach(radio => {
                radio.addEventListener("change", () => updateSelectOptions(id!));
            });
        } else {
            console.warn(`Aucun Universal Radio trouvé dans la proposition ${index + 1}`);
        }
    });

     propositions = Array.from(document.querySelectorAll('.card2')); // Récupérer toutes les propositions

    propositions.forEach((proposition, index) => {
        // Trouver l'élément <input> radio avec l'ID "Universal" dans cette proposition
        const universalRadio = proposition.querySelector<HTMLInputElement>(`input[id^="Universal"]`);

        if (universalRadio) {
            // Extraire l'entier de l'ID
            const match = universalRadio.id.match(/\d+/);
            const id = match ? parseInt(match[0], 10) : null;

           // console.log(`Proposition index: ${index + 1}, Universal ID: ${id}`);

            // Obtenir les boutons radio correspondants pour quantity et quantifierQuality
            const quantifierRadios = proposition.querySelectorAll<HTMLInputElement>(`input[name="quantity${id}"]`);
            const valenceRadios = proposition.querySelectorAll<HTMLInputElement>(`input[name="quantifierQuality${id}"]`);

           // console.log(`Quantifier Radios trouvés pour ID ${id}: ${quantifierRadios.length}`);
           // console.log(`Valence Radios trouvés pour ID ${id}: ${valenceRadios.length}`);

            // Ajouter un événement de changement pour chaque bouton radio du quantificateur
            quantifierRadios.forEach(radio => {
                radio.addEventListener("change", () => updateSelectOptions(99));
            });

         

            valenceRadios.forEach(radio => {
                radio.addEventListener("change", () => updateSelectOptions(99));
            });
        } else {
            console.warn(`Aucun Universal Radio trouvé dans la proposition ${index + 1}`);
        }
    });
}





/**
 * Charge les quantificateurs depuis le stockage local et met à jour l'interface utilisateur.
 * 
 * Appelé lorsque la page est entièrement chargée. Cette fonction effectue les étapes suivantes :
 * - Charge les quantificateurs depuis le stockage local.
 * - Affiche les quantificateurs dans une liste organisée.
 * - Met à jour le menu déroulant pour supprimer les quantificateurs.
 * 
 * @listens DOMContentLoaded - Appelé après le chargement complet du DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadQuantifiersFromLocalStorage();
    displayQuantifiers(); // Afficher les quantificateurs chargés
    updateDeleteDropdown(); // Mettre à jour le menu déroulant de suppression
  
});


/**
 * Met à jour le menu déroulant de suppression des quantificateurs.
 * 
 * Récupère les quantificateurs existants et les affiche dans une liste déroulante pour permettre leur suppression.
 * 
 * - Si aucun élément de suppression n'est trouvé, la fonction s'arrête.
 * 
 * @returns {void}
 */
export function updateDeleteDropdown() {
    const deleteSelect = document.getElementById('deleteQuantifierSelect');

    // Vérifier si l'élément n'existe pas
    if (!deleteSelect) {
        // Si l'élément n'existe pas, sortir de la fonction
       
        return;
    }

    deleteSelect.innerHTML = ''; // Effacer les options existantes
    const allQuantifiers = [
        ...universalPositive,
        ...universalNegative,
        ...existentialPositive,
        ...existentialNegative
    ];

    allQuantifiers.forEach(quantifier => {
        const option = document.createElement('option');
        option.value = quantifier;
        option.textContent = quantifier;
        deleteSelect.appendChild(option);
    });
}

/**
 * Affiche les quantificateurs par catégorie dans une liste.
 * 
 * - Efface la liste existante avant de la remplir.
 * - Organise les quantificateurs en catégories (universel positif, universel négatif, etc.).
 * - Permet de sélectionner un quantificateur pour modification via un clic.
 * 
 * @returns {void}
 */
export function displayQuantifiers() {
    const quantifierList = document.getElementById('quantifierList');

    // Vérifier si l'élément n'existe pas
    if (!quantifierList) {
        // Si l'élément n'existe pas, sortir de la fonction
        return; 
    }

    quantifierList.innerHTML = ''; // Effacer la liste avant de la remplir

    // Define quantifier categories
    const categories = {
        "Universal Positive": universalPositive,
        "Universal Negative": universalNegative,
        "Existential Positive": existentialPositive,
        "Existential Negative": existentialNegative,
    };

    // Iterate over each category
    for (const [category, quantifiers] of Object.entries(categories)) {
        // Create a heading for each category
        const categoryHeader = document.createElement('h4');
        categoryHeader.textContent = category; // Set the heading text
        quantifierList.appendChild(categoryHeader); // Append the heading to the list

        // Create a list for quantifiers under the current category
        const quantifierListElement = document.createElement('ul'); // Create a new unordered list

        quantifiers.forEach(quantifier => {
            const listItem = document.createElement('li');
            listItem.textContent = quantifier;
            listItem.addEventListener('click', () => selectQuantifier(quantifier));
            quantifierListElement.appendChild(listItem); // Append the list item to the quantifier list
        });

        quantifierList.appendChild(quantifierListElement); // Append the quantifier list to the main list
    }
}

/**
 * Sélectionne un quantificateur à modifier.
 * 
 * - Lorsque l'utilisateur clique sur un quantificateur dans la liste, celui-ci est chargé dans un champ de saisie.
 * 
 * @param {string} quantifier - Le texte du quantificateur sélectionné.
 */
export function selectQuantifier(quantifier: string): void {
    const updateInput = document.getElementById('updateQuantifierInput') as HTMLInputElement;
    updateInput.value = quantifier; // Mettre le texte du quantificateur dans le champ de mise à jour
}


/**
 * Gère l'affichage des champs de sujet et de prédicat en fonction des choix.
 * 
 * - Affiche ou masque les options "Autre", champ de texte, ou groupe de radio pour le sujet et le prédicat.
 * - Appelé lorsque l'utilisateur sélectionne un choix pour le sujet.
 * 
 * @listens change - Ajouté aux radios correspondant aux choix du sujet.
 */


document.addEventListener("DOMContentLoaded", () => {
    // Références
    const subjectRadios = document.getElementsByName("subject2") as NodeListOf<HTMLInputElement>;
    const otherText = document.getElementById("other_text_premise2") as HTMLInputElement | null;
    const predicatText = document.getElementById("text_predicat") as HTMLInputElement | null;
    const predicateRadioGroup = document.getElementById("predicate-radio-group") as HTMLDivElement | null;

    subjectRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "other") {
                // Si "Autre" est sélectionné
                if (otherText) otherText.style.display = "block"; // Afficher le champ "Autre"
                if (predicatText) predicatText.style.display = "none"; // Masquer le champ texte
                if (predicateRadioGroup) predicateRadioGroup.style.display = "block"; // Afficher les radios
            } else {
                // Si "Sujet P1" ou "Prédicat P1" est sélectionné
                if (otherText) otherText.style.display = "none"; // Masquer le champ "Autre"
                if (predicatText) predicatText.style.display = "block"; // Afficher le champ texte
                if (predicateRadioGroup) predicateRadioGroup.style.display = "none"; // Masquer les radios
            }
        });
    });
});


/**
 * Met à jour les options de conclusion en fonction du sujet et du prédicat sélectionnés.
 * 
 * - Simule des données pour le sujet et le prédicat de la dernière prémisse.
 * - Gère les interactions utilisateur pour définir le sujet et le prédicat de la conclusion.
 * - Affiche des options pour les termes isolés si nécessaires.
 * 
 * @listens change - Ajouté aux radios pour les choix de sujet et de prédicat dans la conclusion.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Simuler les données pour le sujet et le prédicat de la dernière prémisse
    const lastPremiseSubject = "Sujet P2";
    const lastPremisePredicate = "Prédicat P2";

    // Récupérer les radios pour le sujet
    const subjectRadios = document.querySelectorAll('input[name="conclusionSubject"]') as NodeListOf<HTMLInputElement>;
    const predicateChoiceContainer = document.getElementById('predicate-choice-container') as HTMLElement;
    const conclusionPredicateElement = document.getElementById('conclusion_predicate') as HTMLInputElement;

    // Récupérer les radios pour le choix du prédicat
    const predicateRadios = document.querySelectorAll('input[name="conclusionPredicate"]') as NodeListOf<HTMLInputElement>;

    // Fonction pour mettre à jour la conclusion
     function updateConclusion() {
        // Récupérer le sujet sélectionné
        const selectedSubjectRadio = document.querySelector('input[name="conclusionSubject"]:checked') as HTMLInputElement;

        if (!selectedSubjectRadio) {
            console.error("Aucun choix de sujet sélectionné.");
            return;
        }

        const selectedSubject = selectedSubjectRadio.value;

        if (selectedSubject === "isolated") {
            // Afficher les options pour choisir le prédicat
            predicateChoiceContainer.style.display = "block";

            // Mise à jour du prédicat selon la sélection des radios
            predicateRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    const selectedPredicateRadio = document.querySelector('input[name="conclusionPredicate"]:checked') as HTMLInputElement;

                    if (selectedPredicateRadio?.value === "lastSubject") {
                        conclusionPredicateElement.value = lastPremiseSubject;
                       // console.log(`Sujet: Terme isolé, Prédicat: ${lastPremiseSubject}`);
                    } else if (selectedPredicateRadio?.value === "lastPredicate") {
                        conclusionPredicateElement.value = lastPremisePredicate;
                       // console.log(`Sujet: Terme isolé, Prédicat: ${lastPremisePredicate}`);
                    }
                });
            });
        } else {
            // Cacher les options du prédicat et mettre à jour directement
            predicateChoiceContainer.style.display = "none";

            if (selectedSubject === "lastSubject") {
                // Sujet = Sujet de la dernière prémisse, Prédicat = Terme isolé
                conclusionPredicateElement.value = "Terme isolé";
               // console.log(`Sujet: ${lastPremiseSubject}, Prédicat: Terme isolé`);
            } else if (selectedSubject === "lastPredicate") {
                // Sujet = Prédicat de la dernière prémisse, Prédicat = Terme isolé
                conclusionPredicateElement.value = "Terme isolé";
                //console.log(`Sujet: ${lastPremisePredicate}, Prédicat: Terme isolé`);
            }
        }
    }

    // Attacher les événements aux radios de sujet
    subjectRadios.forEach(radio => {
        radio.addEventListener('change', updateConclusion);
    });
});




/**
 * Génère un tableau vide de propositions basé  dans l'interface utilisateur.
 *
 * - Parcourt les éléments HTML avec la classe `.card` pour déterminer le nombre de propositions.
 * - Initialise chaque proposition avec un sujet, un prédicat et un type par défaut.
 * 
 * @returns {PropositionParameter[]} Tableau contenant les propositions initialisées.
 */
export function createPropositionsArray(): PropositionParameter[] {
    //console.log("Début de la génération du tableau des propositions...");

    // Récupérer toutes les positions avec la classe "card"
    const positions = Array.from(document.querySelectorAll('.card'));

    // Afficher le nombre de positions trouvées
    console.log(`Nombre de positions trouvées : ${positions.length}`);

    // Taille de l'array à créer
    const numberOfPropositions = positions.length ;

    // Générer un tableau de propositions
    const propositions: PropositionParameter[] = Array.from({ length: numberOfPropositions }, () => ({
        subject: "",
        predicate: "",
        type: Type.A // Type par défaut, modifiable selon vos besoins
    }));

    console.log(`Tableau généré avec ${numberOfPropositions} propositions :`, propositions);
    return propositions;
}

/**
 * Analyse les propositions affichées dans l'interface utilisateur, calcule la conclusion et vérifie la validité du syllogisme.
 *
 * - Parcourt les éléments HTML avec la classe `.card` pour extraire les sujets, prédicats et types de chaque proposition.
 * - Gère les relations entre propositions successives, notamment les références aux sujets/prédicats précédents.
 * - Calcule une conclusion basée sur les choix de l'utilisateur et ajoute cette conclusion au tableau des propositions.
 * - Vérifie la validité du syllogisme avec une instance de `Polysyllogism` et `ValidityChecker`.
 * - Affiche les résultats et la validité dans le div HTML ayant l'ID `Result`.
 * 
 * @returns {void}
 */
export function logPropositionsDetails() {
    let tabres: PropositionParameter[] = createPropositionsArray();

    // Récupérer toutes les propositions avec la classe "card"
    let propositions = Array.from(document.querySelectorAll('.card'));

    if (propositions.length === 0) {
        console.log('Aucune proposition trouvée.');
        return;
    }

    console.log(`Nombre total de propositions : ${propositions.length}`);

    // Parcourir chaque proposition
    propositions.forEach((proposition, index) => {
        let subject = "Non défini";
        let predicate = "Non défini";

        // Récupérer le quantificateur
        const quantifier = (proposition.querySelector('input[name^="quantity"]:checked') as HTMLInputElement)?.id || "Non défini";

        // Récupérer la qualité
        const quality = (proposition.querySelector('input[name^="quantifierQuality"]:checked') as HTMLInputElement)?.id || "Non défini";

        // Déterminer le type temporaire avec getQuantifierType
        const typetmp = getQuantifierType(quantifier, quality);

        // Convertir le type temporaire en Type
        let typeValue: Type;
        switch (typetmp) {
            case "A":
                typeValue = Type.A;
                break;
            case "E":
                typeValue = Type.E;
                break;
            case "I":
                typeValue = Type.I;
                break;
            case "O":
                typeValue = Type.O;
                break;
            default:
                console.warn(`Type inconnu détecté pour la proposition ${index + 1}: ${typetmp}`);
                typeValue = Type.A; // Valeur par défaut
                break;
        }

        // Gestion des sujets et prédicats pour chaque proposition
        if (index === 0) {
            // Première proposition
            subject = (proposition.querySelector('#subject1') as HTMLInputElement)?.value || "Non défini";
            predicate = (proposition.querySelector('#predicate_premise1_page_mode2') as HTMLInputElement)?.value || "Non défini";
        } else if (index === 1) {
            // Deuxième proposition
            const subjectRadio = proposition.querySelector('input[name="subject2"]:checked') as HTMLInputElement;
            if (subjectRadio) {
                if (subjectRadio.value === "subject") {
                    subject = tabres[index - 1]?.subject || "Référence invalide (pas de sujet précédent)";
                } else if (subjectRadio.value === "predicat") {
                    subject = tabres[index - 1]?.predicate || "Référence invalide (pas de prédicat précédent)";
                } else if (subjectRadio.value === "other") {
                    subject = (proposition.querySelector('#other_text_premise2') as HTMLInputElement)?.value || "Non défini (autre)";
                }
            }

            const predicateText = proposition.querySelector('#text_predicat') as HTMLInputElement;
            if (predicateText && predicateText.style.display !== "none") {
                predicate = predicateText.value || "Non défini";
            } else {
                const predicateRadio = proposition.querySelector('input[name="predicateOption"]:checked') as HTMLInputElement;
                if (predicateRadio) {
                    if (predicateRadio.value === "subjectP1") {
                        predicate = tabres[index - 1]?.subject || "Référence invalide (pas de sujet précédent)";
                    } else if (predicateRadio.value === "predicatP1") {
                        predicate = tabres[index - 1]?.predicate || "Référence invalide (pas de prédicat précédent)";
                    }
                }
            }
        } else {
            // Propositions suivantes
            const subjectRadio = proposition.querySelector(`input[id^="subject"]:checked`) as HTMLInputElement;
            if (subjectRadio) {
                if (subjectRadio.value === "previousSubject") {
                    subject = tabres[index - 1]?.subject || "Référence invalide (pas de sujet précédent)";
                } else if (subjectRadio.value === "previousPredicate") {
                    subject = tabres[index - 1]?.predicate || "Référence invalide (pas de prédicat précédent)";
                } else if (subjectRadio.value === "other") {
                    subject = (proposition.querySelector(`input[id^="custom_subject"]`) as HTMLInputElement)?.value || "Non défini (autre)";
                }
            }

            const predicateRadio = proposition.querySelector(`input[id^="predicate"]:checked`) as HTMLInputElement;
            if (predicateRadio) {
                if (predicateRadio.value === "previousSubject") {
                    predicate = tabres[index - 1]?.subject || "Référence invalide (pas de sujet précédent)";
                } else if (predicateRadio.value === "previousPredicate") {
                    predicate = tabres[index - 1]?.predicate || "Référence invalide (pas de prédicat précédent)";
                }
            } else {
                predicate = (proposition.querySelector(`input[id^="custom_predicate"]`) as HTMLInputElement)?.value || "Non défini (texte)";
            }
        }

        // Mettre à jour le tableau tabres
        if (tabres[index]) {
            tabres[index].type = typeValue;
            tabres[index].subject = subject;
            tabres[index].predicate = predicate;
           // console.log(`Mise à jour pour la proposition ${index + 1}:`, tabres[index]);
        }
    });

    // Calcul de la conclusion
    const conclusionSubjectRadio = document.querySelector('input[name="conclusionSubject"]:checked') as HTMLInputElement;
    const conclusionPredicateRadio = document.querySelector('input[name="conclusionPredicate"]:checked') as HTMLInputElement;

    let conclusionSubject = "Non défini";
    let conclusionPredicate = "Non défini";
    let conclusionType: Type;

    // Récupérer le quantificateur et la qualité pour la conclusion
    const conclusionQuantifier = (document.querySelector('input[name="quantity99"]:checked') as HTMLInputElement)?.value || "Non défini";
    const conclusionQuality = (document.querySelector('input[name="quantifierQuality99"]:checked') as HTMLInputElement)?.value || "Non défini";

    //console.log("t1" + conclusionQuantifier);
    //console.log("t1" + conclusionQuality);

    // Déterminer le type temporaire avec getQuantifierType
    const conclusionTypeTmp = getQuantifierType(conclusionQuantifier, conclusionQuality);

    //console.log("console log test " + conclusionTypeTmp);
    // Convertir le type temporaire en Type
    switch (conclusionTypeTmp) {
        case "A":
            conclusionType = Type.A;
            break;
        case "E":
            conclusionType = Type.E;
            break;
        case "I":
            conclusionType = Type.I;
            break;
        case "O":
            conclusionType = Type.O;
            break;
        default:
            console.warn(`Type inconnu détecté pour la conclusion: ${conclusionTypeTmp}`);
            conclusionType = Type.A; // Valeur par défaut
            break;
    }

    // Gestion du sujet de la conclusion
    if (conclusionSubjectRadio?.value === "isolated") {
        if (tabres.length > 1) {
            conclusionSubject = calculateIsolatedTerm(tabres[tabres.length - 1], tabres[tabres.length - 2]);
        } else {
            console.warn("Pas assez de propositions pour calculer le terme isolé.");
        }
    } else if (conclusionSubjectRadio?.value === "lastSubject") {
        conclusionSubject = tabres[tabres.length - 1]?.subject || "Référence invalide (pas de sujet précédent)";
    } else if (conclusionSubjectRadio?.value === "lastPredicate") {
        conclusionSubject = tabres[tabres.length - 1]?.predicate || "Référence invalide (pas de prédicat précédent)";
    }

    // Gestion du prédicat de la conclusion
    if (conclusionPredicateRadio?.value === "lastSubject") {
        if (tabres.length > 1) {
            conclusionPredicate = calculateIsolatedTerm(tabres[0], tabres[1]);
        } else {
            console.warn("Pas assez de propositions pour calculer le terme isolé.");
        }
    } else if (conclusionPredicateRadio?.value === "lastPredicate") {
        if (tabres.length > 1) {
            conclusionPredicate = calculateIsolatedTerm(tabres[tabres.length - 1], tabres[tabres.length - 2]);
        } else {
            console.warn("Pas assez de propositions pour calculer le terme isolé.");
        }
    }

    // Ajouter la conclusion à tabres
    tabres.push({
        type: conclusionType,
        subject: conclusionSubject,
        predicate: conclusionPredicate,
    });

    // Afficher le tableau tabres mis à jour
    console.log("Tableau final des propositions :", tabres);

  
    

// Sélectionner le div où afficher les résultats
const resultDiv = document.getElementById("Result");

if (resultDiv) {
    // Construire une chaîne HTML à partir de tabres
    let resultHTML = "</strong>Résultats des Propositions</strong>:<br/>";

    tabres.forEach((proposition, index) => {
        resultHTML += `
           
                <strong>Proposition ${index + 1}</strong>:<br/>
                <strong>Sujet:</strong> ${proposition.subject || "Non défini"}<br/>
                <strong>Prédicat:</strong> ${proposition.predicate || "Non défini"}<br/>
           
        `;
    });

    

    // Créer un Polysyllogism
    const poly: Polysyllogism = new Polysyllogism(tabres.length - 1, tabres);
    const checker: ValidityChecker = new ValidityChecker(checkRules());

    // Afficher le polysyllogisme dans la console
    console.log(poly.toString());

    // Vérifier la validité et ajouter au résultat
    const validityResult = checker.checkValidity(poly);
    console.log(validityResult);

    // Ajouter le résultat de la validité au contenu HTML
    resultHTML += `<h4>Votre syllogisme est ${validityResult}</h4>`;

    // Mettre à jour le contenu du div
    resultDiv.innerHTML = resultHTML;
} else {
    console.error("Le div #Result est introuvable.");
}



}

/**
 * Identifie un terme isolé entre deux propositions.
 *
 * - Compare les sujets et prédicats des deux propositions pour identifier un terme non partagé.
 * 
 * @param {PropositionParameter} proposition1 - La première proposition.
 * @param {PropositionParameter} proposition2 - La deuxième proposition.
 * @returns {string} Le terme isolé, ou "Non défini" si aucun terme n'est trouvé.
 */
// Fonction pour calculer le terme isolé
export function calculateIsolatedTerm(proposition1: PropositionParameter, proposition2: PropositionParameter): string {
    const terms = [proposition1.subject, proposition1.predicate];
    return terms.find(term => term !== proposition2.subject && term !== proposition2.predicate) || "Non défini (terme isolé introuvable)";
}


/**
 * Ajoute un écouteur d'événement pour valider et analyser les propositions lorsque le bouton de validation est cliqué.
 *
 * - Récupère le bouton ayant l'ID `btn_valid_page_mode2`.
 * - Ajoute un gestionnaire `click` pour appeler la fonction `logPropositionsDetails` sans recharger la page.
 * 
 * @listens DOMContentLoaded - Appelé une fois que le DOM est chargé.
 */
document.addEventListener('DOMContentLoaded', () => {
    const validateButton = document.getElementById('btn_valid_page_mode2');
    if (validateButton) {
        validateButton.addEventListener('click', (event) => {
            event.preventDefault(); // Empêche le rechargement de la page
            logPropositionsDetails(); // Appelle la fonction log
        });
    }
});