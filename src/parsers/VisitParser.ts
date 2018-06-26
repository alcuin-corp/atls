import { ArgumentParser } from "argparse";
import { IParser } from "../Parser";
import { DependencyGraph, createIndex, readExportFile } from "alcuin-config-api";
import { getName } from "alcuin-config-api";

const result: IParser = {
    get name() { return "visit"; },
    add(parser: ArgumentParser): void {
        parser.addArgument("direction", {
            choices: ["parents-of", "children-of"],
            help: "select the visit direction, parents is leafs to roots, children the other way round",
        });
        parser.addArgument("id", {
            help: "the element of which we want to display the siblings",
        });
        parser.addArgument("source", {
            help: "the export source file",
        });
        parser.addArgument(["-R", "--recursive"], {
            help: "this visit the tree recursively (siblings of sibling)",
        });
    },
    handle(args: any): void {
        const index = createIndex(readExportFile(args.source));
        const graph = new DependencyGraph(index);
        const ignoredType = new Set<string>(args.ignore_type || []);

        console.log(ignoredType);

        graph.visitAllChildren(args.id, (obj, _) => {
            if (!ignoredType.has(obj.ObjectType)) {
                console.log(`${obj.Id} - ${obj.ObjectType} => '${getName(obj)}'`);
            }
        });
    },
};

export default result;
