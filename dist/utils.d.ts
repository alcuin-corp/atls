import { DependencyGraph, IExportDto, INormalizedAlert, IImportResultDto, IAnyObjectDto } from "alcuin-config-api";
export interface IWithLevel<T> {
    content: T;
    level: number;
}
export declare function createIndex(e: IExportDto): Map<string, IAnyObjectDto>;
export declare function getName(obj: IAnyObjectDto): string;
export declare function getAllFailingId(file: IImportResultDto): IterableIterator<string>;
export declare function objectToString(obj?: IAnyObjectDto): string | undefined;
export declare function printObject(obj?: IAnyObjectDto): void;
export declare function printAllChildren(first: string, g: DependencyGraph): void;
export declare function errorToString(error?: INormalizedAlert): string | undefined;
export declare function printAllInducedFailures(g: DependencyGraph, resultFile: IImportResultDto): void;
