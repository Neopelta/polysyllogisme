import { Type } from "./enums"; 

export class Proposition {
    subject: string;
    predicate: string;
    type: Type;

    constructor(subject: string, predicate: string, type: Type) {
        this.subject = subject;
        this.predicate = predicate;
        this.type = type;
    }

    getString(): string {
        // Retourne une représentation textuelle de la proposition
        return `${this.subject} ${this.predicate}`;
    }
}
