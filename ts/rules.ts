import{Polysyllogism, PropositionParameter, Proposition, Type} from "./syllogisms";

/**
 * Contient des méthodes statiques pour vérifier diverses règles logiques applicables aux polysyllogismes.
 */
export class Rules{

    static descriptions: Record<string, string> = {
        Rmt: "Le moyen terme n'est pas distribué universellement au moins une fois dans les prémisses, ce qui peut mener à des conclusions invalides.",
        
        Rnn: "Le syllogisme contient deux prémisses négatives. Avec deux prémisses négatives, il est impossible d'établir une relation valide entre le sujet et le prédicat de la conclusion.",
        
        Raa: "Le syllogisme contient deux prémisses particulières (existentielles). Cela ne permet pas d'établir une connexion logique suffisante pour garantir une conclusion valide.",
        
        Rp: "Une ou plusieurs prémisses sont invalides. Chaque prémisse doit être logiquement cohérente et bien formée pour que le syllogisme soit valide.",
        
        Rlh: "La conclusion contient des informations qui ne sont pas présentes dans les prémisses. La conclusion ne peut pas introduire de nouveaux éléments ou relations qui n'ont pas été établis dans les prémisses.",
        
        Rn: "La conclusion n'est pas négative alors qu'au moins une prémisse l'est. Si une prémisse est négative, la conclusion doit également être négative.",
        
        Rpp: "La conclusion est négative alors que toutes les prémisses sont positives. Avec des prémisses uniquement positives, la conclusion doit être positive.",
        
        Ruu: "Le syllogisme ne respecte pas l'hypothèse d'existence. Les termes utilisés doivent correspondre à des ensembles non vides pour que le raisonnement soit valide."
    };

    /**
     * Vérifie la règle Rmt dans un polysyllogisme.
     * @param s - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée, sinon `false`.
     */
    static verifyRmt(s : Polysyllogism) : boolean {
        var res: boolean = true;
        var index : number = 0; 
        var med_terms : Array<[boolean, boolean]> = new Array<[boolean, boolean]>(s.nb_premises); 

        var curr_med : [boolean, boolean] = [false, false];
        var curr_med_value : string; 

        curr_med[0] = !((s.propositions[s.nb_premises]).isTerm(s.propositions[0].subject));
        curr_med_value = s.propositions[0].getTerm(curr_med[0]); 
        
        for(let i = 1; i < s.nb_premises ; ++i){
            curr_med[1] = s.propositions[i].isSubject(curr_med_value);
            med_terms[i - 1] = [curr_med[0], curr_med[1]];
            curr_med[0] = !curr_med[1]; 
            curr_med_value = s.propositions[i].getTerm(curr_med[0]);
        }

        while(index < s.nb_premises - 1 && res){
            var curr_term = med_terms[index];
            res = s.propositions[index].getTermQuantity(curr_term[0]) || s.propositions[index + 1].getTermQuantity(curr_term[1]);  
            ++index;
        }
        
        return res;    
    }

    /**
     * Vérifie la règle Rlh dans un polysyllogisme.
     * @param s - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée, sinon `false`.
     */
    static verifyRlh(s : Polysyllogism) : boolean{
        let major = s.propositions[0];  
        let conclusion = s.propositions[s.nb_premises];
        let minor = s.propositions[s.nb_premises - 1];
        let res = true; 
        if(conclusion.getSubjectQuantity()){

            if(minor.isSubject(conclusion.subject)){
                res = res && minor.getSubjectQuantity(); 
            }
            else{
                res = res && minor.getPredicatQuantity();
            }
        }
        if(conclusion.getPredicatQuantity()){
            if(major.isSubject(conclusion.predicate)){
                res = res && major.getSubjectQuantity(); 
            }
            else{
                res = res && major.getPredicatQuantity(); 
            }
        }
        return res; 
    }
    
