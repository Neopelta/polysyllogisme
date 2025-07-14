import { Type } from './enums.js';
import { Polysyllogism, PropositionParameter } from './syllogisms.js';
import { ValidityChecker } from './rules.js';

const radios = document.querySelectorAll('input[name="mediumterm"]');

radios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        const selectedId = (event.target as HTMLInputElement).id;
        const text = <HTMLInputElement> document.getElementById("other_text_medium_term_page_mode1");

        if (selectedId == "other_radio_medium_term_page_mode1"){
            text.disabled = false;
        } else {
            text.disabled = true;
        }
    });
});

let formData: FormData;
let data: Record<string, any> = {};

const form = document.getElementById("formulaire_mode1") as HTMLFormElement;

if (form) {
    form.addEventListener("submit", (event: Event) => {
        event.preventDefault();

        formData = new FormData(form);

        data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const checkboxIds = ["rmt", "rnn", "raa", "rp", "rlh", "rn", "rpp", "ruu"];
        checkboxIds.forEach(id => {
            const checkbox = document.getElementById(id) as HTMLInputElement;
            data[id] = checkbox.checked ? "true" : "false";
        });

        console.log("Données du formulaire sous forme JSON :", JSON.stringify(data, null, 2));
        show2();
    });
}

/**
 * Obtient les détails de la conclusion.
 * @returns Un objet contenant le quantificateur, la qualité, le sujet et le prédicat de la conclusion.
 */
export function getConclusionDetails(): { quantifier: string; quality: string; subject: string; predicate: string } {
    const quantifier = (document.querySelector('input[name="quantifier_3"]:checked') as HTMLInputElement).value;
    const quality = (document.querySelector('input[name="quantifier_bool_3"]:checked') as HTMLInputElement).value;
    const subject = (document.getElementById('conclusion-subject') as HTMLInputElement).value || "";
    const predicate = (document.getElementById('conclusion-predicate') as HTMLInputElement).value || "";

    return {
        quantifier,
        quality,
        subject,
        predicate,
    };
}

/**
 * Obtient la figure sélectionnée.
 * @returns Une chaîne représentant le numéro de la figure sélectionnée ou null si aucune figure n'est sélectionnée.
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
 * Vérifie l'existence d'une hypothèse d'existence.
 * @returns Un booléen indiquant si l'hypothèse d'existence est cochée.
 */
export function getHypothesisOfExistence(): boolean {
    const existenceCheckbox = document.getElementById('existence') as HTMLInputElement;
    return existenceCheckbox ? existenceCheckbox.checked : false;
}

/**
 * Récupère les règles sélectionnées sous forme de texte.
 * @returns Un tableau de chaînes représentant les règles sélectionnées.
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
 * Affiche les résultats dans la section des résultats.
 * @param resultHtml Le contenu HTML à afficher dans la section des résultats.
 */
export function displayResults(resultHtml: string): void {
    const resultDiv = document.querySelector('.Result') as HTMLElement;
    resultDiv.innerHTML = `
        <h3>********** Result ***********</h3>
        ${resultHtml}
    `;
}

/**
 * Récupère la qualité sélectionnée pour une prémisse donnée.
 * @param premiseNumber Le numéro de la prémisse (1, 2, etc.).
 * @returns L'ID de la qualité sélectionnée ou une chaîne vide si aucune n'est sélectionnée.
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
 * Détermine le type de quantificateur en fonction du quantificateur et de la qualité donnés.
 * @param quantifier Le quantificateur (universel, existentiel, etc.).
 * @param quality La qualité (positive ou négative).
 * @returns Une chaîne représentant le type de quantificateur (A, E, I, O) ou une chaîne vide si aucune correspondance.
 */
export function getQuantifierType(quantifier: string | undefined, quality: string | undefined): string {
    const combined = `${quantifier}-${quality}`.toLowerCase();

    switch (combined) {
        case "universal-positive":
            return "A"; // Universel Affirmatif
        case "universal-negative":
            return "E"; // Universel Négatif
        case "existentiel-positive":
            return "I"; // Existentiel Affirmatif
        case "existentiel-negative":
            return "O"; // Existentiel Négatif
        default:
            return ""; // Retourne une chaîne vide si aucune correspondance
    }
}

/**
 * Crée un tableau de taille donnée avec exactement une valeur `true`.
 * @param size La taille du tableau à créer.
 * @returns Un tableau booléen avec une seule valeur `true`.
 */
