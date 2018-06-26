import {
    DependencyGraph,
    isApiAlertDto,
    INormalizedAlert,
    normalizeAlert,
    IImportResultDto,
    IAnyObjectDto,
    getName,
} from "alcuin-config-api";

export interface IWithLevel<T> { content: T; level: number; }

export function *getAllFailingId(file: IImportResultDto): IterableIterator<string> {
    for (const err of file.Alerts) {
        if (isApiAlertDto(err)) {
            yield err.Id;
        } else {
            yield err.ObjectId;
        }
    }
}

export function objectToString(obj?: IAnyObjectDto): string | undefined {
    if (obj) {
        return `"${getName(obj)}" (${obj.ObjectType}: ${obj.Id})`;
    }
}

export function printObject(obj?: IAnyObjectDto): void {
    if (obj) { console.log(objectToString(obj)); }
}

export function printChildren(first: string, g: DependencyGraph): void {
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

export function printInducedFailures(g: DependencyGraph, resultFile: IImportResultDto) {
    const alerts = resultFile.Alerts.map((a) => normalizeAlert(a));

    for (const alert of alerts) {
        const children = g.allChildrenOf(alert.ObjectId);
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
