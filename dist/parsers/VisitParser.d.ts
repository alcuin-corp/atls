import { IParser } from "../Parser";
declare const PARENTS_OF = "parents-of";
declare const CHILDREN_OF = "children-of";
export declare const VISIT_CMD = "visit";
export interface IParserArgs {
    parser_id: typeof VISIT_CMD;
    direction: typeof PARENTS_OF | typeof CHILDREN_OF;
    id: string;
    source: string;
    recursive?: boolean;
    depth?: number;
    copy?: boolean;
    out?: string;
    exclude_type: string[];
}
declare const result: IParser;
export default result;
