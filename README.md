## webpack-plugin-els-movable

> plugin for `server` mode or **not** `production` env

```javascript
import elsMovable from 'webpack-plugin-els-movable'

{
  plugins: [
    // interface MovableOptions {
    //   classPrefix: string
    // }
    // selector '[class^=movable]''
    elsMovable({ classPrefix: 'movable' })
    // selector '[class^=movable],[class^=heihei]'
    elsMovable({ classPrefix: 'movable,heihei' })
  ]
}
```