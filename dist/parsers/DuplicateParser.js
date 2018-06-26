"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("alcuin-config-api/dist");
const alcuin_config_api_1 = require("alcuin-config-api");
const DUPLICATE_OBJECT = "duplicate-object";
const result = {
    get name() { return DUPLICATE_OBJECT; },
    add(parser) {
        parser.addArgument("id");
        parser.addArgument("source");
        parser.addArgument(["--ignore-type"], {
            nargs: "*",
        });
    },
    handle(args) {
        const id = args.id;
        const source = dist_1.readExportFile(args.source);
        const index = dist_1.createIndex(source);
        const graph = new dist_1.DependencyGraph(index);
        const ignoredType = new Set(args.ignore_type || []);
        console.log(ignoredType);
        graph.visitAllChildren(id, (obj, lvl) => {
            if (!ignoredType.has(obj.ObjectType)) {
                console.log(`${obj.Id} - ${obj.ObjectType} => '${alcuin_config_api_1.getName(obj)}'`);
            }
        });
    },
};
exports.default = result;
//# sourceMappingURL=DuplicateParser.js.map