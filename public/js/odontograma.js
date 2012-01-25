jQuery(function(){

	function drawDiente(svg, parentGroup, diente){
		if(!diente) throw new Error('Error no se ha especificado el diente.');
		var x = diente.x || 0,
			y = diente.y || 0;
		var defaultPolygon = {fill: 'white', stroke: 'navy', strokeWidth: 0.5};
		var dienteGroup = svg.group(parentGroup, {transform: 'translate(' + x + ',' + y + ')'});

		var caraSuperior = svg.polygon(dienteGroup,
			[[0,0],[20,0],[15,5],[5,5]],  
		    defaultPolygon);			
		
		var caraInferior =  svg.polygon(dienteGroup,
			[[5,15],[15,15],[20,20],[0,20]],  
		    defaultPolygon);			
		
		var caraDerecha = svg.polygon(dienteGroup,
			[[15,5],[20,0],[20,20],[15,15]],  
		    defaultPolygon);
		
		var caraIzquierda = svg.polygon(dienteGroup,
			[[0,0],[5,5],[5,15],[0,20]],  
		    defaultPolygon);
		
		var caraCentral = svg.polygon(dienteGroup,
			[[5,5],[15,5],[15,15],[5,15]],  
		    defaultPolygon);			
	    
	    svg.text(dienteGroup, 6, 30, diente.id.toString(), 
	    	{fill: 'navy', stroke: 'navy', strokeWidth: 0.1, style: 'font-size: 6pt;font-weight:normal'});
    	
		$.each([caraCentral, caraIzquierda, caraDerecha, caraInferior, caraSuperior], function(index, value){
	    	$(value).click(function(){
	    		console.log('click ' + diente.id);
	    	}).mouseenter(function(){
	    		var me = $(this);
	    		me.attr('fill', 'yellow');
	    	}).mouseleave(function(){
	    		var me = $(this);
	    		me.attr('fill', 'white');
	    	});			
		});
	};


	ko.bindingHandlers.renderSvg = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	        $(element).svg({
		        settings:{ width: '620px', height: '250px' }
		    });
	    },
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var svg = $(element).svg('get').clear();
			var parentGroup = svg.group({transform: 'scale(1.5)'});
			var value = valueAccessor();
			var valueUnwrapped = ko.utils.unwrapObservable(value); 
			for (var i = valueUnwrapped.length - 1; i >= 0; i--) {
				var diente = valueUnwrapped[i];
				var dienteUnwrapped = ko.utils.unwrapObservable(diente); 
				drawDiente(svg, parentGroup, dienteUnwrapped);
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