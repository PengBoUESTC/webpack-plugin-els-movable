import BindMoveFn from 'touch-move-script'

export const bindForEles = (classPrefix: string, bindDrag: typeof BindMoveFn, bindTouch: typeof BindMoveFn) => {
  const selectors = classPrefix.split(',').map(prefix => `[class^=${prefix}]`).join(',')
  const els = [...document.querySelectorAll(selectors)] as HTMLElement[]

  els.forEach(ele => {
    bindTouch(ele, {})
    bindDrag(ele, {})
  })
}