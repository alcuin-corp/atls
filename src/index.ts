import { ArgumentParser } from "argparse";
import { IParser } from "./Parser";
import ShowInducedErrors from "./ShowInducedErrorsParser";

const argparser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Tools for productivity",
});

const main = argparser.addSubparsers();

const devParser = main.addParser("dev", {
    addHelp: true,
    description: "for devs",
});

interface IParserContext {
    parser?: ArgumentParser;
    args?: any;
}

type Middleware<T> = (ctx: T, next: () => void) => void;

function fold<T>(middlewares: Array<Middleware<T>>): Middleware<T> {
    return middlewares.reduce((acc, el) => {
        return (ctx, next) => {
            el(ctx, () => { acc(ctx, next); });
        };
    });
}

class MiddlewareStack<T> {
    private stack: Array<Middleware<T>>;

    constructor() {
        this.stack = [];
    }

    public use(middleware: Middleware<T>): MiddlewareStack<T> {
        this.stack.push(middleware);
        return this;
    }

    public run(ctx: T): void {
        fold(this.stack)(ctx, () => { });
    }
}

class ParserMiddlewareStack extends MiddlewareStack<IParserContext> {
    constructor() {
        super();
        this.use((myCtx, next) => {
            const args = argparser.parseArgs();
            myCtx.args = args;
            next();
        });
    }

    public useParser(parser: IParser): ParserMiddlewareStack {
        stack.use((ctx, next) => {
            if (ctx.parser) {
                parser.add(ctx.parser);
            }
            next();
            if (ctx.args) {
                parser.handle(ctx.args);
            }
        });
        return this;
    }
}

const stack = new ParserMiddlewareStack();

stack.useParser(ShowInducedErrors);

stack.run({ parser: devParser });
