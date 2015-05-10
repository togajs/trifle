/**
 * # The Long Game
 *
 * I'm the Doctor. Well, they call me the Doctor. I don't know why. I call me
 * the Doctor too. I still don't know why. Saving the world with meals on
 * wheels. Stop talking, brain thinking. Hush. *Insistently* Bow ties are cool!
 * Come on Amy, I'm a normal bloke, tell me what normal blokes do! I'm the
 * Doctor. Well, they call me the Doctor. I don't know why. I call me the Doctor
 * too. I still don't know why.
 *
 * ## 42
 *
 * They're not aliens, they're Earth...liens! Did I mention we have comfy
 * chairs? You hit me with a cricket bat. Heh-haa! Super squeaky bum time!
 *
 * - Father Christmas. Santa Claus. Or as I've always known him: Jeff.
 * - They're not aliens, they're Earth&hellip;liens!
 * - You've swallowed a planet!
 *
 * The way I see it, every life is a pile of good things and bad things....
 * hey....the good things don't always soften the bad things; but vice-versa the
 * bad things don't necessarily spoil the good things and make them unimportant.
 *
 * ```js
 * var foo = 'bar';
 *
 * function log(value) {
 *     console.log(value);
 * }
 *
 * log(foo); // <- 'bar'
 * ```
 *
 * ## Gridlock
 *
 * You hate me; you want to kill me! Well, go on! Kill me! KILL ME! I'm nobody's
 * taxi service; I'm not gonna be there to catch you every time you feel like
 * jumping out of a spaceship. You know when grown-ups tell you 'everything's
 * going to be fine' and you think they're probably lying to make you feel
 * better?
 */

import Foo from 'foo';

/**
 * @class Bar
 * @extends Foo
 */
export default class Bar extends Foo {
	/**
	 * @constructor
	 * @param {Object} options - Options for the class.
	 */
	constructor(options) {
		super(options);
	}

	/**
	 * @method log
	 * @param {*} value
	 * @chainable
	 */
	log(value) {
		console.log(value);
		return this;
	}
}