export function createArrayWithOneTrue(size: number): boolean[] {
    // Initialize an array filled with false
    const array: boolean[] = new Array(size).fill(false);

    // Randomly select an index to set to true
    const trueIndex = Math.floor(Math.random() * size);
    array[trueIndex] = true;

    return array;
}


const arrayOfTrue: boolean[] = createArrayWithOneTrue(8);

/**
 * Vérifie les règles et retourne leur état sous forme de tableau booléen.
 * @returns Un tableau de booléens indiquant l'état de chaque règle.
 */
export function checkRules() : boolean[] {
    const rules: boolean[] = [
        
        JSON.parse(data["rmt"]),
        JSON.parse(data["rnn"]),
        JSON.parse(data["raa"]),
        JSON.parse(data["rp"]),
        JSON.parse(data["rlh"]),
        JSON.parse(data["rn"]),
        JSON.parse(data["rpp"]),
        JSON.parse(data["ruu"]),
    ];

  
    console.log("Règles sélectionnées :");
    console.log("Rmt : " + rules[0]);
    console.log("Rnn : " + rules[1]);
    console.log("Raa : " + rules[2]);
    console.log("Rp : " + rules[3]);
    console.log("Rlh : " + rules[4]);
    console.log("Rn : " + rules[5]);
    console.log("Rpp : " + rules[6]);
    console.log("Ruu : " + rules[7]);

    return rules; 
}

/**
 * Affiche les résultats et vérifie la validité des propositions.
 */
