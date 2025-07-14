import { Type } from "./enums.js";
import { Polysyllogism, PropositionParameter } from './syllogisms.js';
import { Rules, ValidityChecker } from "./rules.js";


/**
 * Génère un tableau booléen avec une seule valeur "true" à l'index spécifié.
 * @param {number} index - Index où placer la valeur "true".
 * @returns {boolean[]} - Tableau booléen avec une seule valeur "true".
 */
export function generateBooleanArray(index: number): boolean[] {
    const result: boolean[] = new Array(8).fill(false);

    if (index >= 0 && index < 8) {
        result[index] = true;
    } else {
        throw new Error("Index out of range. Must be between 0 and 7.");
    }

    return result;
}



/**
 * Crée une liste de paramètres de propositions basée sur les prémisses, la conclusion, et la figure.
 * @param {string} P1 - Première prémisse (quantificateur).
 * @param {string} P2 - Deuxième prémisse (quantificateur).
 * @param {string} C - Conclusion (quantificateur).
 * @param {number} Figure - Figure du syllogisme (1, 2, 3, ou 4).
 * @returns {PropositionParameter[]} - Tableau des paramètres des propositions.
 */
export function create(P1: string, P2: string, C: string, Figure: number): PropositionParameter[] {
    const propositions: PropositionParameter[] = [
        { subject: "", predicate: "", type: Type.A },
        { subject: "", predicate: "", type: Type.A },
        { subject: "", predicate: "", type: Type.A }
    ];

    let selectedSubject = 'S';
    let selectedPredicate = 'P';
    let term = 'M';

    // Conclusion
    switch (C) {
        case "A":
            propositions[2].type = Type.A;
            break;
        case "E":
            propositions[2].type = Type.E;
            break;
        case "I":
            propositions[2].type = Type.I;
            break;
        case "O":
            propositions[2].type = Type.O;
            break;
        default:
            propositions[2].type = Type.A;
            break;
    }

    // Première prémisse
    switch (P1) {
        case "A":
            propositions[0].type = Type.A;
            break;
        case "E":
            propositions[0].type = Type.E;
            break;
        case "I":
            propositions[0].type = Type.I;
            break;
        case "O":
            propositions[0].type = Type.O;
            break;
        default:
            propositions[0].type = Type.A;
            break;
    }

    // Deuxième prémisse
    switch (P2) {
        case "A":
            propositions[1].type = Type.A;
            break;
        case "E":
            propositions[1].type = Type.E;
            break;
        case "I":
            propositions[1].type = Type.I;
            break;
        case "O":
            propositions[1].type = Type.O;
            break;
        default:
            propositions[1].type = Type.A;
            break;
    }

    // Boucle pour assigner les sujets et prédicats
    for (let i = 1; i < 3; i++) {
        switch (Figure.toString()) {
            case "1":
                if (i == 1) {
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedPredicate;
                }
                if (i == 2) {
                    propositions[i - 1].subject = selectedSubject;
                    propositions[i - 1].predicate = term;
                    propositions[i].subject = selectedSubject;
                    propositions[i].predicate = selectedPredicate;
                }
                break;
            case "2":
                if (i == 1) {
                    propositions[i - 1].subject = selectedPredicate;
                    propositions[i - 1].predicate = term;
                }
                if (i == 2) {
                    propositions[i - 1].subject = selectedSubject;
                    propositions[i - 1].predicate = term;
                    propositions[i].subject = selectedSubject;
                    propositions[i].predicate = selectedPredicate;
                }
                break;
            case "3":
                if (i == 1) {
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedPredicate;
                }
                if (i == 2) {
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedSubject;
                    propositions[i].subject = selectedSubject;
                    propositions[i].predicate = selectedPredicate;
                }
                break;
            case "4":
                if (i == 1) {
                    propositions[i - 1].subject = selectedPredicate;
                    propositions[i - 1].predicate = term;
                }
                if (i == 2) {
                    propositions[i - 1].subject = term;
                    propositions[i - 1].predicate = selectedSubject;
                    propositions[i].subject = selectedSubject;
                    propositions[i].predicate = selectedPredicate;
                }
                break;
            default:
                console.log("Aucune figure sélectionnée.");
                break;
        }
    }

    // Retourner le tableau de propositions
    return propositions;
}

type CombinationResult = {
    P1: string;
    P2: string;
    C: string;
    Figure: number;
    [key: `Rule_${number}`]: boolean;
};

/**
 * Génère les 256 combinaisons possibles de syllogismes et vérifie les règles.
 * @returns {CombinationResult[]} - Tableau contenant toutes les combinaisons et résultats des règles.
 */
