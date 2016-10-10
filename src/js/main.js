import { Html } from './html';
import { Drag } from './drag';
import { dragging, height as container_height } from '../../sass-vars.json';

/**
 * Principal class. Will be passed as argument to others.
 * @class Base
 */
export default class Base {
  /**
   * @constructor
   */
  constructor() {
    // Let all other classes (sort of) hidden to application - when instantiated
    // And let each class visible to each other
    this.constructor.Html = new Html(this);
    this.container = this.constructor.Html.createContainer();

    const $drag = this.constructor.Drag = new Drag(this);

    $drag.when({
      start: () => {
        this.container.classList.add(dragging);
        this.container.style.lineHeight = container_height / 2 + 'px';
      },
      move: (resp) => {
        this.container.style.left = `${resp.x}px`;
        this.container.style.top = `${resp.y}px`;
        this.container.innerHTML = `Dragging<br>x:${resp.x} - y: ${resp.y}`;
      },
      end: (resp) => {
        this.container.classList.remove(dragging);
        this.container.textContent = 'Drag me';
        this.container.style.lineHeight = container_height + 'px';
        if (resp.y < 0) this.container.style.top = 0;
      }
    });
  }

  baseTest() {
    console.info('baseTest invoked'); //eslint-disable-line no-console
  }
}
