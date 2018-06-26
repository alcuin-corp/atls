import { IParserArgs as IVisitParserArgs } from "./VisitParser";
import { IParserArgs as IShowInducedErrorsParser } from "./ShowInducedErrorsParser";

export type AnyParser =
    | IVisitParserArgs
    | IShowInducedErrorsParser
    ;
