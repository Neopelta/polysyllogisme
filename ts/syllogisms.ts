import { Type, Proposition} from "./enums";
export {Type, Proposition}
/**
 * Paramètres nécessaire à la création d'un polysyllogisme.
 */
export interface PropositionParameter {
    /**
     * Sujet de la proposition.
     */
    subject: string;

    /**
     * Prédicat de la proposition.
     */
    predicate: string;

    /**
     * Type de la proposition (A, E, I, O).
     */
    type: Type; 
}

/**
 * Représente les apparitions d'un terme dans le polysyllogisme.
 */
interface TermAppearance {
    /**
     * Nombre de répétitions du terme dans les propositions.
     */
    nb_repetition : number; 

    /**
     * Tableau indiquant les indices des propositions où le terme apparaît.
     */
    presence_array: Array<number>;
}

/**
 * Représente un polysyllogisme, qui est une série de propositions reliées de manière logique.
 * La classe valide la structure et permet de gérer les propositions associées.
 */
export class Polysyllogism{
    /**
     * Ensemble des propositions constituant le polysyllogisme.
     */
    propositions: Array<Proposition>; 
    /**
     * Nombre de prémisses dans le polysyllogisme (exclut la conclusion).
     */ 
    nb_premises : number; 
    
    /**
     * Valide la structure du polysyllogisme en vérifiant les relations entre termes.
     * @returns `true` si les propositions forment un polysyllogisme et les mettent dans le bon ordre, sinon `false`.
     * 
     * 
     * - Chaque terme doit apparaître exactement deux fois, sauf les termes de la conclusion.
     * - Le terme sujet et le terme prédicat de la conclusion doivent être reliés par les prémisses.
     */
    checkStructure(): boolean{
        var nb_term = 0 
        var index = 0   

        var term_appearances = new Map<string, TermAppearance>()
        
        var S = this.propositions[this.nb_premises ].subject
        var P = this.propositions[this.nb_premises].predicate 
        var PredicateCisPredicate1 = false

        var firstP_index = this.nb_premises, lastP_index = this.nb_premises
        var foundP1 = false, found_Pn = false 


        while(index < this.nb_premises){
            let proposition = this.propositions[index]
            let term = proposition.subject 
            let curr_term_appearance = term_appearances.get(term)
            if(curr_term_appearance != undefined){
                curr_term_appearance.nb_repetition++; 
                if(curr_term_appearance.nb_repetition > 2){
                    console.log(term + " repeated more than twice")
                    return false 
                }
                if(term == S || term == P){
                    console.log(term + " conclusion term repeated in more than one premise")
                    return false 
                }
                curr_term_appearance.presence_array[1]=index; 
            }
            else{
                nb_term++ 
                if(nb_term > this.nb_premises + 1){
                    console.log(term + " trop de termes")
                    return false 
                }
                if(term == S){
                    lastP_index = index
                    foundP1 = true 
                } 
                if(term == P){
                    firstP_index = index
                    found_Pn = true
                } 
                let tab = new Array<number>(2)
                tab[0] = index
                term_appearances.set(term, {nb_repetition: 1, presence_array:tab})
            }
            term = proposition.predicate 
            curr_term_appearance = term_appearances.get(term)
            if(curr_term_appearance != undefined){
                curr_term_appearance.nb_repetition++; 
                if(curr_term_appearance.nb_repetition > 2){
                    console.log(term + " repeated more than twice")
                    return false 
                }
                if(term == S || term == P){
                    console.log(term + " conclusion term repeated in more than one premise")
                    return false 
                }
                curr_term_appearance.presence_array[1]=index; 
            }
            else{
                nb_term++ 
                if(nb_term > this.nb_premises + 1){
                    console.log(term + " trop de termes")
                    return false 
                }
                if(term == S){
                    lastP_index = index
                    foundP1 = true
                } 
                if(term == P){
                    firstP_index = index
                    found_Pn = true 
                    PredicateCisPredicate1 = true 
                } 
                let tab = new Array<number>(2)
                tab[0] = index
                term_appearances.set(term, {nb_repetition: 1, presence_array:tab})
            }
            ++index 
        }
        if(!foundP1 || !found_Pn){
            console.log("P1 or Pn not found")
            return false 
        }
        else{
            var new_propositions = new Array<Proposition>(this.nb_premises + 1)
            new_propositions[0] = this.propositions[firstP_index]
            new_propositions[this.nb_premises - 1] = this.propositions[lastP_index]
            new_propositions[this.nb_premises] = this.propositions[this.nb_premises]
        }

        
        var curr_prop : number = firstP_index 
        var curr_term : string 
        index = 1
        if(PredicateCisPredicate1){
            curr_term = this.propositions[firstP_index].subject
        }
        else{
            curr_term = this.propositions[firstP_index].predicate
        }
        
        
        while(index < this.nb_premises - 1){
        
            var term_appearance = term_appearances.get(curr_term)
            if (term_appearance != undefined){
                if(term_appearance.presence_array[0] != curr_prop){
                    curr_prop = term_appearance.presence_array[0]
                }
                else{
                    curr_prop = term_appearance.presence_array[1]
                }
                new_propositions[index] = this.propositions[curr_prop]
                if(this.propositions[curr_prop].isSubject(curr_term)){
                    curr_term = this.propositions[curr_prop].predicate
                }
                else{
                    curr_term = this.propositions[curr_prop].subject
                }
            }
            else{
                console.log("Cannot find term appearance")
                return false 
            }
            ++index
        }
        this.propositions = new_propositions
        return true 
    }
    
    /**
     * Crée une instance de polysyllogisme à partir des paramètres donnés.
     * @param nb_premises - Nombre de prémisses dans le polysyllogisme.
     * @param proposition_parameters - Tableau de paramètres décrivant les propositions.
     * @throws Une erreur si les propositions ne constituent pas un polysyllogisme.
     */
    constructor(nb_premises: number, proposition_parameters: Array<PropositionParameter>){
        this.propositions = new Array<Proposition>(nb_premises + 1);
        this.nb_premises = nb_premises;

        for (let i = 0; i < this.nb_premises + 1; i++){
            var param : PropositionParameter = proposition_parameters[i]; 
            this.propositions[i] = new Proposition(param.subject, param.predicate, param.type); 
        }

        if(!this.checkStructure()){
            throw "The given propositions do not make a syllogism"
        }        
    }
    /* 
    addProposition(subject: string, predicate: string, type: Type, i: number){
        this.propositions[i] = (new Proposition(subject, predicate, type)); 
    }
    */

   /**
     * Retourne une représentation textuelle du polysyllogisme.
     * @returns Une chaîne de caractères représentant le polysyllogisme.
     */
    toString() : string{
        var res : string = ""; 

        for (var p in this.propositions){
            res = res + p.toString();
        }

        return res;  
    }
}
