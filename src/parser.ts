import { parse as peggyParse } from "./peggy-parser/generated";
import { ER, ERSchema } from "./types/ER";

// type safe wrapper for the parser generated by peggy
export const parse = (erString: string): ER => {
    const parsed = peggyParse(erString);
    return ERSchema.parse(parsed);
} 
