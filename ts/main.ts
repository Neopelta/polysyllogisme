/**
 * Gestion du mode sombre
 * Ce script permet d'activer ou désactiver le mode sombre sur une page web.
 * L'état du mode sombre est enregistré dans le `localStorage` pour persister entre les sessions.
 */

// Récupère le bouton permettant de gérer le mode sombre
const darkModeButton = document.getElementById('darkModeButton');

if (darkModeButton) {
    darkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode.toString());

        darkModeButton.textContent = isDarkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre';
    });

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeButton.textContent = '☀️ Mode Clair';
    } else {
        darkModeButton.textContent = '🌙 Mode Sombre';
    }
}

/**
 * Gestion des fonctionnalités d'import/export pour Mode 1
 */
(() => {
    const importButtonMode1 = document.getElementById('import_page_mode1');
    const exportButtonMode1 = document.getElementById('export_page_mode1');
    const formMode1 = document.getElementById('formulaire_mode1') as HTMLFormElement;

    exportButtonMode1?.addEventListener('click', () => {
        if (formMode1) {
            const formData = new FormData(formMode1);
            const data: Record<string, any> = {};

            formData.forEach((value, key) => {
                const element = formMode1.elements.namedItem(key) as HTMLInputElement | null;
                if (element && (element.type === 'checkbox' || element.type === 'radio')) {
                    data[key] = element.checked.toString();
                } else {
                    data[key] = value;
                }
            });

            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mon_syllogim.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    });

    importButtonMode1?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement)?.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string);

                        for (const [key, value] of Object.entries(data)) {
                            const field = formMode1.elements.namedItem(key) as HTMLInputElement | null;
                            if (field) {
                                if (field.type === 'checkbox' || field.type === 'radio') {
                                    field.checked = value === 'true';
                                } else {
                                    field.value = value as string;
                                }
                            }
                        }
                        alert('Les données ont été importées avec succès.');
                    } catch (err) {
                        console.error('Erreur lors de l\'importation du fichier JSON :', err);
                        alert('Le fichier importé est invalide.');
                    }
                };
                reader.readAsText(file);
            }
        });

        input.click();
    });
})();

/**
 * Gestion des fonctionnalités d'import/export pour Mode 2
 */
/**
 * Gestion des fonctionnalités d'import/export pour Mode 2
 */
(() => {
    const importButtonMode2 = document.getElementById('import_page_mode2');
    const exportButtonMode2 = document.getElementById('export_page_mode2');
    const formMode2 = document.querySelector('form') as HTMLFormElement;

    // Fonction pour exporter les données du formulaire en JSON
    // Fonction pour exporter les données du formulaire en JSON
exportButtonMode2?.addEventListener('click', () => {
    if (formMode2) {
        const formData = new FormData(formMode2);
        const data: Record<string, any> = {};

        // Collecte les données du formulaire
        Array.from(formMode2.elements).forEach((element) => {
            const field = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            if (field?.name) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    // Vérifie si c'est une checkbox ou un radio avant d'accéder à `checked`
                    data[field.name] = (field as HTMLInputElement).checked.toString();
                } else {
                    // Sauvegarde la valeur des autres types de champs
                    data[field.name] = field.value;
                }
            }
        });

        // Téléchargement du fichier JSON
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form_data_mode2.json';
        a.click();
        URL.revokeObjectURL(url);
    }
});

// Fonction pour importer les données depuis un fichier JSON
importButtonMode2?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);

                    // Identifier le conteneur des prémisses et le modèle de carte
                    const propositionsContainer = document.querySelector('#test') as HTMLElement;
                    const premiseTemplate = document.querySelector('#premise1') as HTMLElement;

                    // Compter les prémisses déjà présentes
                    const existingPremises = propositionsContainer.querySelectorAll('.card').length;
                    const premisesInData = Object.keys(data).filter(key => key.startsWith('premise')).length;

                    // Ajouter les prémisses manquantes
                    for (let i = existingPremises + 1; i <= premisesInData; i++) {
                        const newPremise = premiseTemplate.cloneNode(true) as HTMLElement;

                        // Mettre à jour les IDs et les noms des champs
                        newPremise.id = `premise${i}`;
                        newPremise.querySelectorAll('[id]').forEach((child) => {
                            const element = child as HTMLElement;
                            element.id = element.id.replace(/\d+/, i.toString());
                            if (element.hasAttribute('name')) {
                                element.setAttribute(
                                    'name',
                                    element.getAttribute('name')!.replace(/\d+/, i.toString())
                                );
                            }
                        });

                        propositionsContainer.appendChild(newPremise);
                    }

                    // Remplir les données importées
                    for (const [key, value] of Object.entries(data)) {
                        const field = formMode2.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
                        if (field) {
                            if (field.type === 'checkbox' || field.type === 'radio') {
                                // Vérifie si c'est une checkbox ou un radio avant d'accéder à `checked`
                                (field as HTMLInputElement).checked = value === 'true';
                            } else {
                                // Remplit la valeur des autres types de champs
                                field.value = value as string;
                            }
                        }
                    }
                    alert('Les données ont été importées avec succès.');
                } catch (err) {
                    console.error('Erreur lors de l\'importation du fichier JSON :', err);
                    alert('Le fichier importé est invalide.');
                }
            };
            reader.readAsText(file);
        }
    });

    input.click();
});
})();