export function generateCombinations(): CombinationResult[] {
    const quantifiers = ['A', 'E', 'I', 'O'];
    const figures = [1, 2, 3, 4];
    const combinations: CombinationResult[] = [];

    // Générer toutes les combinaisons possibles
    for (const P1 of quantifiers) {
        for (const P2 of quantifiers) {
            for (const C of quantifiers) {
                for (const Figure of figures) {
                    const propositions = create(P1, P2, C, Figure);
                    const poly = new Polysyllogism(2, propositions);
                   

                    // Déclarez les résultats pour les règles
                    const results: { [key: `Rule_${number}`]: boolean } = {};
                    const result: boolean[] = checkRules();

                    for (let i = 0; i < 8; i++) {
                        const checker = new ValidityChecker(generateBooleanArray(i));
                        results[`Rule_${i}`] = checker.checkValidity(poly);
                        if(i == 7){
                            const checker = new ValidityChecker(result);
                           
                            results[`Rule_${8}`] = checker.checkUninteresting(poly);
                            results[`Rule_${9}`] = checker.checkValidity(poly);

                           
                            
                        }
                    }
                    
                    

                    combinations.push({
                        P1,
                        P2,
                        C,
                        Figure,
                        ...results,
                    });
                }
            }
        }
    }

    return combinations;
}

/**
 * Affiche toutes les combinaisons sous forme de tableau HTML.
 */
export function displayCombinationsTable() {
    const combinations = generateCombinations();
    const table = document.getElementById('combination-table');

    if (table) {
        combinations.forEach((combo) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${combo.P1}</td>
                <td>${combo.P2}</td>
                <td>${combo.C}</td>
                <td>${combo.Figure}</td>
                ${Array.from({ length: 10 }, (_, i) => `<td>${combo[`Rule_${i}`]}</td>`).join('')}
            `;
            table.appendChild(row);
        });
    }
}

/**
 * Vérifie les règles logiques sélectionnées dans l'interface utilisateur.
 * @returns {boolean[]} - Tableau des règles activées.
 */

export function checkRules(): boolean[] {
    return [
        (document.getElementById('rmt') as HTMLInputElement).checked,
        (document.getElementById('rnn') as HTMLInputElement).checked,
        (document.getElementById('raa') as HTMLInputElement).checked,
        (document.getElementById('rp') as HTMLInputElement).checked,
        (document.getElementById('rlh') as HTMLInputElement).checked,
        (document.getElementById('rn') as HTMLInputElement).checked,
        (document.getElementById('rpp') as HTMLInputElement).checked,
        (document.getElementById('ruu') as HTMLInputElement).checked,
        (document.getElementById('ininter') as HTMLInputElement).checked,
        
    ];
}

/**
 * Met à jour le tableau des combinaisons en fonction des règles sélectionnées.
 */
export function updateCombinationsTable() {
    const rulesSelected = checkRules(); // Capture the selected rules as a boolean array
    console.log(rulesSelected);
    const combinations = generateCombinations(); // Generate all possible combinations
    const tableBody = document.getElementById('combination-table');

    if (tableBody) {
        // Clear the existing table rows
        tableBody.innerHTML = '';

        // Add new rows based on the combinations
        combinations.forEach((combo) => {
            const row = document.createElement('tr');
            
            // Create cells for P1, P2, C, and Figure
            row.innerHTML = `
                <td>${combo.P1}</td>
                <td>${combo.P2}</td>
                <td>${combo.C}</td>
                <td>${combo.Figure}</td>
            `;

            // Append cells for each rule, reflecting the user's selections
            for (let i = 0; i < 9; i++) {
                const ruleResult = rulesSelected[i] ? combo[`Rule_${i}`] : 'X';
                const cell = document.createElement('td');

                // Style and content based on the rule result
                if (ruleResult === true) {
                    cell.textContent = '✔';
                    cell.style.backgroundColor = 'green';
                    cell.style.color = 'white';
                } else if (ruleResult === false) {
                    cell.textContent = '✘';
                    cell.style.backgroundColor = 'red';
                    cell.style.color = 'white';
                } else {
                    cell.textContent = 'X';
                    cell.style.backgroundColor = 'grey';
                    cell.style.color = 'white';
                }

                row.appendChild(cell);
            }

            rulesSelected[8] = true;
            // Add the "Valid" column with conditional color
            const isValid = rulesSelected.slice(0, -1).every((rule, index) => !rule || combo[`Rule_${index}`] === true);
             const validCell = document.createElement('td');
            validCell.textContent = isValid ? '✔' : '✘';


            // Apply green or red background for validity
            validCell.style.backgroundColor = isValid ? 'green' : 'red';
            validCell.style.color = 'white';
            row.appendChild(validCell);

            

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    }
}




// Ajoute un gestionnaire d'événement pour le bouton "Valider"
document.getElementById('validerm1')?.addEventListener('click', updateCombinationsTable);

// Initialise la table des combinaisons après le chargement de la page
window.onload = () => {
    displayCombinationsTable();
};
