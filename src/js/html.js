// this will be css prefix classes
import * as VARS from '../../sass-vars.json';

/**
 * @class Html
 */
export class Html {

  /**
   * @constructor
   * @param {Function} base Base class.
   */
  constructor(base) {
    this.Base = base;
    return this;
  }

  createContainer() {
    console.warn();
    let container = document.createElement('div');
    container.className = VARS.namespace + VARS.container;
    container.textContent = 'Drag me';
    document.body.appendChild(container);
    return container;
  }

  htmlTest() {
    console.warn('htmlTest invoked');
  }
}
