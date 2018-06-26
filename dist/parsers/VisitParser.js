"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alcuin_config_api_1 = require("alcuin-config-api");
const alcuin_config_api_2 = require("alcuin-config-api");
const PARENTS_OF = "parents-of";
const CHILDREN_OF = "children-of";
exports.VISIT_CMD = "visit";
const result = {
    get name() { return exports.VISIT_CMD; },
    add(parser) {
        parser.addArgument("direction", {
            choices: [PARENTS_OF, CHILDREN_OF],
            help: "select the visit direction, parents is leafs to roots, children the other way round",
        });
        parser.addArgument("id", {
            help: "the element of which we want to display the siblings",
        });
        parser.addArgument("source", {
            help: "the export source file",
        });
        const group = parser.addMutuallyExclusiveGroup();
        group.addArgument(["-R", "--recursive"], {
            action: "storeTrue",
            help: "this visit the tree recursively without depth limitation",
        });
        group.addArgument(["-D", "--depth"], {
            help: "this perform a recursive visit with an arbitrary maximum depth (included)",
        });
        const group2 = parser.addMutuallyExclusiveGroup();
        group2.addArgument("--exclude-type", {
            defaultValue: [],
            nargs: "*",
            help: "excludes those objects types",
        });
        parser.addArgument(["-c", "--copy"], {
            help: "this option generates new ids and codes for all the items that are visited",
        });
        parser.addArgument(["-o", "--out"], {
            help: "saves the result in a importable JSON file",
        });
    },
    handle(args) {
        if (args.parser_id === exports.VISIT_CMD) {
            const index = alcuin_config_api_1.createIndex(alcuin_config_api_1.readExportFile(args.source));
            const graph = new alcuin_config_api_1.DependencyGraph(index);
            const excludeTypesSet = new Set(args.exclude_type);
            const visitOptions = {
                maxDepth: args.recursive ? undefined : (args.depth || 1),
            };
            graph.visitAllChildren(args.id, (obj, depth) => {
                if (!excludeTypesSet.has(obj.ObjectType)) {
                    console.log(`${obj.Id} - ${obj.ObjectType} (depth: ${depth}) => '${alcuin_config_api_2.getName(obj)}'`);
                }
            }, visitOptions);
        }
    },
};
exports.default = result;
//# sourceMappingURL=VisitParser.js.map