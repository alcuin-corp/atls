import { IParser } from "../Parser";
export declare const SHOW_INDUCED_ERRORS_CMD = "show-induced-errors";
export interface IShowInducedErrorsParser {
    parserId: typeof SHOW_INDUCED_ERRORS_CMD;
    source: string;
    result: string;
}
declare const result: IParser;
export default result;
