import { DependencyGraph, INormalizedAlert, IImportResultDto, IAnyObjectDto } from "alcuin-config-api";
export interface IWithLevel<T> {
    content: T;
    level: number;
}
export declare function getAllFailingId(file: IImportResultDto): IterableIterator<string>;
export declare function objectToString(obj?: IAnyObjectDto): string | undefined;
export declare function printObject(obj?: IAnyObjectDto): void;
export declare function printChildren(first: string, g: DependencyGraph): void;
export declare function errorToString(error?: INormalizedAlert): string | undefined;
export declare function printInducedFailures(g: DependencyGraph, resultFile: IImportResultDto): void;
