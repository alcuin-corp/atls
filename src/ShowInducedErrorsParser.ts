import { ArgumentParser } from "argparse";
import { readExportFile, readResultFile, createIndex, printAllInducedFailures } from "./utils";
import { IParser } from "./Parser";
import { Graph } from "alcuin.tools";

const SHOW_INDUCED_ERRORS = "show-induced-errors";

const parser: IParser = {
    add(currentParser: ArgumentParser): void {
        const sub = currentParser.addSubparsers({
            dest: SHOW_INDUCED_ERRORS,
        });

        const showInducedErrorParser = sub.addParser(SHOW_INDUCED_ERRORS);

        showInducedErrorParser.addArgument(["-s", "--source-file"], {
            required: true,
        });

        showInducedErrorParser.addArgument(["-e", "--result-file"], {
            required: true,
        });
    },
    handle(args: any): void {
        if (args[SHOW_INDUCED_ERRORS]) {
            const source = readExportFile(args.source_file);
            const results = readResultFile(args.result_file);

            const index = createIndex(source);
            const graph = new Graph(index);

            printAllInducedFailures(graph, results);
        }
    },
};

export default parser;
