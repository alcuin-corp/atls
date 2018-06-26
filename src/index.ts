import { ArgumentParser } from "argparse";
import { IParser } from "./Parser";
import showInducedErrorsParser from "./parsers/ShowInducedErrorsParser";
import parentsOfParser from "./parsers/VisitParser";

const argparser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Tools for productivity",
});

const parsers: IParser[] = [
    showInducedErrorsParser,
    parentsOfParser,
];

const COMMAND_NAME = "cmd";

const subparser = argparser.addSubparsers({ dest: COMMAND_NAME });

for (const parser of parsers) {
    parser.add(subparser.addParser(parser.name));
}

const args = argparser.parseArgs(
    [
        "visit", "parents-of", "b70a6573-3541-4908-9d7b-a6d9016e740a",
        "C:\\dev\\alcuin\\reports\\1529066134_maj\\talentevo_1528294488.json",
    ],
);

for (const parser of parsers) {
    if (args[COMMAND_NAME] === parser.name) {
        parser.handle(args);
    }
}
