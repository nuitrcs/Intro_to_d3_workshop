function bindEvents() {

	// the variable 'bars' stores a selection
	var bars = document.getElementsByClassName('bar');

	// 'bars' is an HTMLCollection, which is like an array - but not
	// We cannot perform 'array' operations on it, so we must loop instead
	console.log(bars)

	// 'var' only needs to be declared once if you use commas
	// 'length' is a property in HTMLCollection objects, which will 
	// allow us to loop over them programmatically
	var j = bars.length,
		i;
	console.log(j)

	// this is a basic loop in javascript
	for (i = 0; i < j; i++) {
		
		// 'element' here is an HTML element, which can have all kinds
		// of operations performed on it.
		var element = bars[i]
		console.log(element)

		// one of the operations that you can pass to elements are 
		// 'eventListeners' which are things that 'listen' for an event
		// to happen (a mouse click, in this case)
		element.addEventListener("click", function(d,i){
		    // once the click 'happens' we want to do something
		    // let's see what 'this' is
		    console.log(this)

		    // let's see what 'd' is
		    console.log(d)

		    // let's see what 'i' is
		    console.log(i)

		    // let's set the styling of a clicked bar
		    this.setAttribute('style', 'fill:grey')
		});
	}
}
