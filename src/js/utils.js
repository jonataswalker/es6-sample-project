/**
 * @module utils
 * All the helper functions needed in this project
 */
export default {
  /**
   * @param {String} id Either '#some' or 'some'.
   * @returns {HTMLElement}
   */
  $(id) {
    id = (id[0] === '#') ? id.substr(1, id.length) : id;
    return document.getElementById(id);
  },
  /**
   * @param {String|Element} element
   * @returns A DOM object, such as HTMLElement, Window, and Document.
   */
  evaluate(element) {
    let el;
    switch (this.toType(element)) {
      case 'window':
      case 'htmldocument':
      case 'element':
        el = element;
        break;
      case 'string':
        el = this.$(element);
        break;
      default:
        console.warn('Unknown type!');
    }
    this.assert(el, 'Can\'t evaluate: @param ' + element);
    return el;
  },
  /**
   * @param {Object|Element|String} obj
   * @returns {String}
   */
  toType(obj) {
    if (obj === window && obj.document && obj.location) {
      return 'window';
    } else if (obj === document) {
      return 'htmldocument';
    } else if (typeof obj === 'string') {
      return 'string';
    } else if (this.isElement(obj)) {
      return 'element';
    }
  },
  /**
   * @param {Element} el
   * @returns {Boolean}
   */
  isElement(el) {
    // DOM, Level2
    if ('HTMLElement' in window) {
      return (!!el && el instanceof HTMLElement);
    }
    // Older browsers
    return (!!el && typeof el === 'object' && el.nodeType === 1 &&
        !!el.nodeName);
  },
  /**
   * @param {String} html
   * @returns {Element}
   */
  createFragment(html) {
    const frag = document.createDocumentFragment();
    const temp = document.createElement('div');

    temp.innerHTML = html;
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    return frag;
  },
  /**
   * Checks if the condition evaluates to true.
   * @param {T} condition The condition to check.
   * @param {string=} message Error message in case of failure.
   * @throws {Error} When the condition evaluates to false.
   */
  assert(condition, message = 'Assertion failed') {
    if (!condition) {
      if (typeof Error !== 'undefined') {
        throw new Error(message);
      }
      throw message; // Fallback
    }
  }
};
