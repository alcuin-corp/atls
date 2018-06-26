"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const ShowInducedErrorsParser_1 = __importDefault(require("./parsers/ShowInducedErrorsParser"));
const VisitParser_1 = __importDefault(require("./parsers/VisitParser"));
const argparser = new argparse_1.ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Tools for productivity",
});
const parsers = [
    ShowInducedErrorsParser_1.default,
    VisitParser_1.default,
];
const subparser = argparser.addSubparsers({ dest: "parser_id" });
for (const parser of parsers) {
    parser.add(subparser.addParser(parser.name));
}
const args = argparser.parseArgs(
// [
//     "visit", "parents-of", "b70a6573-3541-4908-9d7b-a6d9016e740a",
//     "C:\\dev\\alcuin\\reports\\1529066134_maj\\talentevo_1528294488.json",
//     // "--depth", "0",
//     "-R",
//     "--exclude-type",
//         "FieldTypeRolePrivilege",
//         "FieldTypeProfilePrivilege",
//         "ControlSecurity",
// ],
);
for (const parser of parsers) {
    parser.handle(args);
}
//# sourceMappingURL=index.js.map