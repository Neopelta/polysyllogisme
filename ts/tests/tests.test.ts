import { Rules, ValidityChecker } from "../../ts/rules"; 
import { Polysyllogism, PropositionParameter } from "../../ts/syllogisms"; 
import { Type, Proposition } from "../../ts/enums"; 
import * as XLSX from "xlsx";


const wb = XLSX.readFile("./ressources/tableur.xlsx");
const ws = wb.Sheets["Feuil1"];

function getCell(col: string, row: number): any {
    const cell = ws[col + row.toString()];
    return cell ? cell.v : undefined;
}

function buildSyllogism(row: number): Polysyllogism | undefined{
    let subjectC = 'S';
    let predicateC = 'P';
    let middle = 'M';

    let type1 = Type.getType(getCell('A', row));
    let type2 = Type.getType(getCell('B', row));
    let typeC = Type.getType(getCell('C', row));
    let prem1 : PropositionParameter;
    let prem2 : PropositionParameter;
    let conclusion : PropositionParameter;

    if(type1 != undefined && type2 != undefined && typeC != undefined){
        let S = getCell( 'W', row);
        let P = getCell('X', row);

        conclusion = {subject: subjectC, predicate: predicateC, type: typeC};
        prem1 = {subject: predicateC, predicate: middle, type: type1};
        prem2 = {subject: middle, predicate: subjectC, type: type2};

        if(P != undefined && S != undefined) {
            if (P) {
                prem1 = {subject: middle, predicate: predicateC, type: type1};
            }
            if (S) {
                prem2 = {subject: subjectC, predicate: middle, type: type2};
            }
        }
        return new Polysyllogism(2, [prem1, prem2, conclusion]);
    }

}

test('test verifyRaa', () => {
    for (let i = 2; i < 258; ++i){
        let expected : boolean = getCell('I', i);
        let p = buildSyllogism(i);
        if(p != undefined){
            expect(Rules.verifyRaa(p)).toBe(expected);
        }

    }
});

test('test verifyRmt', () => {
    for (let i = 2; i < 258; ++i){
        console.log(i)
        let expected : boolean = getCell('E', i);

        let p = buildSyllogism(i);
        if(p != undefined) {
            //console.log(p.propositions);
            expect(Rules.verifyRmt(p)).toBe(expected);
        }

    }
});

test('test verifyRlh', () => {
    for (let i = 2; i < 258; ++i){
        //console.log(i);
        let expected : boolean = getCell('F', i);
        let p = buildSyllogism(i);
        if(p != undefined){
            expect(Rules.verifyRlh(p)).toBe(expected);
        }

    }
});

test('test verifyRnn', () => {
    for (let i = 2; i < 258; ++i){
        //console.log(i);
        let expected : boolean = getCell('G', i);
        let p = buildSyllogism(i);
        if(p != undefined){
            expect(Rules.verifyRnn(p)).toBe(expected);
        }

    }
});

test('test verifyRn', () => {
    for (let i = 2; i < 258; ++i){
        //console.log(i);
        let expected : boolean = getCell('H', i);
        let p= buildSyllogism(i);
        if(p != undefined){
            expect(Rules.verifyRn(p)).toBe(expected);
        }

    }
});

test('test verifyRpp', () => {
    for (let i = 2; i < 258; ++i){
        //console.log(i);
        let expected : boolean = getCell('J', i);
        let p = buildSyllogism(i);
        if(p != undefined){
            expect(Rules.verifyRpp(p)).toBe(expected);
        }

    }
});

test('test verifyRp', () => {
    for (let i = 2; i < 258; ++i){
        //console.log(i);
        let expected : boolean = getCell('K', i);
        let p = buildSyllogism(i);
        if(p != undefined){
            expect(Rules.verifyRp(p)).toBe(expected);
        }

    }
});

