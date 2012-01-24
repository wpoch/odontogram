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

	var xmlns = "http://www.w3.org/2000/svg";	
	var r1 = document.createElementNS(xmlns,"rect");
	r1.setAttributeNS(null, "x", "1cm");
	r1.setAttributeNS(null, "y", "1cm");
	r1.setAttributeNS(null, "width", "1cm");
	r1.setAttributeNS(null, "height", "1cm");
	document.getElementById("svg").appendChild(r1);
});