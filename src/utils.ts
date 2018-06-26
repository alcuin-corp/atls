import fs from "fs";
import {
    DependencyGraph,
    IExportDto,
    isExportDto,
    AnyAlert,
    isApiAlertDto,
    INormalizedAlert,
    normalizeAlert,
} from "alcuin-config-api";

export interface IResource {
    ["fr-FR"]: string;
    ["en-US"]: string;
}

export interface IResultFile {
    Alerts: AnyAlert[];
}

export function isResultFile(file: AnyFile): file is IResultFile {
    return "Alerts" in file;
}

export type AnyFile = IExportDto | IResultFile;

export interface IAnyObject {
    Id: string;
    ObjectType: string;
    Name?: IResource;
}

export interface IWithLevel<T> { content: T; level: number; }

export function createIndex(e: IExportDto): Map<string, IAnyObject> {
    return e.Content.Added.reduce((acc, item) => acc.set(item.Id, item), new Map<string, IAnyObject>());
}

export function readJSON(fileName: string): AnyFile {
    const buffer = fs.readFileSync(fileName);
    const json = buffer.toString();
    const data = JSON.parse(json) as AnyFile;
    return data;
}

export function readExportFile(fileName: string): IExportDto {
    const file = readJSON(fileName);
    if (isExportDto(file)) {
        return file;
    }
    throw new Error(`File ${fileName} is not a proper export file.`);
}

export function readResultFile(fileName: string): IResultFile {
    const file = readJSON(fileName);
    if (isResultFile(file)) {
        return file;
    }
    throw new Error(`File ${fileName} is not a proper result file.`);
}

export function getName(obj: IAnyObject): string {
    if (obj.Name) {
        return obj.Name["fr-FR"] || "no name";
    }
    return "no name";
}

export function *getAllFailingId(file: IResultFile): IterableIterator<string> {
    for (const err of file.Alerts) {
        if (isApiAlertDto(err)) {
            yield err.Id;
        } else {
            yield err.ObjectId;
        }
    }
}

export function objectToString(obj?: IAnyObject): string | undefined {
    if (obj) {
        return `"${getName(obj)}" (${obj.ObjectType}: ${obj.Id})`;
    }
}

export function printObject(obj?: IAnyObject): void {
    if (obj) { console.log(objectToString(obj)); }
}

export function printAllChildren(first: string, g: DependencyGraph): void {
    const tabIt: (n: number) => string = (n) => {
        let i = -1;
        let r = "";
        while (++i < n) { r = r + "\t"; }
        return r;
    };
    g.visitAllChildren(first, (obj, lvl) => {
        console.log(`${tabIt(lvl)}${objectToString(obj)}`);
    });
}

export function errorToString(error?: INormalizedAlert): string | undefined {
    if (error) {
        return `${error.Status} => "${error.Message}" (${error.ObjectId})`;
    }
}

export function printAllInducedFailures(g: DependencyGraph, resultFile: IResultFile) {
    const alerts = resultFile.Alerts.map((a) => normalizeAlert(a));

    for (const alert of alerts) {
        const children = g.getAllChildren(alert.ObjectId);
        if (children.length !== 0) {
            console.log(errorToString(alert));
            console.log(objectToString(g.get(alert.ObjectId)));
            console.log("INDUCES ERRORS:\n");
        }

        for (const child of children) {
            const inducedAlert = alerts.find((_) => _.ObjectId === child.Id);
            if (inducedAlert) {
                console.log(`\t${errorToString(inducedAlert)}\n`);
            }
        }
    }
}