test('test polysyllogism', () => {
    let s = "S"; 
    let p = "P"; 
    let m1 = "M";
    let m2 = "R"; 
    let m3 = "T"; 
    let m4 = "N"; 
    let m5 = "C"; 

    let syllogism = new Polysyllogism(6, [{subject:p, predicate:m1, type:Type.A}, {subject:m1, predicate:m2, type:Type.A},{subject:m2, predicate:m3, type:Type.A},{subject:m3, predicate:m4, type:Type.A},{subject:m5, predicate:m4, type:Type.E},{subject:s, predicate:m5, type:Type.A}, {subject:s, predicate:p, type:Type.E}]);
    let rules = new Array(8).fill(true); 
    let validityChecker = new ValidityChecker(rules); 
    
    expect(validityChecker.checkValidity(syllogism)).toBe(true);
}); 

test('test structure', () => {
   let poly :Polysyllogism = new Polysyllogism(5, [{subject:"M1", predicate:"M2", type:Type.A},{subject:"A", predicate:"M1", type:Type.A},{subject:"M3", predicate:"M2", type:Type.A},{subject:"M3", predicate:"M4", type:Type.A},{subject:"M4", predicate:"B", type:Type.A},{subject:"B", predicate:"A", type:Type.A} ]) 
   expect(poly.checkStructure()).toBe(true); 
   //console.log(poly.propositions)
})

test('Type: methodes getType avec types valides', () => {
    expect(Type.getType('A')).toBe(Type.A);
    expect(Type.getType('E')).toBe(Type.E);
    expect(Type.getType('I')).toBe(Type.I);
    expect(Type.getType('O')).toBe(Type.O);
});

test('Type: methodes getType avec types invalides', () => {
    expect(Type.getType('X')).toBeUndefined();
});

test('Type: methode isUniversal', () => {
    expect(Type.A.isUniversal()).toBe(true);
    expect(Type.E.isUniversal()).toBe(true);
    expect(Type.I.isUniversal()).toBe(false);
    expect(Type.O.isUniversal()).toBe(false);
});

test('Type: methode isAffirmative', () => {
    expect(Type.A.isAffirmative()).toBe(true);
    expect(Type.E.isAffirmative()).toBe(false);
    expect(Type.I.isAffirmative()).toBe(true);
    expect(Type.O.isAffirmative()).toBe(false);
});


let proposition: Proposition = new Proposition("Humans", "Mortal", Type.A)

test('Proposition: valeurs des attributs', () => {
    expect(proposition.subject).toBe('Humans');
    expect(proposition.predicate).toBe('Mortal');
    expect(proposition.type).toBe(Type.A);
});

test('Proposition: methode getSubjectQuantity', () => {
    expect(proposition.getSubjectQuantity()).toBe(true);
});

test('Proposition: methode getPredicatQuantity', () => {
    expect(proposition.getPredicatQuantity()).toBe(false);
});

test('Proposition: methodes isUniversal et isAffirmative', () => {
    expect(proposition.isUniversal()).toBe(true);
    expect(proposition.isAffirmative()).toBe(true);
});

test('Proposition: methodes isSubject, isPredicate, isTerm', () => {
    expect(proposition.isSubject('Humans')).toBe(true);
    expect(proposition.isPredicate('Mortal')).toBe(true);
    expect(proposition.isTerm('Humans')).toBe(true);
    expect(proposition.isTerm('Mortal')).toBe(true);
});

const propositions = [
    { subject: 'Humans', predicate: 'Mortal', type: Type.A },
    { subject: 'Mortal', predicate: 'Beings', type: Type.A },
    { subject: 'Humans', predicate: 'Beings', type: Type.A }
];

test('Polysyllogism: attribut propositions', () => {
    
    const polysyllogism = new Polysyllogism(2, propositions);
    console.log(polysyllogism.propositions.length)
    expect(polysyllogism.propositions.length).toBe(3);
});

