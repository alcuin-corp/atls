"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const alcuin_tools_1 = require("alcuin-tools");
const SHOW_INDUCED_ERRORS = "show-induced-errors";
const parser = {
    add(currentParser) {
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
    handle(args) {
        if (args[SHOW_INDUCED_ERRORS]) {
            const source = utils_1.readExportFile(args.source_file);
            const results = utils_1.readResultFile(args.result_file);
            const index = utils_1.createIndex(source);
            const graph = new alcuin_tools_1.Graph(index);
            utils_1.printAllInducedFailures(graph, results);
        }
    },
};
exports.default = parser;
//# sourceMappingURL=ShowInducedErrorsParser.js.map