jQuery(function(){
	ko.bindingHandlers.renderSvg = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	        // This will be called when the binding is first applied to an element
	        // Set up any initial state, event handlers, etc. here
	        console.log("init render");	  
	        $(element).svg();
	    },
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	        // This will be called once when the binding is first applied to an element,
	        // and again whenever the associated observable changes value.
	        // Update the DOM element based on the supplied values here.
	        console.log("update render");
			var svg = $(element).svg('get'); 
			var g = svg.group({stroke: 'black', strokeWidth: 2});
			var defaultPolygon = {fill: 'white', stroke: 'navy', strokeWidth: 0.5};
			svg.polygon(g,
				[[0,0],[20,0],[15,5],[5,5]],  
			    defaultPolygon);			
			svg.polygon(g,
				[[5,15],[15,15],[20,20],[0,20]],  
			    defaultPolygon);			
			svg.polygon(g,
				[[15,5],[20,0],[20,20],[15,15]],  
			    defaultPolygon);
			svg.polygon(g,
				[[0,0],[5,5],[5,15],[0,20]],  
			    defaultPolygon);
			var v = svg.polygon(g,
				[[5,5],[15,5],[15,15],[5,15]],  
			    defaultPolygon);			
		    svg.text(g, 6, 30, '18', 
		    	{fill: 'navy', stroke: 'navy', strokeWidth: 0.1, style: 'font-size: 6pt;font-weight:normal'});
	    	var v = $(v);
	    	v.click(function(){
	    		console.log('click');
	    	}).mouseenter(function(){
	    		var me = $(this);
	    		me.attr('fill', 'yellow');
	    	}).mouseleave(function(){
	    		var me = $(this);
	    		me.attr('fill', 'white');
	    	});
	    }
	};

	function ViewModel(){
		this.dientes = ko.observableArray([]);
	};

	function DienteModel(){
		this.id = ko.observable(null);	
		this.tratamientos = ko.observableArray([]);
	};

	vm = new ViewModel();
	var diente = new DienteModel();
	diente.id(18);
	vm.dientes.push(diente);

	ko.applyBindings(vm);
});