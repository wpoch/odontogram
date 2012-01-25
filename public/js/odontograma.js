jQuery(function(){

	function drawDiente(svg, id, x, y){
		x = x || 0;
		y = y || 0;
		var defaultPolygon = {fill: 'white', stroke: 'navy', strokeWidth: 0.5};
		var g = svg.group({transform: 'translate('+x+','+y+')'});
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
	    svg.text(g, 6, 30, id.toString(), 
	    	{fill: 'navy', stroke: 'navy', strokeWidth: 0.1, style: 'font-size: 6pt;font-weight:normal'});
    	var v = $(v);
    	v.click(function(){
    		console.log('click ' + id);
    		vm.dientes.push(new DienteModel(id, 1,5));	
    	}).mouseenter(function(){
    		var me = $(this);
    		me.attr('fill', 'yellow');
    	}).mouseleave(function(){
    		var me = $(this);
    		me.attr('fill', 'white');
    	});
	};


	ko.bindingHandlers.renderSvg = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	        $(element).svg();
	    },
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var svg = $(element).svg('get').clear();
			var value = valueAccessor();
			var valueUnwrapped = ko.utils.unwrapObservable(value); 
			for (var i = valueUnwrapped.length - 1; i >= 0; i--) {
				var diente = valueUnwrapped[i];
				var dienteUnwrapped = ko.utils.unwrapObservable(diente); 
				drawDiente(svg, diente.id, diente.x, diente.y);
			};
	    }
	};

	function ViewModel(){
		this.dientes = ko.observableArray([]);
	};

	function DienteModel(id, x, y){
		this.id = id;	
		this.x = x;
		this.y = y;
		this.tratamientos = ko.observableArray([]);
	};

	vm = new ViewModel();
	//Dientes izquierdos
	for(var i = 0; i < 8; i++){
		vm.dientes.push(new DienteModel(18 - i, i * 25, 0));	
	}
	for(var i = 3; i < 8; i++){
		vm.dientes.push(new DienteModel(55 - i, i * 25, 1 * 40));	
	}
	for(var i = 3; i < 8; i++){
		vm.dientes.push(new DienteModel(85 - i, i * 25, 2 * 40));	
	}
	for(var i = 0; i < 8; i++){
		vm.dientes.push(new DienteModel(48 - i, i * 25, 3 * 40));	
	}
	//Dientes derechos
	for(var i = 0; i < 8; i++){
		vm.dientes.push(new DienteModel(21 + i, i * 25 + 210, 0));	
	}
	for(var i = 0; i < 5; i++){
		vm.dientes.push(new DienteModel(61 + i, i * 25 + 210, 1 * 40));	
	}
	for(var i = 0; i < 5; i++){
		vm.dientes.push(new DienteModel(71 + i, i * 25 + 210, 2 * 40));	
	}
	for(var i = 0; i < 8; i++){
		vm.dientes.push(new DienteModel(31 + i, i * 25 + 210, 3 * 40));	
	}	
	ko.applyBindings(vm);
});