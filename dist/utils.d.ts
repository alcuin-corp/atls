export interface ExportFile {
    Content: {
        Added: AnyObject[];
    };
}
export interface ResultFile {
    Alerts: AnyAlert[];
}
export declare type AnyFile = ExportFile | ResultFile;
export interface ServiceAlert {
    Progress: number;
    Type: string;
    Name: "ServiceError";
    StackTrace: string;
    ObjectId: string;
    ObjectType: string;
    Message: string;
}
export interface ApiAlert {
    Progress: number;
    Id: string;
    Type: string;
    Name: string;
    Message: string;
    ObjectType: string;
    ApiError: {
        Status: number;
        Details: {
            [key: string]: string;
        };
        Reason: string;
        StackTrace: string;
        ValidationErrors?: string[];
    };
}
export declare type AnyAlert = ApiAlert | ServiceAlert;
export interface NormalizedAlert {
    ObjectId: string;
    Message: string;
    Status: number;
    ObjectType: string;
    StackTrace: string;
}
export declare function isApiError(alert: AnyAlert): alert is ApiAlert;
export declare function getAlertId(alert: AnyAlert): string;
export declare function normErr(err: AnyAlert): NormalizedAlert;
export interface IRef {
    TargetId: string;
    IsRef: true;
    RefType: "Required";
}
export interface Resource {
    ["fr-FR"]: string;
    ["en-US"]: string;
}
export interface AnyObject {
    Id: string;
    ObjectType: string;
    Name?: Resource;
}
export interface WithLevel<T> {
    content: T;
    level: number;
}
export declare class Graph {
    private index;
    private parents;
    private children;
    constructor(index: Map<string, AnyObject>);
    get(id: string): AnyObject | undefined;
    childrenOf(id: string): string[];
    parentsOf(id: string): string[];
    visitAll<T>(id: string, followings: (id: string) => string[], visitor: (obj: AnyObject, lvl: number) => T): T[];
    visitAllChildren<T>(id: string, visitor: (obj: AnyObject, lvl: number) => T): T[];
    getAllChildren(id: string): AnyObject[];
    visitAllParents<T>(id: string, visitor: (obj: AnyObject, lvl: number) => T): T[];
    getAllParents(id: string): AnyObject[];
}
export declare function isExportFile(file: AnyFile): file is ExportFile;
export declare function isResultFile(file: AnyFile): file is ResultFile;
export declare function createIndex(e: ExportFile): Map<string, AnyObject>;
export declare function readJSON(fileName: string): AnyFile;
export declare function readExportFile(fileName: string): ExportFile;
export declare function readResultFile(fileName: string): ResultFile;
export declare function isRef(self: any): self is IRef;
export declare function findReferences(self: any): IterableIterator<string>;
export declare function getName(obj: AnyObject): string;
export declare function getAllFailingId(file: ResultFile): IterableIterator<string>;
export declare function findParents(index: Map<string, AnyObject>): Map<string, string[]>;
export declare function objectToString(obj?: AnyObject): string | undefined;
export declare function printObject(obj?: AnyObject): void;
export declare function printAllChildren(first: string, g: Graph): void;
export declare function errorToString(error?: NormalizedAlert): string | undefined;
export declare function printAllInducedFailures(g: Graph, resultFile: ResultFile): void;