export function show2() {
    const propositions: PropositionParameter[] = [
        { subject: "", predicate: "", type: Type.A }, // Proposition 1
        { subject: "", predicate: "", type: Type.A }, // Proposition 2
        { subject: "", predicate: "", type: Type.A }  // Proposition 3, si nécessaire
    ];

    const numPremises = 2; // Nombre de prémisses dans le HTML
    const results: string[] = [];
    const conclusionDetails = getConclusionDetails();
    let typetmp = getQuantifierType(conclusionDetails.quantifier, conclusionDetails.quality);

    let typec: Type;
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
            typec = Type.A; // Valeur par défaut si aucun type n'est sélectionné
            break;
    }

    // Récupérer la figure sélectionnée avant la boucle
    const selectedFigure = getSelectedFigure();

    for (let i = 1; i <= numPremises; i++) {
        const selectedQuantifier = data[`quantifier_${i}`];
        const selectedQuality = data[`quantifier_bool_${i}`];
        const selectedVerb = data[`quantifier_select_${i}`];
        const selectedStativeVerb = data[`stative_verb_select_premise${i}`];
        const selectedSubject = data[`subject_textfield_conclusion`];
        const selectedPredicate = data[`predicat_textfield_conclusion`];
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
        const term = data["medium_term_mode1_struct_syllo"];

        // Ajout d'un switch case pour gérer la logique en fonction de la figure sélectionnée
        let figureMessage = "";
        console.log("Entree switch\n");
        switch (selectedFigure) {
            case "1":
                if (i == 1) {
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedPredicate;
                    propositions[i - 1].type = typeValue;
                    console.log("premise 1 " + " " + typeValue.getString());
                }
                if (i == 2) {
                    propositions[i - 1].subject = selectedSubject;
                    propositions[i - 1].predicate = term;
                    propositions[i - 1].type = typeValue;
                    console.log("premise 2 " + " " + typeValue.getString());

                    propositions[i].subject = selectedSubject;
                    propositions[i].predicate = selectedPredicate;
                    propositions[i].type = typec;
                    console.log("c " + " " + typec.getString());
                }
                break;
            case "2":
                if (i == 1) {
                    propositions[i - 1].subject = selectedPredicate;
                    propositions[i - 1].predicate = term;
                    propositions[i - 1].type = typeValue;
                    console.log(typeValue);
                }
                if (i == 2) {
                    propositions[i - 1].subject = selectedSubject;
                    propositions[i - 1].predicate = term;
                    propositions[i - 1].type = typeValue;
                    console.log(typeValue);

                    propositions[i].subject = selectedSubject;
                    propositions[i].predicate = selectedPredicate;
                    propositions[i].type = typec;
                    console.log(typec);
                }
                break;
            case "3":
                if (i == 1) {
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedPredicate;
                    propositions[i - 1].type = typeValue;
                    console.log(typeValue);
                }
                if (i == 2) {
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedSubject;
                    propositions[i - 1].type = typeValue;
                    console.log(typeValue);

                    propositions[i].subject = selectedSubject;
                    propositions[i].predicate = selectedPredicate;
                    propositions[i].type = typec;
                    console.log(typec);
                }
                break;
            case "4":
                if (i == 1) {
                    propositions[i - 1].subject = selectedPredicate;
                    propositions[i - 1].predicate = term;
                    propositions[i - 1].type = typeValue;
                    console.log(typeValue);
                }
                if (i == 2) {
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedSubject;
                    propositions[i - 1].type = typeValue;
                    console.log(typeValue);

                    propositions[i].subject = selectedSubject;
                    propositions[i].predicate = selectedPredicate;
                    propositions[i].type = typec;
                    console.log(typec);
                }
                break;
            default:
                figureMessage = "Aucune figure sélectionnée.";
                break;
        }
        console.log("Sortie switch\n");
        let premiseSentence: string | null = null;

        switch (selectedFigure) {
            case "1":
                if (i == 1) {
                    premiseSentence =  `Prémisse ${i}: ${selectedVerb} <strong>${term}</strong> ${selectedStativeVerb} <strong>${selectedPredicate}</strong>.`;
                }
                if (i == 2) {
                    premiseSentence =  `Prémisse ${i}: ${selectedVerb} <strong>${selectedSubject}</strong> ${selectedStativeVerb} <strong>${term}</strong>.`;
                }
                break;
            case "2":
                if (i == 1) {
                    premiseSentence =  `Prémisse ${i}: ${selectedVerb} <strong>${selectedPredicate}</strong> ${selectedStativeVerb} <strong>${term}</strong>.`;
                }
                if (i == 2) {
                    premiseSentence =  `Prémisse ${i}: ${selectedVerb} <strong>${selectedSubject}</strong> ${selectedStativeVerb} <strong>${term}</strong>.`;
                }
                break;
            case "3":
                if (i == 1) {
                    premiseSentence =  `Prémisse ${i}: ${selectedVerb} <strong>${term}</strong> ${selectedStativeVerb} <strong>${selectedPredicate}</strong>.`;
                }
                if (i == 2) {
                    premiseSentence =  `Prémisse ${i}: ${selectedVerb} <strong>${term}</strong> ${selectedStativeVerb} <strong>${selectedSubject}</strong>.`;
                }
                break;
            case "4":
                if (i == 1) {
                    premiseSentence =  `Prémisse ${i}: ${selectedVerb} <strong>${selectedPredicate}</strong> ${selectedStativeVerb} <strong>${term}</strong>.`;
                }
                if (i == 2) {
                    premiseSentence =  `Prémisse ${i}: ${selectedVerb} <strong>${term}</strong> ${selectedStativeVerb} <strong>${selectedSubject}</strong>.`;
                }
                break;
            default:
                throw new Error("Figure sélectionnée invalide !");
        }
            results.push(`<p>${premiseSentence}</p>`);
    }

    const conclusionSentence = `Conclusion: ${conclusionDetails.quantifier === "Universal" ? "Tous" : "Certains"} ${conclusionDetails.subject} ${conclusionDetails.quality === "Positive" ? "sont" : "ne sont pas"} ${conclusionDetails.predicate}.`;
    results.push(`<p>${conclusionSentence}</p>`);

    const selectedRules = getSelectedRules();
    if (selectedRules.length > 0) {
        results.push(`<h4>Règles sélectionnées:</h4><p>${selectedRules.join(', ')}</p>`);
    } else {
        results.push("<h4>Aucune règle sélectionnée</h4>");
    }

    let poly: Polysyllogism = new Polysyllogism(2, propositions);
    let checker: ValidityChecker = new ValidityChecker(checkRules());

    console.log("checkrules tab");
    console.log(checkRules());

    const validityResult = checker.checkValidity(poly);

    console.log("le resultat est : " );
    console.log(validityResult);


    let failureDetails = null;
    if (!validityResult) {
        failureDetails = checker.getFailedRule(poly);
    }
    if (validityResult) {
        results.push(`<h3>Votre syllogisme est <strong>valide</strong>.</h3>`);
    } else {
        results.push(`<h3>Votre syllogisme est <strong>invalide</strong>.</h3>`);
        if (failureDetails) {
            results.push(`<p>Raison : La règle suivante a échoué - ${failureDetails.rule}</p>`);
            results.push(`<p>Indication : ${failureDetails.explanation}</p>`);
        } else {
            results.push(`<p>Raison inconnue.</p>`);
        }
    }

displayResults(results.join(''));
}