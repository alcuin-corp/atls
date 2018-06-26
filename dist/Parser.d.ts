import { ArgumentParser } from "argparse";
export interface IParser {
    name: string;
    add(parser: ArgumentParser): void;
    handle(args: any): void;
}
