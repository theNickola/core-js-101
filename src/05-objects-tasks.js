/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class Selector {
  constructor(value = '', lvlElement) {
    this.selector = value;
    this.lvlElement = lvlElement;
  }

  throwError(lvl) {
    if (this.lvlElement > lvl) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if ([0, 1, 5].includes(lvl)) {
      if (this.lvlElement === lvl) {
        throw new Error(
          'Element, id and pseudo-element should not occur more then one time inside the selector',
        );
      }
    }
  }

  element(value) {
    this.throwError(0);
    this.selector += `${value}`;
    throw new Error('!!');
  }

  id(value) {
    this.throwError(1);
    this.selector += `#${value}`;
    this.lvlElement = 1;
    return this;
  }

  class(value) {
    this.throwError(2);
    this.selector += `.${value}`;
    this.lvlElement = 2;
    return this;
  }

  attr(value) {
    this.throwError(3);
    this.selector += `[${value}]`;
    this.lvlElement = 3;
    return this;
  }

  pseudoClass(value) {
    this.throwError(4);
    this.selector += `:${value}`;
    this.lvlElement = 4;
    return this;
  }

  pseudoElement(value) {
    this.throwError(5);
    this.selector += `::${value}`;
    this.lvlElement = 5;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selector += `${selector1}${combinator}${selector2}`;
    return this;
  }

  stringify() {
    return this.selector;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector(value, 0);
  },

  id(value) {
    return new Selector(`#${value}`, 1);
  },

  class(value) {
    return new Selector(`.${value}`, 2);
  },

  attr(value) {
    return new Selector(`[${value}]`, 3);
  },

  pseudoClass(value) {
    return new Selector(`:${value}`, 4);
  },

  pseudoElement(value) {
    return new Selector(`::${value}`, 5);
  },

  combine(selector1, combinator, selector2) {
    return new Selector(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`, -1);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
