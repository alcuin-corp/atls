"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alcuin_config_api_1 = require("alcuin-config-api");
const fs_1 = __importDefault(require("fs"));
const v4_1 = __importDefault(require("uuid/v4"));
const PARENTS_OF = "parents-of";
const CHILDREN_OF = "children-of";
exports.VISIT_CMD = "visit";
// const printObjectsToConsole: (args: IVisitParserArgs) => Decorator = (args) => (next) => {
//     function tabit(i: number) {
//         let r = "";
//         for (let c = 0; c < i; c++) {
//             r += "  ┕";
//         }
//         return r;
//     }
//     return (obj, depth) => {
//         if (args.print) {
//             console.log(`${tabit(depth)}${obj.Id} - ${obj.ObjectType} (depth: ${depth}) => '${getName(obj)}'`);
//         }
//         return next(obj, depth);
//     };
// };
// const excludeTypesSetDecorator: (args: IVisitParserArgs) => Decorator = (args) => (next) => {
//     const excludeTypesSet = new Set<string>(args.excludeType);
//     return (obj, depth) => {
//         if (!excludeTypesSet.has(obj.ObjectType)) {
//             next(obj, depth);
//         }
//     };
// };
function generateNewGuids(args, objects) {
    if (args.newGuid) {
        const guidChanges = new Map();
        for (const obj of objects) {
            if (args.newGuid) {
                guidChanges.set(obj.Id, v4_1.default());
            }
        }
        function replaceAll(value, regex) {
            let match = regex.exec(value);
            while (match) {
                for (const guidToRep of match) {
                    const newGuid = guidChanges.get(guidToRep);
                    if (newGuid) {
                        value = value.replace(guidToRep, newGuid);
                    }
                }
                match = regex.exec(value);
            }
            return value;
        }
        function lookUpForGuids(obj) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const element = obj[key];
                    if (typeof (element) === "string") {
                        obj[key] = replaceAll(element, /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gm);
                    }
                    else {
                        lookUpForGuids(obj[key]);
                    }
                }
            }
        }
        for (const o of objects) {
            lookUpForGuids(o);
        }
    }
}
function writeToFile(args, objects) {
    if (args.out) {
        fs_1.default.writeFileSync(args.out, JSON.stringify({ Content: { Added: objects } }, null, args.pretty ? 2 : undefined));
    }
}
const result = {
    get name() { return exports.VISIT_CMD; },
    add(parser) {
        parser.addArgument("direction", {
            choices: [PARENTS_OF, CHILDREN_OF],
            help: "select the visit direction, parents is leafs to roots, children the other way round",
        });
        parser.addArgument("id", {
            help: "the element of which we want to display the siblings",
        });
        parser.addArgument("source", {
            help: "the export source file",
        });
        const recursiveDepth = parser.addMutuallyExclusiveGroup();
        recursiveDepth.addArgument(["-R", "--recursive"], {
            action: "storeTrue",
            help: "this visit the tree recursively without depth limitation",
        });
        recursiveDepth.addArgument(["-D", "--depth"], {
            help: "this perform a recursive visit with an arbitrary maximum depth (included)",
        });
        // const excludeInclude = parser.addMutuallyExclusiveGroup();
        // excludeInclude.addArgument("--exclude-type", {
        //     defaultValue: [],
        //     nargs: "*",
        //     help: "excludes those objects types",
        // });
        parser.addArgument(["--new-guid"], {
            action: "storeTrue",
            help: "this option generates new ids and codes for all the items that are visited",
        });
        parser.addArgument(["--pretty"], {
            action: "storeTrue",
            help: "this option forces pretty printed JSON outputs",
        });
        parser.addArgument(["-o", "--out"], {
            help: "saves the result in a importable JSON file",
        });
        // parser.addArgument(["-p", "--print"], {
        //     action: "storeTrue",
        //     help: "print all the visited objects on screen",
        // });
    },
    handle(args) {
        if (args.parserId === exports.VISIT_CMD) {
            const index = alcuin_config_api_1.createIndex(alcuin_config_api_1.readExportFile(args.source));
            const graph = new alcuin_config_api_1.DependencyGraph(index);
            const visitOptions = {
                maxDepth: args.recursive ? undefined : (args.depth || 1),
            };
            const objects = [];
            graph.visitAllChildren(args.id, (obj) => { objects.push(obj); }, visitOptions);
            generateNewGuids(args, objects);
            writeToFile(args, objects);
        }
    },
};
exports.default = result;
//# sourceMappingURL=VisitParser.js.map