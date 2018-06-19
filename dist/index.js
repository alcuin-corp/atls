"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const ShowInducedErrorsParser_1 = __importDefault(require("./ShowInducedErrorsParser"));
const argparser = new argparse_1.ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Tools for productivity",
});
const main = argparser.addSubparsers();
const devParser = main.addParser("dev", {
    addHelp: true,
    description: "for devs",
});
function fold(middlewares) {
    return middlewares.reduce((acc, el) => {
        return (ctx, next) => {
            acc(ctx, () => { el(ctx, next); });
        };
    });
}
class MiddlewareStack {
    constructor() {
        this.stack = [];
    }
    use(middleware) {
        this.stack.push(middleware);
        return this;
    }
    run(ctx) {
        fold(this.stack)(ctx, () => { });
    }
}
class ParserMiddlewareStack extends MiddlewareStack {
    constructor() {
        super();
        this.use((myCtx, next) => {
            const args = argparser.parseArgs();
            myCtx.args = args;
            next();
        });
    }
    useParser(parser) {
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
stack.useParser(ShowInducedErrorsParser_1.default);
stack.run({ parser: devParser });
//# sourceMappingURL=index.js.map