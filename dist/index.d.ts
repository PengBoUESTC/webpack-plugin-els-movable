import { Compiler } from 'webpack';
export interface MovableOptions {
    classPrefix: string;
}
export default function elsMovable(options: Partial<MovableOptions>): {
    options: Partial<MovableOptions>;
    apply(compiler: Compiler): void;
};
