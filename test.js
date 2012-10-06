$(function() {
	$("#graph").jsgraph();

	$("#graph").jsgraph("add",1,"hallo");
	$("#graph").jsgraph("add",2,"tutu",
			{
		'position':[100,30]
			});
	$("#graph").jsgraph("add",3,"abc",
			{
		'position':[100,30]
			});

	$("#graph_component_2").offset({ top: 100, left: 30 })

	$("#graph").jsgraph("addConnection",1,2);
	
});