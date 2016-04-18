/**
 * An ES6 sample project using Rollup, Babel, Sass
 * https://github.com/jonataswalker/es6-sample-project
 * Version: v1.0.0
 * Built: 2016-04-18T16:46:27-0300
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.SampleProject = factory());
}(this, function () { 'use strict';

	var babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};

	babelHelpers.classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	babelHelpers.createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	babelHelpers;

	var namespace = "_some-original-namespace";
	var container = "-container";
	var dragging = "dragging";
	var height = "140";

	/**
	 * @class Html
	 */
	var Html = function () {

	  /**
	   * @constructor
	   * @param {Function} base Base class.
	   */

	  function Html(base) {
	    babelHelpers.classCallCheck(this, Html);

	    this.Base = base;
	    return this;
	  }

	  babelHelpers.createClass(Html, [{
	    key: 'createContainer',
	    value: function createContainer() {
	      var container$$ = document.createElement('div');
	      container$$.className = namespace + container;
	      container$$.textContent = 'Drag me';
	      document.body.appendChild(container$$);
	      return container$$;
	    }
	  }, {
	    key: 'htmlTest',
	    value: function htmlTest() {
	      console.info('htmlTest');
	    }
	  }]);
	  return Html;
	}();

	/**
	 * @class Drag
	 */
	var Drag = function () {

	  /**
	   * @constructor
	   * @param {Function} base Base class.
	   */

	  function Drag(base) {
	    babelHelpers.classCallCheck(this, Drag);


	    var container = base.container,
	        lastX = void 0,
	        lastY = void 0,
	        currentX = void 0,
	        currentY = void 0,
	        x = void 0,
	        y = void 0,
	        _when = {},
	        dragging = function dragging(evt) {
	      evt.preventDefault && evt.preventDefault();

	      currentX = parseInt(container.style.left, 10) || 0;
	      currentY = parseInt(container.style.top, 10) || 0;

	      x = currentX + (evt.clientX - lastX);
	      y = currentY + (evt.clientY - lastY);

	      _when.move.call(undefined, {
	        target: container,
	        x: x,
	        y: y
	      });
	      lastX = evt.clientX;
	      lastY = evt.clientY;
	    },
	        stopDragging = function stopDragging() {
	      document.removeEventListener('mousemove', dragging, false);
	      document.removeEventListener('mouseup', stop, false);

	      _when.end.call(undefined, {
	        target: container,
	        x: x,
	        y: y
	      });
	    },
	        start = function start(evt) {
	      if (evt.button !== 0) return;

	      lastX = evt.clientX;
	      lastY = evt.clientY;

	      _when.start.call({ target: container });
	      document.addEventListener('mousemove', dragging, false);
	      document.addEventListener('mouseup', stopDragging, false);
	    };

	    container.addEventListener('mousedown', start, false);

	    // yes, this way we can call other classes methods
	    base.constructor.Html.htmlTest();
	    base.baseTest();

	    return {
	      when: function when(obj) {
	        _when.start = obj.start;
	        _when.move = obj.move;
	        _when.end = obj.end;
	      }
	    };
	  }

	  babelHelpers.createClass(Drag, [{
	    key: 'dragTest',
	    value: function dragTest() {
	      console.info('dragTest');
	    }
	  }]);
	  return Drag;
	}();

	/**
	 * Principal class. Will be passed as argument to others.
	 * @class Base
	 */

	var Base = function () {

	  /**
	   * @constructor
	   */

	  function Base() {
	    var _this = this;

	    babelHelpers.classCallCheck(this, Base);

	    // Let all other classes (sort of) hidden to application - when instantiated.
	    // And let each class visible to each other
	    this.constructor.Html = new Html(this);
	    this.container = this.constructor.Html.createContainer();

	    var $drag = this.constructor.Drag = new Drag(this);

	    $drag.when({
	      start: function start() {
	        _this.container.classList.add(dragging);
	        _this.container.style.lineHeight = height / 2 + 'px';
	      },
	      move: function move(resp) {
	        _this.container.style.left = resp.x + 'px';
	        _this.container.style.top = resp.y + 'px';
	        _this.container.innerHTML = 'Dragging<br>x:' + resp.x + ' - y: ' + resp.y;
	      },
	      end: function end(resp) {
	        _this.container.classList.remove(dragging);
	        _this.container.textContent = 'Drag me';
	        _this.container.style.lineHeight = height + 'px';
	        if (resp.y < 0) _this.container.style.top = 0;
	      }
	    });
	  }

	  babelHelpers.createClass(Base, [{
	    key: 'baseTest',
	    value: function baseTest() {
	      console.info('baseTest');
	    }
	  }]);
	  return Base;
	}();

	return Base;

}));