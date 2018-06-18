import { ArgumentParser } from "argparse";
import { readExportFile, readResultFile, printAllInducedFailures, createIndex, Graph } from "./utils";

const SHOW_INDUCED_ERRORS_TYPE = "show-induced-errors";

const argparser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Tools for productivity",
});

const subparser = argparser.addSubparsers({
    dest: "type",
});

const showInducedErrorParser = subparser.addParser(SHOW_INDUCED_ERRORS_TYPE);

showInducedErrorParser.addArgument(["-s", "--source-file"], {
    required: true,
});

showInducedErrorParser.addArgument(["-e", "--result-file"], {
    required: true,
});

interface ShowInducedErrorsParser {
    type:
        | typeof SHOW_INDUCED_ERRORS_TYPE;
    source_file: string;
    result_file: string;
}

type AnyParser =
    | ShowInducedErrorsParser;

const args = argparser.parseArgs() as AnyParser;

if (args.type === SHOW_INDUCED_ERRORS_TYPE) {
    const source = readExportFile(args.source_file);
    const results = readResultFile(args.result_file);

    const index = createIndex(source);
    const graph = new Graph(index);

    printAllInducedFailures(graph, results);
}