test('Polysyllogism: verification de la structure a la construction', () => {
    const invalidPropositions = [
        { subject: 'Humans', predicate: 'Mortal', type: Type.A },
        { subject: 'Cats', predicate: 'Cute', type: Type.A },
        { subject: 'Dogs', predicate: 'Loyal', type: Type.A }
    ];

    expect(() => new Polysyllogism(2, invalidPropositions)).toThrow('The given propositions do not make a syllogism');
});

let validityChecker : ValidityChecker; 

test('ValidityChecker: polysyllogisme valide, toutes les regles', () => {
    validityChecker =  new ValidityChecker([true, true, true, true, true, true, true, true])
    const polysyllogism= new Polysyllogism(2, propositions);
    expect(validityChecker.checkValidity(polysyllogism)).toBe(true);
});

test('ValidityChecker: polysyllogisme qui est valide si seulement Rmt et Raa sont appliquees mais qui est invalide sinon', () => {
    const propositions : Array<PropositionParameter>= [
        { subject: 'Humans', predicate: 'Mortal', type: Type.O },
        { subject: 'Beings', predicate: 'Mortal', type: Type.O },
        { subject: 'Humans', predicate: 'Beings', type: Type.A }
    ];
    const polysyllogism : Polysyllogism= new Polysyllogism(2, propositions)
    validityChecker =  new ValidityChecker([true, true, true, true, true, true, true, true])
    expect(validityChecker.checkValidity(polysyllogism)).toBe(false);
    
    validityChecker = new ValidityChecker([true, false, true, false, false, false, false, false]);
    expect(validityChecker.checkValidity(polysyllogism)).toBe(true); // Some rules not applied
});

test('ValidityChecker: checkUninteresting pour polysyllogisme ininteressant', ()=>{
    const propositions : Array<PropositionParameter>= [
        { subject: 'Chat', predicate: 'Gris', type: Type.A },
        { subject: 'Gris', predicate: 'Animal', type: Type.A },
        { subject: 'Chat', predicate: 'Animal', type: Type.I }
    ];
    const polysyllogism : Polysyllogism= new Polysyllogism(2, propositions)
    validityChecker =  new ValidityChecker([true, true, true, true, true, true, true, false])
    expect(validityChecker.checkUninteresting(polysyllogism)).toBe(true);
})

test('ValidityChecker: checkUninteresting pour polysyllogisme universel', ()=>{
    const propositions : Array<PropositionParameter>= [
        { subject: 'Chat', predicate: 'Gris', type: Type.A },
        { subject: 'Gris', predicate: 'Animal', type: Type.A },
        { subject: 'Chat', predicate: 'Animal', type: Type.A }
    ];
    const polysyllogism : Polysyllogism= new Polysyllogism(2, propositions)
    validityChecker =  new ValidityChecker([true, true, true, true, true, true, true, false])
    expect(validityChecker.checkUninteresting(polysyllogism)).toBe(false);
})

test('ValidityChecker: checkUninteresting pour polysyllogisme non ininteressant', ()=>{
    const propositions : Array<PropositionParameter>= [
        { subject: 'Gris', predicate: 'Animal', type: Type.I },
        { subject: 'Gris', predicate: 'Chat', type: Type.A },
        { subject: 'Chat', predicate: 'Animal', type: Type.I }
    ];
    const polysyllogism : Polysyllogism= new Polysyllogism(2, propositions)
    validityChecker =  new ValidityChecker([true, true, true, true, true, true, true, false])
    expect(validityChecker.checkUninteresting(polysyllogism)).toBe(false);
})

test('test Figure 1 : devrait valider un syllogisme de figure 1', () => {
    const propositions: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.A },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    
    expect(() => new Polysyllogism(2, propositions)).not.toThrow();
});

test('test Figure 2 : devrait valider un syllogisme de figure 2', () => {
    const propositions: PropositionParameter[] = [
        { subject: "P", predicate: "M", type: Type.E },
        { subject: "S", predicate: "M", type: Type.A },
        { subject: "S", predicate: "P", type: Type.E }
    ];
    
    expect(() => new Polysyllogism(2, propositions)).not.toThrow();
});

