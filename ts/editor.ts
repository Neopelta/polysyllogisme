export const universalPositive: string[] = [];
export const universalNegative: string[] = [];
export const existentialPositive: string[] = [];
export const existentialNegative: string[] = [];

export function addUniqueEntry(array: string[], value: string): void {
    if (!array.includes(value)) {
        array.push(value);
    }
}

export function loadQuantifiersFromLocalStorage(): void {
    const loadedUniversalPositive = localStorage.getItem('universalPositive');
    const loadedUniversalNegative = localStorage.getItem('universalNegative');
    const loadedExistentialPositive = localStorage.getItem('existentialPositive');
    const loadedExistentialNegative = localStorage.getItem('existentialNegative');

    if (!loadedUniversalPositive && !loadedUniversalNegative && 
        !loadedExistentialPositive && !loadedExistentialNegative) {
        addDefaultQuantifiers();
        return;
    }

    if (loadedUniversalPositive) {
        const values: string[] = JSON.parse(loadedUniversalPositive);
        values.forEach((value: string) => addUniqueEntry(universalPositive, value));
    }
    if (loadedUniversalNegative) {
        const values: string[] = JSON.parse(loadedUniversalNegative);
        values.forEach((value: string) => addUniqueEntry(universalNegative, value));
    }
    if (loadedExistentialPositive) {
        const values: string[] = JSON.parse(loadedExistentialPositive);
        values.forEach((value: string) => addUniqueEntry(existentialPositive, value));
    }
    if (loadedExistentialNegative) {
        const values: string[] = JSON.parse(loadedExistentialNegative);
        values.forEach((value: string) => addUniqueEntry(existentialNegative, value));
    } 
}

export function saveQuantifiersToLocalStorage(): void {
    localStorage.setItem('universalPositive', JSON.stringify(universalPositive));
    localStorage.setItem('universalNegative', JSON.stringify(universalNegative));
    localStorage.setItem('existentialPositive', JSON.stringify(existentialPositive));
    localStorage.setItem('existentialNegative', JSON.stringify(existentialNegative));

    console.log("Quantifiers saved to localStorage.");
}

function addDefaultQuantifiers(): void {
    addUniqueEntry(universalPositive, "Tout");
    addUniqueEntry(universalPositive, "Chaque");
    addUniqueEntry(universalPositive, "Tous les");
    
    addUniqueEntry(universalNegative, "Aucun");
    addUniqueEntry(universalNegative, "Nul");
    addUniqueEntry(universalNegative, "Pas un");
    
    addUniqueEntry(existentialPositive, "Quelque");
    addUniqueEntry(existentialPositive, "Certains");
    addUniqueEntry(existentialPositive, "Il existe");
    
    addUniqueEntry(existentialNegative, "Quelque ne ... pas");
    addUniqueEntry(existentialNegative, "Certains ne ... pas");
    
    saveQuantifiersToLocalStorage();
}

export function initializeDefaultQuantifiers(): void {
    if (universalPositive.length === 0) {
        addDefaultQuantifiers();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuantifiersFromLocalStorage();

    // Met à jour l'affichage
    displayQuantifiers();
    
    // Met à jour la dropdown list
    updateDeleteDropdown();
    
    // Ajoute les event listeners pour les boutons
    document.getElementById('addButton')?.addEventListener('click', addQuantifier);
    document.getElementById('deleteButton')?.addEventListener('click', deleteQuantifier);
    document.getElementById('updateButton')?.addEventListener('click', updateQuantifier);
});

function displayQuantifiers() {
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

function selectQuantifier(quantifier: string): void {
    const updateInput = document.getElementById('updateQuantifierInput') as HTMLInputElement;
    updateInput.value = quantifier; // Mettre le texte du quantificateur dans le champ de mise à jour
}

// Fonction pour mettre à jour un quantificateur
function updateQuantifier(): void {
    const updateInput = document.getElementById('updateQuantifierInput') as HTMLInputElement;
    const newQuantifierText = updateInput.value.trim();

    if (!newQuantifierText) {
        alert('Veuillez entrer un nouveau texte pour le quantificateur.');
        return;
    }

    const deleteSelect = document.getElementById('deleteQuantifierSelect') as HTMLSelectElement;
    const selectedQuantifier = deleteSelect.value;

    [universalPositive, universalNegative, existentialPositive, existentialNegative].forEach(array => {
        const index = array.indexOf(selectedQuantifier);
        if (index > -1) {
            array[index] = newQuantifierText; // Met à jour le quantificateur avec le nouveau texte
        }
    });

    updateDeleteDropdown(); // Mettre à jour le menu déroulant de suppression
    displayQuantifiers(); // Mettre à jour la liste affichée
    saveQuantifiersToLocalStorage(); // Sauvegarder après mise à jour
    updateInput.value = ''; // Réinitialiser le champ de texte
}

// Fonction pour supprimer un quantificateur
function deleteQuantifier(): void {
    const deleteSelect = document.getElementById('deleteQuantifierSelect') as HTMLSelectElement;
    const selectedQuantifier = deleteSelect.value;

    [universalPositive, universalNegative, existentialPositive, existentialNegative].forEach(array => {
        const index = array.indexOf(selectedQuantifier);
        if (index > -1) {
            array.splice(index, 1);
        }
    });

    updateDeleteDropdown();
    displayQuantifiers(); // Met à jour la liste affichée
    saveQuantifiersToLocalStorage(); // Sauvegarder après suppression
}

function updateDeleteDropdown() {
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

function addQuantifier(): void {
    const inputElement = document.getElementById('quantifierInput') as HTMLInputElement | null;

    if (!inputElement) {
        console.error("L'élément d'entrée n'a pas été trouvé.");
        return;
    }

    const quantifierText = inputElement.value.trim(); // Accéder à 'value' et supprimer les espaces

    // Récupérer les valeurs des radios
    const quantityRadio = document.querySelector('input[name="quantity1"]:checked') as HTMLInputElement | null;
    const qualityRadio = document.querySelector('input[name="quality1"]:checked') as HTMLInputElement | null;

    const quantityType = quantityRadio ? quantityRadio.value : null;
    const qualityType = qualityRadio ? qualityRadio.value : null;

    if (quantifierText && quantityType && qualityType) {
        const type = `${quantityType}${qualityType.charAt(0).toUpperCase() + qualityType.slice(1)}`;

        // Ajouter le quantificateur au tableau correspondant
        switch (type) {
            case 'universalPositive':
                universalPositive.push(quantifierText);
                break;
            case 'universalNegative':
                universalNegative.push(quantifierText);
                break;
            case 'existentialPositive':
                existentialPositive.push(quantifierText);
                break;
            case 'existentialNegative':
                existentialNegative.push(quantifierText);
                break;
            default:
                console.error('Type de quantificateur invalide:', type);
                alert('Type de quantificateur invalide. Veuillez vérifier les sélections.');
                return;
        }

        // Mettre à jour instantanément la liste affichée
        displayQuantifiers(); // Afficher les quantificateurs chargés

        updateDeleteDropdown(); // Mettre à jour le menu déroulant de suppression
        saveQuantifiersToLocalStorage(); // Sauvegarder dans le localStorage
        inputElement.value = ''; // Réinitialiser le champ de texte
    } else {
        alert('Veuillez remplir tous les champs avant d\'ajouter un quantificateur.');
    }
}

document.getElementById('addButton')?.addEventListener('click', addQuantifier);
document.getElementById('deleteButton')?.addEventListener('click', deleteQuantifier);
document.getElementById('updateButton')?.addEventListener('click', updateQuantifier);

window.onload = (event) => {
    displayQuantifiers();
};