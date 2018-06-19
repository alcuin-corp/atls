import { Graph } from "alcuin-tools";
export interface IExportFile {
    Content: {
        Added: IAnyObject[];
    };
}
export interface IResultFile {
    Alerts: AnyAlert[];
}
export declare type AnyFile = IExportFile | IResultFile;
export interface IServiceAlert {
    Progress: number;
    Type: string;
    Name: "ServiceError";
    StackTrace: string;
    ObjectId: string;
    ObjectType: string;
    Message: string;
}
export interface IApiAlert {
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
export declare type AnyAlert = IApiAlert | IServiceAlert;
export interface INormalizedAlert {
    ObjectId: string;
    Message: string;
    Status: number;
    ObjectType: string;
    StackTrace: string;
}
export declare function isApiError(alert: AnyAlert): alert is IApiAlert;
export declare function getAlertId(alert: AnyAlert): string;
export declare function normErr(err: AnyAlert): INormalizedAlert;
export interface IResource {
    ["fr-FR"]: string;
    ["en-US"]: string;
}
export interface IAnyObject {
    Id: string;
    ObjectType: string;
    Name?: IResource;
}
export interface IWithLevel<T> {
    content: T;
    level: number;
}
export declare function isExportFile(file: AnyFile): file is IExportFile;
export declare function isResultFile(file: AnyFile): file is IResultFile;
export declare function createIndex(e: IExportFile): Map<string, IAnyObject>;
export declare function readJSON(fileName: string): AnyFile;
export declare function readExportFile(fileName: string): IExportFile;
export declare function readResultFile(fileName: string): IResultFile;
export declare function getName(obj: IAnyObject): string;
export declare function getAllFailingId(file: IResultFile): IterableIterator<string>;
export declare function objectToString(obj?: IAnyObject): string | undefined;
export declare function printObject(obj?: IAnyObject): void;
export declare function printAllChildren(first: string, g: Graph): void;
export declare function errorToString(error?: INormalizedAlert): string | undefined;
export declare function printAllInducedFailures(g: Graph, resultFile: IResultFile): void;
