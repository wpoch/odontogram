jQuery(function(){
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