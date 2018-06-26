"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alcuin_config_api_1 = require("alcuin-config-api");
const alcuin_config_api_2 = require("alcuin-config-api");
const result = {
    get name() { return "visit"; },
    add(parser) {
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
    handle(args) {
        const index = alcuin_config_api_1.createIndex(alcuin_config_api_1.readExportFile(args.source));
        const graph = new alcuin_config_api_1.DependencyGraph(index);
        const ignoredType = new Set(args.ignore_type || []);
        console.log(ignoredType);
        graph.visitAllChildren(args.id, (obj, _) => {
            if (!ignoredType.has(obj.ObjectType)) {
                console.log(`${obj.Id} - ${obj.ObjectType} => '${alcuin_config_api_2.getName(obj)}'`);
            }
        });
    },
};
exports.default = result;
//# sourceMappingURL=VisitParser.js.map