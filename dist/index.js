"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const utils_1 = require("./utils");
const SHOW_INDUCED_ERRORS_TYPE = "show-induced-errors";
const argparser = new argparse_1.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: "Tools for productivity"
});
const subparser = argparser.addSubparsers({
    dest: "type"
});
const showInducedErrorParser = subparser.addParser(SHOW_INDUCED_ERRORS_TYPE);
showInducedErrorParser.addArgument(["-s", "--source-file"], {
    required: true,
});
showInducedErrorParser.addArgument(["-e", "--result-file"], {
    required: true,
});
const args = argparser.parseArgs();
if (args.type === SHOW_INDUCED_ERRORS_TYPE) {
    const source = utils_1.readExportFile(args.source_file);
    const results = utils_1.readResultFile(args.result_file);
    const index = utils_1.createIndex(source);
    const graph = new utils_1.Graph(index);
    utils_1.printAllInducedFailures(graph, results);
}
