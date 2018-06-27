import { ArgumentParser } from "argparse";
import { IParser } from "../Parser";
import { DependencyGraph, createIndex, readExportFile, IVisitAllOptions, IAnyObjectDto } from "alcuin-config-api";
import { getName } from "alcuin-config-api";
import { AnyParser } from "./AnyParser";
import fs from "fs";
import uuidv4 from "uuid/v4";

const PARENTS_OF = "parents-of";
const CHILDREN_OF = "children-of";

export const VISIT_CMD = "visit";

type Visitor = (obj: IAnyObjectDto, depth: number) => void;
type Decorator = (fn: Visitor) => Visitor;

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

function generateNewGuids(args: IVisitParserArgs, objects: IAnyObjectDto[]) {
    if (args.newGuid) {
        const guidChanges = new Map<string, string>();

        for (const obj of objects) {
            if (args.newGuid) {
                guidChanges.set(obj.Id, uuidv4());
            }
        }

        function replaceAll(value: string, regex: RegExp): string {
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

        function lookUpForGuids(obj: any): void {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const element = obj[key];
                    if (typeof(element) === "string") {
                        obj[key] = replaceAll(
                            element,
                            /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gm);
                    } else {
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

function writeToFile(args: IVisitParserArgs, objects: IAnyObjectDto[]) {
    if (args.out) {
        fs.writeFileSync(args.out, JSON.stringify({ Content: { Added: objects }}, null, args.pretty ? 2 : undefined));
    }
}

export interface IVisitParserArgs {
    parserId: typeof VISIT_CMD;
    direction:
        | typeof PARENTS_OF
        | typeof CHILDREN_OF;
    id: string;
    source: string;
    recursive?: boolean;
    depth?: number;
    newGuid?: boolean;
    out?: string;
    pretty?: boolean;
    // print?: boolean;
    // excludeType: string[];
}

const result: IParser = {
    get name() { return VISIT_CMD; },
    add(parser: ArgumentParser): void {
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
    handle(args: AnyParser): void {
        if (args.parserId === VISIT_CMD) {
            const index = createIndex(readExportFile(args.source));
            const graph = new DependencyGraph(index);

            const visitOptions: IVisitAllOptions = {
                maxDepth: args.recursive ? undefined : (args.depth || 1),
            };

            const objects: IAnyObjectDto[] = [];

            graph.visitAllChildren(args.id, (obj) => { objects.push(obj); }, visitOptions);

            generateNewGuids(args, objects);
            writeToFile(args, objects);
        }
    },
};

export default result;
