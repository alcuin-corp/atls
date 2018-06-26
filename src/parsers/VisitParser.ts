import { ArgumentParser } from "argparse";
import { IParser } from "../Parser";
import { DependencyGraph, createIndex, readExportFile, IVisitAllOptions } from "alcuin-config-api";
import { getName } from "alcuin-config-api";
import { AnyParser } from "./AnyParser";

const PARENTS_OF = "parents-of";
const CHILDREN_OF = "children-of";

export const VISIT_CMD = "visit";

export interface IParserArgs {
    parser_id: typeof VISIT_CMD;
    direction:
        | typeof PARENTS_OF
        | typeof CHILDREN_OF;
    id: string;
    source: string;
    recursive?: boolean;
    depth?: number;
    copy?: boolean;
    out?: string;
    exclude_type: string[];
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

        const group = parser.addMutuallyExclusiveGroup();
        group.addArgument(["-R", "--recursive"], {
            action: "storeTrue",
            help: "this visit the tree recursively without depth limitation",
        });
        group.addArgument(["-D", "--depth"], {
            help: "this perform a recursive visit with an arbitrary maximum depth (included)",
        });

        const group2 = parser.addMutuallyExclusiveGroup();
        group2.addArgument("--exclude-type", {
            defaultValue: [],
            nargs: "*",
            help: "excludes those objects types",
        });

        parser.addArgument(["-c", "--copy"], {
            help: "this option generates new ids and codes for all the items that are visited",
        });
        parser.addArgument(["-o", "--out"], {
            help: "saves the result in a importable JSON file",
        });
    },
    handle(args: AnyParser): void {
        if (args.parser_id === VISIT_CMD) {
            const index = createIndex(readExportFile(args.source));
            const graph = new DependencyGraph(index);

            const excludeTypesSet = new Set<string>(args.exclude_type);

            const visitOptions: IVisitAllOptions = {
                maxDepth: args.recursive ? undefined : (args.depth || 1),
            };

            graph.visitAllChildren(args.id, (obj, depth) => {
                if (!excludeTypesSet.has(obj.ObjectType)) {
                    console.log(`${obj.Id} - ${obj.ObjectType} (depth: ${depth}) => '${getName(obj)}'`);
                }
            }, visitOptions);
        }
    },
};

export default result;
