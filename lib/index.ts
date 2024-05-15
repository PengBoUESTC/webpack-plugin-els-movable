
import { Compiler, Compilation } from 'webpack'
import { bindForEles } from './script'
import bindMove from 'touch-move-script'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export interface MovableOptions {
  classPrefix: string
}

export default function elsMovable(options: Partial<MovableOptions>) {
  const { classPrefix = 'movable' } = options

  class ElsMovable {
    options: Partial<MovableOptions>
    constructor(options: Partial<MovableOptions>) {
      this.options = options
    }
    apply(compiler: Compiler) {
      const ID = 'webpack-plugin-els-movable'
      compiler.hooks.compilation.tap(ID, (compilation: Compilation) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          ID,
          (data, cb) => {
            data.html = data.html.replace(
              new RegExp('(</body>)'),
              `${`
              <script>
                const __bindMove__ = ${bindMove.toString()};
                const __bindForEles__ = ${bindForEles.toString()};
                __bindForEles__('${classPrefix}', __bindMove__)
              </script>
            `}$1`,
            );
            cb(null, data)
          },
        )
      })
    }
  }

  return new ElsMovable(options)
}