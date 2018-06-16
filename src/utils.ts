import fs from "fs";

export interface ExportFile {
    Content: {
        Added: AnyObject[],
    };
}

interface ResultFile {
    Alerts: AnyError[];
}

type AnyFile = ExportFile | ResultFile;

interface ApiError {
    Id: string;
}

interface ServiceError {
    ObjectId: string;
}

type AnyError = ApiError | ServiceError;

export function isApiError(alert: AnyError): alert is ApiError {
    return "Id" in alert;
}

interface AnyObject {
    Id: string;
    ObjectType: string;
}

type LazyObject = AnyObject | string;

export function pump(lo: LazyObject, index: Map<string, AnyObject>): AnyObject {
    if (typeof(lo) === "string") {
        const o = index.get(lo);
        if (!o) {
            throw new Error("not found");
        }
    }
    return lo as AnyObject;
}

export class Graph {
    private parents: Map<string, string[]>;
    private children: Map<string, string[]>;

    constructor(private index: Map<string, AnyObject>) {
        this.parents = findParents(index);
        this.children = new Map<string, string[]>();
        for (const [childId, currentParents] of this.parents.entries()) {
            for (const currentParent of currentParents) {
                this.children.set(currentParent, [...this.children.get(currentParent) || [], childId]);
            }
        }
    }
    public childrenOf(id: string): LazyObject[] {
        return this.children.get(id) || [];
    }
    public parentsOf(id: string): LazyObject[] {
        return this.parents.get(id) || [];
    }
}

function isExportFile(file: AnyFile): file is ExportFile {
    return "Content" in file;
}

function isResultFile(file: AnyFile): file is ResultFile {
    return "Alerts" in file;
}

export function createIndex(e: ExportFile): Map<string, AnyObject> {

    return e.Content.Added.reduce((acc, item) => acc.set(item.Id, item), new Map<string, AnyObject>());
}

export function readExportFile(fileName: string): ExportFile {
    const file = readJSON(fileName);
    if (isExportFile(file)) {
        return file;
    }
    throw new Error(`File ${fileName} is not a proper export file.`);
}

function readJSON(fileName: string): AnyFile {
    const buffer = fs.readFileSync(fileName);
    const json = buffer.toString();
    const data = JSON.parse(json) as AnyFile;
    return data;
}

export function readResultFile(fileName: string): ResultFile {
    const file = readJSON(fileName);
    if (isResultFile(file)) {
        return file;
    }
    throw new Error(`File ${fileName} is not a proper result file.`);
}

export interface IRef {
    TargetId: string;
    IsRef: true;
    RefType: "Required";
}

export function isRef(self: any): self is IRef {
    if (self && typeof(self) === "object") {
        if ("TargetId" in self && "IsRef" in self && "RefType" in self) {
            return true;
        }
    }
    return false;
}

export function* findReferences(self: any): IterableIterator<string> {
    if (self) {
        if (typeof(self) === "object") {
            if (isRef(self)) {
                yield self.TargetId;
            } else {
                for (const entry of Object.entries(self)) {
                    yield *findReferences(entry[1]);
                }
            }
        } else if (Array.isArray(self)) {
            for (const child of self) {
                yield *findReferences(child);
            }
        }
    }
}

export function findParents(index: Map<string, AnyObject>): Map<string, string[]> {
    return Array.from(index, ([id, o]) => {
        const refs = Array.from(findReferences(o));
        return {id, refs};
    }).reduce((acc, {id, refs}) => acc.set(id, refs), new Map<string, string[]>());
}
