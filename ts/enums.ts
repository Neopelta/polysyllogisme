/**
 * Représente un type basé sur des champs prédéfinis (A, E, I, O).
 */
export class Type {
    /**
     * Type statique représentant le type "A": soit universel affirmatif.
     */
    static A : Type = new Type("A");
    /**
     * Type statique représentant le type "E": soit universel négatif.
     */
    static E : Type = new Type("E");
    /**
     * Type statique représentant le type "I": soit existentiel affirmatif.
     */
    static I : Type = new Type("I");
    /**
     * Type statique représentant le type "O": soit existentiel négatif.
     */
    static O : Type = new Type("O");

    /**
     * La chaîne de caractères associée au type.
     * @private
     */
    private value: string; 

    /**
     * Constructeur privé pour empêcher la création directe de nouveaux types.
     * @param value - La valeur du type.
     * @private
     */
    private constructor(value: string){ 
        this.value = value;  
    }

    /**
     * Retourne l'instance de `Type` correspondant à la valeur spécifiée.
     * @param value - La valeur du type voulu.
     * @returns L'instance correspondante de `Type` ou `undefined` si aucune correspondance.
     */
    static getType(value: string): Type | undefined{
        switch (value){
            case "A":{
                return Type.A; 
            }
            case "E":{
                return Type.E; 
            }
            case "I":{
                return Type.I; 
            }
            case "O":{
                return Type.O; 
            }
        }
    }

    /**
     * Vérifie si le type est universel (A ou E).
     * @returns `true` si le type est universel, sinon `false`.
     */
    isUniversal() : boolean{
        return (this == Type.A) || (this == Type.E) ; 
    }

    /**
     * Vérifie si le type est affirmatif (A ou I).
     * @returns `true` si le type est affirmatif, sinon `false`.
     */
    isAffirmative() : boolean{
        return (this == Type.A) || (this == Type.I); 
    }

    /**
     * Retourne la représentation textuelle du type logique.
     * @returns Le type sous forme de chaîne de caractères.
     */
    getString() : string{
        return this.value; 
    }
}

/**
 * Représente une proposition logique caractérisée par un sujet, un prédicat et un type correspondant à sa quantité et à sa qualité (A, E, I, O).
 */
export class Proposition{

        /**
        * Le sujet de la proposition.
        */
        subject : string;

        /**
        * Le prédicat de la proposition.
        */
        predicate : string;

        /**
        * Le type de la proposition.
        */
        type : Type;

        /**
        * Crée une nouvelle proposition logique.
        * @param subject - Le sujet de la proposition.
        * @param predicate - Le prédicat de la proposition.
        * @param type - Le type de la proposition.
        */
        constructor(subject: string, predicate: string, type : Type) {
            this.subject = subject ;
            this.predicate = predicate ; 
            this.type = type;
        }
        /**
        * Vérifie si le sujet de la proposition a une quantité universelle.
        * @returns `true` si le sujet est universel, sinon `false`.
        */
        getSubjectQuantity() : boolean{
            return this.type.isUniversal();
        } 

        /**
        * Vérifie si le prédicat de la proposition a une quantité particulière.
        * @returns `true` si le prédicat est particulier, sinon `false`.
        */
        getPredicatQuantity() : boolean{
            return !this.type.isAffirmative(); 
        } 

        /**
        * Retourne la quantité (universelle ou particulière) du terme spécifié.
        * @param isSubject - `true` pour vérifier le sujet, `false` pour vérifier le prédicat.
        * @returns `true` si la quantité correspondante est universelle, sinon `false`.
        */
        getTermQuantity(isSubject: boolean) : boolean {
            if(isSubject){
                return this.getSubjectQuantity(); 
            }
            else return this.getPredicatQuantity();
        }

        /**
        * Vérifie si la proposition est universelle.
        * @returns `true` si la proposition est universelle, sinon `false`.
        */
        isUniversal() : boolean {
            return this.type.isUniversal(); 
        }

        /**
        * Vérifie si la proposition est affirmative.
        * @returns `true` si la proposition est affirmative, sinon `false`.
        */
        isAffirmative() : boolean {
            return this.type.isAffirmative();
        }

        /**
        * Génère une représentation textuelle de la proposition.
        * @returns Une chaîne de caractères au format `"{subject} {predicate} : {type}"`.
        */
        toString() : string{
            return this.subject + " " + this.predicate + " : " + this.type.toString();  
        } 
        
         /**
        * Vérifie si une chaîne spécifiée correspond au sujet de la proposition.
        * @param v - La chaîne à comparer au sujet.
        * @returns `true` si la chaîne correspond au sujet, sinon `false`.
        */
        isSubject(v: string) : boolean {
            return (this.subject == v); 
        }

        /**
        * Vérifie si une chaîne spécifiée correspond au prédicat de la proposition.
        * @param v - La chaîne à comparer au prédicat.
        * @returns `true` si la chaîne correspond au prédicat, sinon `false`.
        */
        isPredicate(v: string) : boolean {
            return (this.predicate == v); 
        }

        /**
        * Retourne le terme spécifié (sujet ou prédicat).
        * @param v - `true` pour retourner le sujet, `false` pour retourner le prédicat.
        * @returns Le terme correspondant sous forme de chaîne.
        */
        getTerm(v: boolean) : string{
            if(v) {
                return this.subject;
            }
            return this.predicate; 
        }

        /**
        * Vérifie si une chaîne spécifiée correspond au sujet ou au prédicat de la proposition.
        * @param v - La chaîne à comparer.
        * @returns `true` si la chaîne correspond au sujet ou au prédicat, sinon `false`.
        */
        isTerm(v: string) : boolean {
            return (this.subject == v ) || (this.predicate == v);
        }
}