    /**
     * Vérifie la règle Rnn dans un polysyllogisme.
     * @param s - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée, sinon `false`.
     */
    static verifyRnn(s: Polysyllogism): boolean {
         var b_negative : number = 0;
         var index : number = 0; 
         var res : boolean = true; 
         
         while(index < s.nb_premises && b_negative < 2){
            if(!s.propositions[index].isAffirmative()){
                ++b_negative;
                if(b_negative == 2){
                    res = false; 
                }
            }
            ++index;
         }

         return res; 
    }
    
    /**
     * Vérifie la règle Rn dans un polysyllogisme.
     * @param s - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée, sinon `false`.
     */
    static verifyRn(s: Polysyllogism): boolean{
        var nb_negative = 0; 
        var res = true; 
        var index = 0; 
        while(nb_negative < 1 && index < s.nb_premises){
            if(!(s.propositions[index].isAffirmative())){
                ++nb_negative;
                res = !s.propositions[s.nb_premises].isAffirmative()
            }
            ++index; 
        }
        return res; 

    }
    
    /**
     * Vérifie la règle Raa dans un polysyllogisme.
     * @param s - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée, sinon `false`.
     */
    static verifyRaa(s: Polysyllogism): boolean{
        var allAffirmative = true; 
        var index = 0; 
        while(index < s.nb_premises && allAffirmative){
            if(!s.propositions[index].isAffirmative()){
                allAffirmative = false; 
            }
            ++index; 
        }
        if(allAffirmative){
            return s.propositions[s.nb_premises].isAffirmative()
        }
        else {
            return true; 
        }
    }
    
    /**
     * Vérifie la règle Rpp dans un polysyllogisme.
     * @param s - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée, sinon `false`.
     */
    static verifyRpp(s: Polysyllogism): boolean{
        var nbParticular = 0 ; 
        var index = 0;  
        while(nbParticular < 2 && index < s.nb_premises){
            if(!s.propositions[index].isUniversal()){
                ++nbParticular; 
                if(nbParticular == 2){
                    return false; 
                }
            }
            ++index; 
        }
        return true; 
    }
    
    /**
     * Vérifie la règle Rp dans un polysyllogisme.
     * @param s - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée, sinon `false`.
     */
    static verifyRp(s: Polysyllogism): boolean{
        var index = 0 ; 
        while (index < s.nb_premises){
            if(!s.propositions[index].isUniversal()){
                return !s.propositions[s.nb_premises].isUniversal()
            }
            ++index;
        }
        return true; 
    }

    /**
     * Vérifie la règle Ruu dans un polysyllogisme.
     * @param s - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée, sinon `false`.
     */
    static verifyRuu(s: Polysyllogism): boolean{
        var index = 0; 
        var res = true; 
        while(index < s.nb_premises && res){
            res = s.propositions[index].isUniversal(); 
            ++index; 
        }
        if(res){
            res = s.propositions[s.nb_premises].isUniversal();
        }
        return res; 
    }
}

/**
 * Vérifie la validité des polysyllogismes en appliquant une série de règles.
 */
export class ValidityChecker{
    /**
     * Liste des règles à appliquer selon l'indice.
     * @private
     */
    private rules : Array<boolean>; 

    /**
     * Initialise un vérificateur de validité avec un ensemble de règles données.
     * @param rules - Tableau indiquant si chaque règle est appliquée (`true`) ou non (`false`).
     */
    constructor(rules : Array<boolean>){
        this.rules = rules; 
    }

    /**
     * Vérifie une règle spécifique appliquée à un polysyllogisme.
     * @private
     * @param index - L'indice de la règle à vérifier.
     * @param p - Le polysyllogisme à vérifier.
     * @returns `true` si la règle est respectée ou désactivée, sinon `false`.
     */
    private checkRule(index: number, p: Polysyllogism): boolean {
       
        const ruleValue = this.rules[index];
    
        
        if (!ruleValue) {
            return true;
        }
    
        let res: boolean;
        switch (index) {

            case 0: {
                res = Rules.verifyRmt(p);
                if (!res) {
                    console.log("Rmt");
                }
                return res;
            }
            case 4: {
                res = Rules.verifyRlh(p);
                if (!res) {
                    console.log("Rlh");
                }
                return res;
            }
            case 1: {
                res = Rules.verifyRnn(p);
                if (!res) {
                    console.log("Rnn");
                }
                return res;
            }
            case 5: {
                res = Rules.verifyRn(p);
                if (!res) {
                    console.log("Rn");
                }
                return res;
            }
            case 2: {
                res = Rules.verifyRaa(p);
                if (!res) {
                    console.log("Raa");
                }
                return res;
            }
            case 6: {
                res = Rules.verifyRpp(p);
                if (!res) {
                    console.log("Rpp");
                }
                return res;
            }
            case 3: {
                res = Rules.verifyRp(p);
                if (!res) {
                    console.log("Rp");
                }
                return res;
            }
            case 7: {
                res = Rules.verifyRuu(p);
                if (!res) {
                    console.log("Ruu");
                }
                return res;
            }
            default: {
                console.log("Invalid rule index");
                return false;
            }
        }
    }

