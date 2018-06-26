"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alcuin_config_api_1 = require("alcuin-config-api");
function* getAllFailingId(file) {
    for (const err of file.Alerts) {
        if (alcuin_config_api_1.isApiAlertDto(err)) {
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
        return `"${alcuin_config_api_1.getName(obj)}" (${obj.ObjectType}: ${obj.Id})`;
    }
}
exports.objectToString = objectToString;
function printObject(obj) {
    if (obj) {
        console.log(objectToString(obj));
    }
}
exports.printObject = printObject;
function printChildren(first, g) {
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
exports.printChildren = printChildren;
function errorToString(error) {
    if (error) {
        return `${error.Status} => "${error.Message}" (${error.ObjectId})`;
    }
}
exports.errorToString = errorToString;
function printInducedFailures(g, resultFile) {
    const alerts = resultFile.Alerts.map((a) => alcuin_config_api_1.normalizeAlert(a));
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
exports.printInducedFailures = printInducedFailures;
//# sourceMappingURL=utils.js.map