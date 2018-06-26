"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const ShowInducedErrorsParser_1 = __importDefault(require("./parsers/ShowInducedErrorsParser"));
const DuplicateParser_1 = __importDefault(require("./parsers/DuplicateParser"));
const argparser = new argparse_1.ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Tools for productivity",
});
const parsers = [
    ShowInducedErrorsParser_1.default,
    DuplicateParser_1.default,
];
const COMMAND_NAME = "cmd";
const subparser = argparser.addSubparsers({ dest: COMMAND_NAME });
for (const parser of parsers) {
    parser.add(subparser.addParser(parser.name));
}
const args = argparser.parseArgs([
    "duplicate-object",
    // "a",
    // "C:\\dev\\alcuin\\reports\\1529066134_maj\\test.json",
    "b70a6573-3541-4908-9d7b-a6d9016e740a",
    "C:\\dev\\alcuin\\reports\\1529066134_maj\\talentevo_1528294488.json",
    "--ignore-type", "DataStreamMapping", "ControlSecurity", "FieldTypeProfilePrivilege",
]);
for (const parser of parsers) {
    if (args[COMMAND_NAME] === parser.name) {
        parser.handle(args);
    }
}
//# sourceMappingURL=index.js.map