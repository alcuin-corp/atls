import { ArgumentParser } from "argparse";

export interface IParser {
    add(parser: ArgumentParser): void;
    handle(args: any): void;
}
