import { ArgumentParser } from "argparse";
import { IParser } from "../Parser";
import { DependencyGraph, createIndex, readExportFile } from "alcuin-config-api/dist";
import { getName } from "alcuin-config-api";

const DUPLICATE_OBJECT = "duplicate-object";

const result: IParser = {
    get name() { return DUPLICATE_OBJECT; },
    add(parser: ArgumentParser): void {
        parser.addArgument("id");
        parser.addArgument("source");

        parser.addArgument(["--ignore-type"], {
            nargs: "*",
        });
    },
    handle(args: any): void {
        const id = args.id;
        const source = readExportFile(args.source);
        const index = createIndex(source);
        const graph = new DependencyGraph(index);
        const ignoredType = new Set<string>(args.ignore_type || []);

        console.log(ignoredType);

        graph.visitAllChildren(id, (obj, lvl) => {
            if (!ignoredType.has(obj.ObjectType)) {
                console.log(`${obj.Id} - ${obj.ObjectType} => '${getName(obj)}'`);
            }
        });
    },
};

export default result;
