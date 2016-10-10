/**
 * An ES6 sample project using Rollup, Bublé, Sass
 * https://github.com/jonataswalker/es6-sample-project
 * Version: v1.22.2
 * Built: 2016-10-09T22:47:18-03:00
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.SampleProject = factory());
}(this, (function () { 'use strict';

var namespace = "_some-original-namespace";
var container = "-container";
var dragging = "dragging";

var height = "140";

// this will be css prefix classes
/**
 * @class Html
 */
var Html = function Html(base) {
  this.Base = base;
  return this;
};

Html.prototype.createContainer = function createContainer () {
  var container$$1 = document.createElement('div');
  container$$1.className = namespace + container;
  container$$1.textContent = 'Drag me';
  document.body.appendChild(container$$1);
  return container$$1;
};

Html.prototype.htmlTest = function htmlTest () {
  console.info('htmlTest invoked'); // eslint-disable-line no-console
};

/**
 * @class Drag
 */
var Drag = function Drag(base) {

  var container = base.container,
      lastX, lastY, currentX, currentY, x, y,
      when = {},
      dragging = function (evt) {
        evt.preventDefault && evt.preventDefault();

        currentX = parseInt(container.style.left, 10) || 0;
        currentY = parseInt(container.style.top, 10) || 0;

        x = currentX + (evt.clientX - lastX);
        y = currentY + (evt.clientY - lastY);

        when.move.call(undefined, {
          target: container,
          x: x,
          y: y
        });
        lastX = evt.clientX;
        lastY = evt.clientY;
      },
      stopDragging = function () {
        document.removeEventListener('mousemove', dragging, false);
        document.removeEventListener('mouseup', stop, false);

        when.end.call(undefined, {
          target: container,
          x: x,
          y: y
        });
      },
      start = function (evt) {
        if (evt.button !== 0) { return; }

        lastX = evt.clientX;
        lastY = evt.clientY;

        when.start.call({ target: container });
        document.addEventListener('mousemove', dragging, false);
        document.addEventListener('mouseup', stopDragging, false);
      };

  container.addEventListener('mousedown', start, false);

  // yes, this way we can call other classes methods
  base.constructor.Html.htmlTest();
  base.baseTest();

  return {
    when: function (obj) {
      when.start = obj.start;
      when.move = obj.move;
      when.end = obj.end;
    }
  };
};

/**
 * Principal class. Will be passed as argument to others.
 * @class Base
 */
var Base = function Base() {
  var this$1 = this;

  // Let all other classes (sort of) hidden to application - when instantiated
  // And let each class visible to each other
  this.constructor.Html = new Html(this);
  this.container = this.constructor.Html.createContainer();

  var $drag = this.constructor.Drag = new Drag(this);

  $drag.when({
    start: function () {
      this$1.container.classList.add(dragging);
      this$1.container.style.lineHeight = height / 2 + 'px';
    },
    move: function (resp) {
      this$1.container.style.left = (resp.x) + "px";
      this$1.container.style.top = (resp.y) + "px";
      this$1.container.innerHTML = "Dragging<br>x:" + (resp.x) + " - y: " + (resp.y);
    },
    end: function (resp) {
      this$1.container.classList.remove(dragging);
      this$1.container.textContent = 'Drag me';
      this$1.container.style.lineHeight = height + 'px';
      if (resp.y < 0) { this$1.container.style.top = 0; }
    }
  });
};

Base.prototype.baseTest = function baseTest () {
  console.info('baseTest invoked'); //eslint-disable-line no-console
};

return Base;

})));
