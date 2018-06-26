import { ArgumentParser } from "argparse";
import { printInducedFailures } from "../utils";
import { IParser } from "../Parser";
import { DependencyGraph, readExportFile, readResultFile, createIndex } from "alcuin-config-api";
import { AnyParser } from "./AnyParser";

export const SHOW_INDUCED_ERRORS_CMD = "show-induced-errors";

export interface IParserArgs {
    parser_id: typeof SHOW_INDUCED_ERRORS_CMD;
    source: string;
    result: string;
}

const result: IParser = {
    get name() { return SHOW_INDUCED_ERRORS_CMD; },
    add(parser: ArgumentParser): void {
        parser.addArgument(["-s", "--source"], { required: true });
        parser.addArgument(["-e", "--result"], { required: true });
    },
    handle(args: AnyParser): void {
        if (args.parser_id === SHOW_INDUCED_ERRORS_CMD) {
            const source = readExportFile(args.source);
            const results = readResultFile(args.result);

            const index = createIndex(source);
            const graph = new DependencyGraph(index);

            printInducedFailures(graph, results);
        }
    },
};

export default result;
