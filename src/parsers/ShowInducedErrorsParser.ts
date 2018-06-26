import { ArgumentParser } from "argparse";
import { printInducedFailures } from "../utils";
import { IParser } from "../Parser";
import { DependencyGraph, readExportFile, readResultFile, createIndex } from "alcuin-config-api";

const result: IParser = {
    get name() { return "show-induced-errors"; },
    add(parser: ArgumentParser): void {
        parser.addArgument(["-s", "--source"], { required: true });
        parser.addArgument(["-e", "--result"], { required: true });
    },
    handle(args: any): void {
        const source = readExportFile(args.source);
        const results = readResultFile(args.result);

        const index = createIndex(source);
        const graph = new DependencyGraph(index);

        printInducedFailures(graph, results);
    },
};

export default result;
