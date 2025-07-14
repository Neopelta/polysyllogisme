// Function: loadLanguage
// Description: [Add a description of what this function does.]
// Parameters: [Add descriptions of parameters if applicable.]
// Returns: [Add a description of what the function returns.]
function loadLanguage(lang: string, callback: (translations: any) => void): void {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `../langage/${lang}.json`, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const translations = JSON.parse(xhr.responseText);
            callback(translations);
        } else {
            console.error('Erreur lors du chargement des traductions:', xhr.statusText);
        }
    };
    xhr.onerror = () => {
        console.error('Erreur lors de la requête:', xhr.statusText);
    };
    xhr.send();
}

// Function: applyTranslations
// Description: [Add a description of what this function does.]
// Parameters: [Add descriptions of parameters if applicable.]
// Returns: [Add a description of what the function returns.]
function applyTranslations(translations: { [key: string]: string }) {
// [Describe the object or type here.]
    Object.entries(translations).forEach(([key, value]: [string, string]) => {
        const element = document.getElementById(key);

        if (element == null) {
            return;
        } else if (element instanceof HTMLInputElement) {
            element.value = value;
        } else if (element instanceof HTMLElement) {
            element.textContent = value;
        }
    });
}

const selectedLanguage = localStorage.getItem('selectedLanguage') || 'fr';
loadLanguage(selectedLanguage, applyTranslations);

const languageSelect = document.getElementById('language') as HTMLSelectElement;
languageSelect.value = selectedLanguage;
languageSelect.addEventListener('change', (event) => {
    const selectedLang = (event.target as HTMLSelectElement).value;

    localStorage.setItem('selectedLanguage', selectedLang);

    loadLanguage(selectedLang, applyTranslations);
});
