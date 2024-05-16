'use strict';

var HtmlWebpackPlugin = require('html-webpack-plugin');

const bindForEles = (classPrefix, bindDrag, bindTouch) => {
    const selectors = classPrefix.split(',').map(prefix => `[class^=${prefix}]`).join(',');
    const els = [...document.querySelectorAll(selectors)];
    els.forEach(ele => {
        bindTouch(ele, {});
        bindDrag(ele, {});
    });
};

function bindDrag(el, boundInfo) {
  const bound = Object.assign(
    {
      top: 70,
      right: 20,
      bottom: 50,
      left: 20,
    },
    boundInfo,
  );
  el.style.position = 'fixed';
  el.draggable = true;
  let startPos = {};
  const dragStartHandler = (e) => {
    const { left, top } = el.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
    }
    startPos = {
      startX: offsetX,
      startY: offsetY,
    };
  };
  el.addEventListener('dragstart', dragStartHandler);
  const dragOverHandler = (event) => {
    event.preventDefault();
  };
  document.addEventListener('dragover', dragOverHandler);
  const dragEndHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { clientHeight, clientWidth } = document.documentElement;
    const { clientHeight: h } = el;
    const { top, right, bottom, left } = bound;
    let nextX = e.clientX - startPos.startX;
    let nextY = e.clientY - startPos.startY;
    nextY =
      nextY > clientHeight - bottom - h ? clientHeight - bottom - h : nextY;
    nextY = nextY < top ? top : nextY;
    el.style.top = `${nextY}px`;
    nextX = nextX > clientWidth - left ? clientWidth - left : nextX;
    nextX = nextX < right ? right : nextX;
    el.style.left = `${nextX}px`;
    startPos = {
      startX: nextX,
      startY: nextY,
    };
  };
  el.addEventListener('dragend', dragEndHandler);
  const remvoeDragStart = () =>
    el.removeEventListener('dragstart', dragStartHandler);
  const removeDragOver = () =>
    document.removeEventListener('dragover', dragOverHandler);
  const removeDragEnd = () => el.removeEventListener('dragend', dragEndHandler);
  return {
    remvoeDragStart,
    removeDragOver,
    removeDragEnd,
  }
}
function bindTouch(el, boundInfo) {
  const bound = Object.assign(
    {
      top: 70,
      right: 20,
      bottom: 50,
      left: 20,
    },
    boundInfo,
  );
  el.style.position = 'fixed';
  let startPos = {};
  const touchStartHandler = (e) => {
    const { clientY, clientX } = e.touches[0];
    const curBound = el.getBoundingClientRect();
    startPos = {
      diffLeft: clientX - curBound.left,
      diffRight: clientX - curBound.right,
      diffTop: clientY - curBound.top,
      diffBottom: clientY - curBound.bottom,
    };
  };
  el.addEventListener('touchstart', touchStartHandler);
  const touchMoveHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { clientHeight, clientWidth } = document.documentElement;
    const { clientHeight: h } = el;
    const { top, right, bottom, left } = bound;
    const { clientY, clientX } = e.touches[0];
    const { diffTop, diffLeft } = startPos;
    let nextPos = clientY - diffTop;
    nextPos =
      nextPos > clientHeight - bottom - h ? clientHeight - bottom - h : nextPos;
    nextPos = nextPos < top ? top : nextPos;
    el.style.top = `${nextPos}px`;
    nextPos = clientX - diffLeft;
    nextPos = nextPos > clientWidth - left ? clientWidth - left : nextPos;
    nextPos = nextPos < right ? right : nextPos;
    el.style.left = `${nextPos}px`;
  };
  el.addEventListener('touchmove', touchMoveHandler);
  const removeTouchStart = () =>
    el.removeEventListener('touchstart', touchStartHandler);
  const removeTouchMove = () =>
    el.removeEventListener('touchmove', touchMoveHandler);
  return {
    removeTouchStart,
    removeTouchMove,
  }
}

const isVersion4OrMore = HtmlWebpackPlugin.version && HtmlWebpackPlugin.version >= 4;
function elsMovable(options) {
    const { classPrefix = 'movable' } = options;
    class ElsMovable {
        constructor(options) {
            this.options = options;
        }
        replaceContent(content) {
            return content.replace(new RegExp('(</body>)'), `${`
        <script>
          const __bindDrag__ = ${bindDrag.toString()};
          const __bindTouch__ = ${bindTouch.toString()};
          const __bindForEles__ = ${bindForEles.toString()};
          __bindForEles__('${classPrefix}', __bindDrag__, __bindTouch__)
        </script>
      `}$1`);
        }
        apply(compiler) {
            const ID = 'webpack-plugin-els-movable';
            compiler.hooks.compilation.tap(ID, (compilation) => {
                if (isVersion4OrMore) {
                    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(ID, (data, cb) => {
                        data.html = this.replaceContent(data.html);
                        cb(null, data);
                    });
                }
                else {
                    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(ID, (data, cb) => {
                        data.html = this.replaceContent(data.html);
                        cb(null, data);
                    });
                }
            });
        }
    }
    return new ElsMovable(options);
}

module.exports = elsMovable;
