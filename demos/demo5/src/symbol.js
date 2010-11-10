var events = require('events'),
	MIN_TICKS = 25;

function Symbol(symbol) {
	this.symbol = symbol;
	this.orders = [];
	this.ticks = [];
	this.priceMedian = Math.random() * 100;
	
	this.initialize();
}

Symbol.prototype = Object.create(events.EventEmitter.prototype, {

	constructor: {
		value: Symbol,
		enumerable: false
	}

});
	
Symbol.prototype.initialize = function() {
		this._backFillPrices(); // Pretend we've been going for a while
		this._scheduleNextTick();
};
	
Symbol.prototype.currentPrice = function() {
	return this.ticks ? this.ticks[this.ticks.length - 1] : null;
};

Symbol.prototype.getRecentPrices = function() {
	return this.ticks.slice( -MIN_TICKS );
};

Symbol.prototype.destroy = function() {
	// Stop the next scheduled tick
	clearTimeout( this._timeoutId );
};

Symbol.prototype._scheduleNextTick = function() {
	var self = this;
	
	this._timeoutId = setTimeout(function() {
		self._updatePrice();
		self._scheduleNextTick();
	}, (Math.random() * 2000) + 500); // Schedule tick to occur in the near future
};

Symbol.prototype._updatePrice = function() {
	var price = this._generateNextPrice( this.ticks[ this.ticks.length - 1] );
	
	this.ticks.shift();
	this.ticks.push( price );
	
	this.emit('tick', this.symbol, price);
};

Symbol.prototype._backFillPrices = function() {
	var price = this.priceMedian,
		i;
	
	for (i = 0; i < MIN_TICKS; i++) {	
		this.ticks.push( price );
		price = this._generateNextPrice( price );
	}
};

Symbol.prototype._generateNextPrice = function(current) {
	return Math.random() * 100;
};

exports.create = function(symbol) {
	return new Symbol(symbol);
};