test('test Figure 4 : devrait valider un syllogisme de figure 3', () => {
    const propositions: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "M", predicate: "S", type: Type.A },
        { subject: "S", predicate: "P", type: Type.I }
    ];
    
    expect(() => new Polysyllogism(2, propositions)).not.toThrow();
});

test('test Figure 4 : devrait valider un syllogisme de figure 4', () => {
    const propositions: PropositionParameter[] = [
        { subject: "P", predicate: "M", type: Type.A },
        { subject: "M", predicate: "S", type: Type.A },
        { subject: "S", predicate: "P", type: Type.I }
    ];
    
    expect(() => new Polysyllogism(2, propositions)).not.toThrow();
});

test('devrait rejeter une structure avec des termes qui ne se suivent pas d\'une proposition à une autre', () => {
    const propositions: PropositionParameter[] = [
        { subject: "A", predicate: "B", type: Type.A },
        { subject: "X", predicate: "Y", type: Type.A },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    
    expect(() => new Polysyllogism(2, propositions)).toThrow();
});

test('devrait traiter correctement un terme isolé', () => {
    const propositions: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "M", predicate: "X", type: Type.A },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    
    expect(() => new Polysyllogism(2, propositions)).toThrow();
});

test('PredicateCisPredicate1 : devrait gérer correctement le cas où PredicateCisPredicate1 est false', () => {
    const propositions: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.A },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    
    expect(() => new Polysyllogism(2, propositions)).not.toThrow();
});

test('presence_array = curr_prop : devrait gérer le cas où presence_array[0] égale curr_prop', () => {
    const propositions: PropositionParameter[] = [
        { subject: "P", predicate: "M", type: Type.A },
        { subject: "M", predicate: "S", type: Type.A },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    
    expect(() => new Polysyllogism(2, propositions)).not.toThrow();
});

test('toString : devrait retourner une chaîne correcte', () => {
    const propositions: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.A },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    
    const poly = new Polysyllogism(2, propositions);
    const result = poly.toString();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
});

test('Rn : devrait gérer les cas particuliers de la règle Rn', () => {
    const checker = new ValidityChecker([false, false, false, false, false, true, false, false]);
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.E },
        { subject: "S", predicate: "M", type: Type.A },
        { subject: "S", predicate: "P", type: Type.I }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(checker.checkValidity(poly)).toBe(false);
});

test('Ruu : devrait gérer le cas limite de Ruu avec des propositions universelles et particulières mélangées', () => {
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.I },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRuu(poly)).toBe(false);
});

test('Rpp : devrait gérer le cas spécial de Rpp avec deux prémisses particulières en positions non consécutives', () => {
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.I },
        { subject: "S", predicate: "M", type: Type.A },
        { subject: "S", predicate: "N", type: Type.I },
        { subject: "N", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRpp(poly)).toBe(false);
});

test('Rn : devrait gérer le cas limite de Rn sans prémisses négatives', () => {
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.A },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRn(poly)).toBe(true);
});

test('getTerm : devrait récupérer le prédicat quand getTerm est appelé avec false', () => {
    const prop = new Proposition("Sujet", "Predicat", Type.A);
    expect(prop.getTerm(false)).toBe("Predicat");
});

test('checkStructure : devrait gérer les apparitions invalides de termes dans checkStructure', () => {
    expect(() => {
        const premises: PropositionParameter[] = [
            { subject: "A", predicate: "B", type: Type.A },
            { subject: "C", predicate: "D", type: Type.A },
            { subject: "E", predicate: "F", type: Type.A }
        ];
        new Polysyllogism(2, premises);
    }).toThrow("The given propositions do not make a syllogism");
});

test('Pn non trouvé : devrait gérer le cas où P1 ou Pn ne sont pas trouvés', () => {
    expect(() => {
        const premises: PropositionParameter[] = [
            { subject: "X", predicate: "Y", type: Type.A },
            { subject: "Y", predicate: "Z", type: Type.A },
            { subject: "A", predicate: "B", type: Type.A }
        ];
        new Polysyllogism(2, premises);
    }).toThrow("The given propositions do not make a syllogism");
});

