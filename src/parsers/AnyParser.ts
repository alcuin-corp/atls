import { IVisitParserArgs } from "./VisitParser";
import { IShowInducedErrorsParser } from "./ShowInducedErrorsParser";

export type AnyParser =
    | IVisitParserArgs
    | IShowInducedErrorsParser
    ;