    /**
     * Vérifie la validité d'un polysyllogisme si sa conclusion était universelle. Ce polysyllogisme est considéré comme inintéressant. 
     * @param p - Le polysyllogisme à vérifier.
     * @returns `true` si le polysyllogisme est inintéressant ou si sa conclusion est universelle, sinon `false`.
     */
    checkUninteresting(p: Polysyllogism): boolean {
        var universal = p.propositions[p.nb_premises].isUniversal()
        if(!universal){
            var poly_premises : Array<PropositionParameter> = new Array<PropositionParameter>(p.nb_premises + 1)
            for(let premise_index = 0; premise_index < p.nb_premises; ++premise_index){
                let curr_premise: Proposition = p.propositions[premise_index]
                let param : PropositionParameter ={subject:curr_premise.subject, predicate:curr_premise.predicate, type:curr_premise.type}
                poly_premises[premise_index] = param 
            }
            let new_type : Type 
            if(p.propositions[p.nb_premises].type == Type.I){
                new_type = Type.A
            }
            else { 
                new_type = Type.E
            }
            let new_conclusion_param : PropositionParameter = {subject:p.propositions[p.nb_premises].subject, predicate:p.propositions[p.nb_premises].predicate, type:new_type}
            poly_premises[p.nb_premises] = new_conclusion_param
            var univ_poly : Polysyllogism = new Polysyllogism(p.nb_premises, poly_premises)
            
            return this.checkValidity(univ_poly)
        } 


        return false
    }

    /**
     * Vérifie la validité d'un polysyllogisme en appliquant les règles à vérifier.
     * @param p - Le polysyllogisme à vérifier.
     * @returns `true` si toutes les règles à vérifier sont respectées, sinon `false`.
     */
    checkValidity(p: Polysyllogism) : boolean {
        console.log("le tab passé est : ");
        console.log(this.rules);
        console.log("le poly est :");
        console.log(p);
        var index : number = 0 ; 
        var res : boolean = true; 
        while(index < 8 && res){
            res = this.checkRule(index, p);
            ++index;
        }

        return res; 
    }
    /**
     * Retourne la description et l'explication de la première règle qui échoue.
     * @param p - Le polysyllogisme à vérifier.
     * @returns Un objet contenant la règle et son explication, ou null si toutes passent.
     */
    getFailedRule(p: Polysyllogism): { rule: string; explanation: string } | null {
        for (let index = 0; index < this.rules.length; index++) {
            if (!this.checkRule(index, p)) {
                const ruleKey = this.getRuleKeyByIndex(index); // Associe l'index à une clé de règle
                return {
                    rule: ruleKey,
                    explanation: Rules.descriptions[ruleKey],
                };
            }
        }
        return null;
    }

    /**
     * Retourne la clé de la règle basée sur son index.
     * @param index - L'index de la règle.
     * @returns La clé de la règle (ex : "Rmt").
     */
    private getRuleKeyByIndex(index: number): string {
        switch (index) {
            case 0: return "Rmt";
            case 1: return "Rnn";
            case 2: return "Raa";
            case 3: return "Rp";
            case 4: return "Rlh";
            case 5: return "Rn";
            case 6: return "Rpp";
            case 7: return "Ruu";
            default: return "Règle inconnue";
        }
    }
}