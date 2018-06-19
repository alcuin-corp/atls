"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function isApiError(alert) {
    return "ApiError" in alert;
}
exports.isApiError = isApiError;
function getAlertId(alert) {
    if (isApiError(alert)) {
        return alert.Id;
    }
    return alert.ObjectId;
}
exports.getAlertId = getAlertId;
function normErr(err) {
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
    }
    else {
        return {
            ObjectId: err.ObjectId,
            Message: err.Message,
            Status: 500,
            ObjectType: err.ObjectType,
            StackTrace: err.StackTrace,
        };
    }
}
exports.normErr = normErr;
function isExportFile(file) {
    return "Content" in file;
}
exports.isExportFile = isExportFile;
function isResultFile(file) {
    return "Alerts" in file;
}
exports.isResultFile = isResultFile;
function createIndex(e) {
    return e.Content.Added.reduce((acc, item) => acc.set(item.Id, item), new Map());
}
exports.createIndex = createIndex;
function readJSON(fileName) {
    const buffer = fs_1.default.readFileSync(fileName);
    const json = buffer.toString();
    const data = JSON.parse(json);
    return data;
}
exports.readJSON = readJSON;
function readExportFile(fileName) {
    const file = readJSON(fileName);
    if (isExportFile(file)) {
        return file;
    }
    throw new Error(`File ${fileName} is not a proper export file.`);
}
exports.readExportFile = readExportFile;
function readResultFile(fileName) {
    const file = readJSON(fileName);
    if (isResultFile(file)) {
        return file;
    }
    throw new Error(`File ${fileName} is not a proper result file.`);
}
exports.readResultFile = readResultFile;
function getName(obj) {
    if (obj.Name) {
        return obj.Name["fr-FR"] || "no name";
    }
    return "no name";
}
exports.getName = getName;
function* getAllFailingId(file) {
    for (const err of file.Alerts) {
        if (isApiError(err)) {
            yield err.Id;
        }
        else {
            yield err.ObjectId;
        }
    }
}
exports.getAllFailingId = getAllFailingId;
function objectToString(obj) {
    if (obj) {
        return `"${getName(obj)}" (${obj.ObjectType}: ${obj.Id})`;
    }
}
exports.objectToString = objectToString;
function printObject(obj) {
    if (obj) {
        console.log(objectToString(obj));
    }
}
exports.printObject = printObject;
function printAllChildren(first, g) {
    const tabIt = (n) => {
        let i = -1;
        let r = "";
        while (++i < n) {
            r = r + "\t";
        }
        return r;
    };
    g.visitAllChildren(first, (obj, lvl) => {
        console.log(`${tabIt(lvl)}${objectToString(obj)}`);
    });
}
exports.printAllChildren = printAllChildren;
function errorToString(error) {
    if (error) {
        return `${error.Status} => "${error.Message}" (${error.ObjectId})`;
    }
}
exports.errorToString = errorToString;
function printAllInducedFailures(g, resultFile) {
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
exports.printAllInducedFailures = printAllInducedFailures;
//# sourceMappingURL=utils.js.map