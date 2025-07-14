window.addEventListener('load', () => {
    // Cache mode2 et désactive btn_mode1 au chargement
    document.getElementById("mode2")?.style.setProperty("display", "none");
    (document.getElementById("btn_mode1") as HTMLInputElement).disabled = true;

    // Ajoute les event listeners
    document.getElementById("btn_mode1")?.addEventListener("click", () => {
        document.getElementById("mode1")?.style.setProperty("display", "flex");
        document.getElementById("mode2")?.style.setProperty("display", "none");
        (document.getElementById("btn_mode1") as HTMLInputElement).disabled = true;
        (document.getElementById("btn_mode2") as HTMLInputElement).disabled = false;
    });

    document.getElementById("btn_mode2")?.addEventListener("click", () => {
        document.getElementById("mode2")?.style.setProperty("display", "flex");
        document.getElementById("mode1")?.style.setProperty("display", "none");
        (document.getElementById("btn_mode2") as HTMLInputElement).disabled = true;
        (document.getElementById("btn_mode1") as HTMLInputElement).disabled = false;
    });
});