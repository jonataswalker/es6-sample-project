// this will be css prefix classes
import { namespace, container as container_class } from '../../sass-vars.json';
import utils from './utils';

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
    let container = document.createElement('div');
    container.className = namespace + container_class;
    container.textContent = 'Drag me';
    document.body.appendChild(container);
    return container;
  }
  
  htmlTest() {
    console.info('htmlTest');
  }
  
}
