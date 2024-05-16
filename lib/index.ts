
import { Compiler, Compilation } from 'webpack'
import { bindForEles } from './script'
import { bindDrag, bindTouch } from 'touch-move-script'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const isVersion4OrMore = HtmlWebpackPlugin.version && HtmlWebpackPlugin.version >= 4

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

    replaceContent(content: string) {
      return content.replace(
        new RegExp('(</body>)'),
        `${`
        <script>
          const __bindDrag__ = ${bindDrag.toString()};
          const __bindTouch__ = ${bindTouch.toString()};
          const __bindForEles__ = ${bindForEles.toString()};
          __bindForEles__('${classPrefix}', __bindDrag__, __bindTouch__)
        </script>
      `}$1`,
      )
    }
    apply(compiler: Compiler) {
      const ID = 'webpack-plugin-els-movable'
      compiler.hooks.compilation.tap(ID, (compilation: Compilation) => {
        if (isVersion4OrMore) {
          // @ts-ignore
          HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            ID,
            (data, cb) => {
              data.html = this.replaceContent(data.html);
              cb(null, data)
            },
          )
        } else {
          // @ts-ignore
          compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
            ID,
            // @ts-ignore
            (data, cb) => {
              data.html = this.replaceContent(data.html);
              // 继续webpack的流程
              cb(null, data);
            }
          );
        }

      })
    }
  }

  return new ElsMovable(options)
}