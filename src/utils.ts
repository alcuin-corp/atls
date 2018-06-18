import fs from "fs";

export interface ExportFile {
    Content: {
        Added: AnyObject[],
    };
}

export interface ResultFile {
    Alerts: AnyAlert[];
}

export type AnyFile = ExportFile | ResultFile;

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
        Details: {[key: string]: string};
        Reason: string;
        StackTrace: string;
        ValidationErrors?: string[];
    };
}

export type AnyAlert = ApiAlert | ServiceAlert;

export interface NormalizedAlert {
    ObjectId: string;
    Message: string;
    Status: number;
    ObjectType: string;
    StackTrace: string;
}

export function isApiError(alert: AnyAlert): alert is ApiAlert {
    return "ApiError" in alert;
}

export function getAlertId(alert: AnyAlert): string {
    if (isApiError(alert)) {
        return alert.Id;
    }
    return alert.ObjectId;
}

export function normErr(err: AnyAlert): NormalizedAlert {
    if (isApiError(err)) {
        const result = {
            ObjectId: err.Id,
            Message: err.ApiError.Reason,
            Status: err.ApiError.Status,
            ObjectType: err.ObjectType,
            StackTrace: err.ApiError.StackTrace,
        };
        if (err.ApiError.ValidationErrors) {
            result.Message += " (" + err.ApiError.ValidationErrors.join(", ") + ")";
        }
        return result;
    } else {
        return {
            ObjectId: err.ObjectId,
            Message: err.Message,
            Status: 500,
            ObjectType: err.ObjectType,
            StackTrace: err.StackTrace,
        };
    }
}

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

export interface WithLevel<T> { content: T; level: number; }

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

    public get(id: string): AnyObject | undefined {
        return this.index.get(id);
    }

    public childrenOf(id: string): string[] {
        return this.children.get(id) || [];
    }

    public parentsOf(id: string): string[] {
        return this.parents.get(id) || [];
    }

    public visitAll<T>(id: string,
                       followings: (id: string) => string[],
                       visitor: (obj: AnyObject, lvl: number) => T): T[] {
        const result: T[] = [];
        const stack: Array<{currentId: string, currentLevel: number}> = [];
        stack.push({currentId: id, currentLevel: 0});
        while (true) {
            const pop = stack.pop();
            if (!pop) { break; }

            const {currentId, currentLevel} = pop;
            const content = this.get(currentId);
            if (content) {
                if (content.Id !== id) {
                    result.push(visitor(content, currentLevel));
                }
                for (const childId of followings(content.Id)) {
                    stack.push({currentId: childId, currentLevel: currentLevel + 1});
                }
            }
        }
        return result;
    }

    public visitAllChildren<T>(id: string, visitor: (obj: AnyObject, lvl: number) => T): T[] {
        return this.visitAll(id, this.childrenOf.bind(this), visitor);
    }

    public getAllChildren(id: string): AnyObject[] {
        return this.visitAllChildren(id, (obj, _) => obj);
    }

    public visitAllParents<T>(id: string, visitor: (obj: AnyObject, lvl: number) => T): T[] {
        return this.visitAll(id, this.parentsOf.bind(this), visitor);
    }

    public getAllParents(id: string): AnyObject[] {
        return this.visitAllParents(id, (obj, _) => obj);
    }
}

export function isExportFile(file: AnyFile): file is ExportFile {
    return "Content" in file;
}

export function isResultFile(file: AnyFile): file is ResultFile {
    return "Alerts" in file;
}

export function createIndex(e: ExportFile): Map<string, AnyObject> {

    return e.Content.Added.reduce((acc, item) => acc.set(item.Id, item), new Map<string, AnyObject>());
}

export function readJSON(fileName: string): AnyFile {
    const buffer = fs.readFileSync(fileName);
    const json = buffer.toString();
    const data = JSON.parse(json) as AnyFile;
    return data;
}

export function readExportFile(fileName: string): ExportFile {
    const file = readJSON(fileName);
    if (isExportFile(file)) {
        return file;
    }
    throw new Error(`File ${fileName} is not a proper export file.`);
}

export function readResultFile(fileName: string): ResultFile {
    const file = readJSON(fileName);
    if (isResultFile(file)) {
        return file;
    }
    throw new Error(`File ${fileName} is not a proper result file.`);
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

export function getName(obj: AnyObject): string {
    if (obj.Name) {
        return obj.Name["fr-FR"] || "no name";
    }
    return "no name";
}

export function *getAllFailingId(file: ResultFile): IterableIterator<string> {
    for (const err of file.Alerts) {
        if (isApiError(err)) {
            yield err.Id;
        } else {
            yield err.ObjectId;
        }
    }
}

export function findParents(index: Map<string, AnyObject>): Map<string, string[]> {
    return Array.from(index, ([id, o]) => {
        const refs = Array.from(findReferences(o));
        return {id, refs};
    }).reduce((acc, {id, refs}) => acc.set(id, refs), new Map<string, string[]>());
}

export function objectToString(obj?: AnyObject): string | undefined {
    if (obj) {
        return `"${getName(obj)}" (${obj.ObjectType}: ${obj.Id})`;
    }
}

export function printObject(obj?: AnyObject): void {
    if (obj) { console.log(objectToString(obj)); }
}

export function printAllChildren(first: string, g: Graph): void {
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

export function errorToString(error?: NormalizedAlert): string | undefined {
    if (error) {
        return `${error.Status} => "${error.Message}" (${error.ObjectId})`;
    }
}

export function printAllInducedFailures(g: Graph, resultFile: ResultFile) {
    const alerts = resultFile.Alerts.map((a) => normErr(a));

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