test('Plus de 2 fois un terme : devrait gérer le cas où un terme apparaît plus de deux fois', () => {
    expect(() => {
        const premises: PropositionParameter[] = [
            { subject: "M", predicate: "P", type: Type.A },
            { subject: "M", predicate: "S", type: Type.A },
            { subject: "M", predicate: "Q", type: Type.A }
        ];
        new Polysyllogism(2, premises);
    }).toThrow("The given propositions do not make a syllogism");
});

test('checkRule dif config : devrait valider la règle checkRule avec différentes configurations', () => {
    const checker = new ValidityChecker([true, true, false, true]);
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.E },
        { subject: "S", predicate: "P", type: Type.E }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    
    for(let i = 0; i < 8; i++) {
        checker['checkRule'](i, poly);
    }
});

test('verifyRpp : devrait vérifier les conditions spéciales de verifyRpp', () => {
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.I },
        { subject: "S", predicate: "M", type: Type.O },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRpp(poly)).toBe(false);
});

test('terme_appearance : devrait gérer les erreurs de terme_appearance undefined', () => {
    expect(() => {
        const premises: PropositionParameter[] = [
            { subject: "A", predicate: "B", type: Type.A },
            { subject: "C", predicate: "D", type: Type.A },
            { subject: "A", predicate: "D", type: Type.A }
        ];
        new Polysyllogism(2, premises);
    }).toThrow();
});

test('devrait tester tous les types de propositions', () => {
    const proposition = new Proposition("S", "P", Type.A);
    expect(proposition.isUniversal()).toBe(true);
    expect(proposition.isAffirmative()).toBe(true);

    const proposition2 = new Proposition("S", "P", Type.E);
    expect(proposition2.isUniversal()).toBe(true);
    expect(proposition2.isAffirmative()).toBe(false);
});

test('ValidityChecker : devrait retourner true quand la règle est désactivée', () => {
    const checker = new ValidityChecker([false]);
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.I },
        { subject: "S", predicate: "M", type: Type.O },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(checker['checkRule'](0, poly)).toBe(true);
});

test('Rn : devrait gérer le cas spécial où Rn rencontre une prémisse non négative', () => {
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.E },
        { subject: "S", predicate: "P", type: Type.O }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRn(poly)).toBe(true);
});

test('Ruu : devrait gérer les cas limites de Ruu', () => {
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.I },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRuu(poly)).toBe(false);
});

test('Rpp : devrait gérer le cas où la première prémisse est particulière pour Rpp', () => {
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.I },
        { subject: "S", predicate: "M", type: Type.A }, 
        { subject: "S", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRpp(poly)).toBe(true);
});

test('Rmt : devrait gérer le cas où Rmt vérifie le terme moyen dans la seconde prémisse', () => {
    const premises: PropositionParameter[] = [
        { subject: "P", predicate: "M", type: Type.I },
        { subject: "S", predicate: "M", type: Type.E },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRmt(poly)).toBe(true);
});

test('CheckRule : devrait tester toutes les branches de checkRule', () => {
    const checker = new ValidityChecker([true, true, true, true, true, true, true, true]);
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.I },
        { subject: "S", predicate: "P", type: Type.O }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    
    for (let i = 0; i < 9; i++) {
        checker['checkRule'](i, poly);
    }
});

test('Rn : devrait gérer le cas particulier de Rn avec prémisses affirmatives', () => {
    const premises: PropositionParameter[] = [
        { subject: "M", predicate: "P", type: Type.A },
        { subject: "S", predicate: "M", type: Type.A },
        { subject: "S", predicate: "P", type: Type.A }
    ];
    const poly = new Polysyllogism(premises.length - 1, premises);
    expect(Rules.verifyRn(poly)).toBe(true);
});