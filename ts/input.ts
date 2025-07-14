import {
    universalPositive,
    universalNegative,
    existentialPositive,
    existentialNegative,
    loadQuantifiersFromLocalStorage
} from './editor.js';

// Liste des verbes d'état
export const verbes = ["Être", "Avoir", "Faire", "Dire", "Pouvoir", "Vouloir", "Savoir"];

/**
 * Initialise tous les selects au chargement de la page
 */
function initializeSelects(): void {
    loadQuantifiersFromLocalStorage(); // Charge les quantificateurs depuis localStorage
    ajouterVerbesAuxSelects(); // Ajoute les verbes d'état aux listes déroulantes
    initializeQuantifierSelects(); // Initialise les selects des quantificateurs
}

/**
 * Ajoute les verbes aux selects correspondants
 */
export function ajouterVerbesAuxSelects(): void {
    // Select all elements with an ID starting with 'selectStativeVerb'
    const selectVerbes = document.querySelectorAll("[id^='selectStativeVerb']");

    selectVerbes.forEach(selectVerbe => {
        // Ensure TypeScript knows this is an HTMLSelectElement
        const selectElement = selectVerbe as HTMLSelectElement;

        // Clear existing options
        selectElement.innerHTML = "";
        //console.log(`Effacement des options pour : ${selectElement.id}`); // Log the ID of the <select> being processed

        // Create a default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.hidden = true;
        defaultOption.textContent = "PlaceHolder";
        selectElement.appendChild(defaultOption);

        //console.log(`Ajout de l'option par défaut au <select> : ${selectElement.id}`); // Check if the default option is added

        // Add verb options
        verbes.forEach(verbe => {
            const option = document.createElement("option");
            option.value = verbe;
            option.textContent = verbe;
            selectElement.appendChild(option);
            //console.log(`Ajout de l'option "${verbe}" au <select> : ${selectElement.id}`); // Log each verb added
        });

        // Final check: log all options added
        const options = Array.from(selectElement.options).map(opt => opt.textContent);
        //console.log(`Options finales dans ${selectElement.id} :`, options);
    });
}

export function ajouterVerbesAuSelectParIndex(index: number): void {
    // Construire l'ID basé sur l'index
    const selectId = `selectStativeVerb${index}`;

    // Trouver l'élément <select> avec l'ID généré
    const selectElement = document.getElementById(selectId) as HTMLSelectElement | null;

    if (!selectElement) {
        console.error(`Aucun élément avec l'ID "${selectId}" n'a été trouvé.`);
        return;
    }

    // Effacer les options existantes
    selectElement.innerHTML = "";

    // Créer une option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.hidden = true;
    defaultOption.textContent = "PlaceHolder";
    selectElement.appendChild(defaultOption);

    // Ajouter les options de verbes
    verbes.forEach(verbe => {
        const option = document.createElement("option");
        option.value = verbe;
        option.textContent = verbe;
        selectElement.appendChild(option);
    });

    // Vérification finale : log des options ajoutées (facultatif)
    const options = Array.from(selectElement.options).map(opt => opt.textContent);
    console.log(`Options finales dans ${selectId} :`, options);
}



/**
 * Initialise les selects des quantificateurs
 */
function initializeQuantifierSelects(): void {
    for (let i = 0; i <= 10; i++) {
        const adjustedIndex = i === 0 ? "conclusion" : i; // Remplace 0 par "conclusion"
        setupQuantifierRadioListeners(adjustedIndex);
        updateSelectOptions(adjustedIndex);
    }
}

/**
 * Configure les écouteurs pour les radios des quantificateurs
 */
function setupQuantifierRadioListeners(index: number | string): void {
    const quantityRadios = document.getElementsByName(`quantifier_${index}`);
    const qualityRadios = document.getElementsByName(`quantifier_bool_${index}`);

    [...quantityRadios, ...qualityRadios].forEach(radio => {
        const clonedRadio = radio.cloneNode(true) as HTMLInputElement; // Cloner l'élément
        radio.replaceWith(clonedRadio); // Remplacer l'ancien élément

        clonedRadio.addEventListener("change", () => updateSelectOptions(index));
    });
}

/**
 * Met à jour les options d'un select en fonction des radios sélectionnées
 */
function updateSelectOptions(index: number | string): void {
    const isConclusion = index === "conclusion";
    const numericIndex = isConclusion ? "" : Number(index) * 2;

    const selectElement = document.getElementById(`selectQuantifier${isConclusion ? "conclusion" : numericIndex}`) as HTMLSelectElement;

    const quantityRadio = document.querySelector(`input[name="quantifier_${index}"]:checked`) as HTMLInputElement;
    const qualityRadio = document.querySelector(`input[name="quantifier_bool_${index}"]:checked`) as HTMLInputElement;

    if (!selectElement || !quantityRadio || !qualityRadio) return;

    // Réinitialiser le contenu du select pour éviter les doublons
    selectElement.innerHTML = '';
    addDefaultOption(selectElement);

    let options: string[] = [];
    if (quantityRadio.value === "Universal") {
        options = qualityRadio.value === "Positive" ? universalPositive : universalNegative;
    } else {
        options = qualityRadio.value === "Positive" ? existentialPositive : existentialNegative;
    }

    options.forEach(option => addOption(selectElement, option));
}

/**
 * Ajoute une option par défaut à un select
 */
function addDefaultOption(select: HTMLSelectElement): void {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.selected = true;
    defaultOption.hidden = true;
    defaultOption.textContent = "PlaceHolder";
    select.appendChild(defaultOption);
}

/**
 * Ajoute une option à un select
 */
function addOption(select: HTMLSelectElement, value: string): void {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
}

// Initialisation au chargement de la page
window.onload = initializeSelects;

// Export des fonctions pour d'autres modules
export {
    initializeSelects,
    updateSelectOptions,
};

document.addEventListener("DOMContentLoaded", () => {
    // Liste des IDs des <select> à gérer
    const quantifierSelectIds = ["selectQuantifier2", "selectQuantifier4", "selectQuantifier6", "selectQuantifier8", "selectQuantifier10", "selectQuantifier12", "selectQuantifier14", "selectQuantifier16", "selectQuantifier18"];

    // Charger les valeurs depuis le localStorage et ajouter les événements
    quantifierSelectIds.forEach((id) => {
        const selectElement = document.getElementById(id) as HTMLSelectElement;

        if (selectElement) {
            // Charger la valeur sélectionnée depuis localStorage
            const storedValue = localStorage.getItem(id);
            if (storedValue) {
                selectElement.value = storedValue;
            }

            // Ajouter un événement pour sauvegarder la valeur sélectionnée
            selectElement.addEventListener("change", () => {
                localStorage.setItem(id, selectElement.value);
            });
        }
    });
});
