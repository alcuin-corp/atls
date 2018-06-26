"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const alcuin_config_api_1 = require("alcuin-config-api");
exports.SHOW_INDUCED_ERRORS_CMD = "show-induced-errors";
const result = {
    get name() { return exports.SHOW_INDUCED_ERRORS_CMD; },
    add(parser) {
        parser.addArgument(["-s", "--source"], { required: true });
        parser.addArgument(["-e", "--result"], { required: true });
    },
    handle(args) {
        if (args.parser_id === exports.SHOW_INDUCED_ERRORS_CMD) {
            const source = alcuin_config_api_1.readExportFile(args.source);
            const results = alcuin_config_api_1.readResultFile(args.result);
            const index = alcuin_config_api_1.createIndex(source);
            const graph = new alcuin_config_api_1.DependencyGraph(index);
            utils_1.printInducedFailures(graph, results);
        }
    },
};
exports.default = result;
//# sourceMappingURL=ShowInducedErrorsParser.js.map