(function( $ ){

	var methods = {
			init : function( options ) {

				return this.each(function(){

					var $this = $(this),
					data = $this.data('jsgraph');

					$this.css("position","absolute");

					var settings = $.extend( {
						'arrow'  : true,
						'detachable': true,
						'label'      : "",
						'endpoint'      : "Blank",
						'hoverColor'   : 'red',
					}, options);

					var overlay = [];
					if(settings['label'].length>0)
						overlay[overlay.length] = ["Label", {
							cssClass:"component label",		    			        				 
							label : 	settings['label'],
							location:0.3
						}];
					if(settings['arrow'])
						overlay[overlay.length]=["PlainArrow", {location:1, width:20, length:12} ];
					
					var VjsPlumb =          {

							init : function() {

								jsPlumb.importDefaults({
									DragOptions : { cursor: "pointer", zIndex:2000 },
									HoverClass:"connector-hover",
									endpoint:		settings['endpoint'], 
									hoverPaintStyle: { strokeStyle:settings['hoverColor'] }, 
									endpointsOnTop:true,
									overlays:		overlay,
									detachable:		settings['detachable']
								});
							}
					};

					// chrome fix.
					document.onselectstart = function () { return false; };	

					var desiredMode = jsPlumb.SVG;
					if(!jsPlumb.isSVGAvailable()) desireMode = jsPlumb.Canvas;
					if(!jsPlumb.isCanvasAvailable()) desireMode = jsPlumb.VML;
					jsPlumb.setRenderMode(desiredMode);
					VjsPlumb.init();

					// jsplumb event handlers

					// double click on any connection 
					jsPlumb.bind("click", function(connection, originalEvent) {
						var e = jQuery.Event("click");
						if(jQuery("#"+connection.sourceId).trigger( e ))
							jsPlumb.detach(connection); 						  
					});
					jsPlumb.bind("dblclick", function(connection, originalEvent) {
						var e = jQuery.Event("dblclick");
						jQuery("#"+connection.sourceId).trigger( e ); 
					});
					// single click on any endpoint
					jsPlumb.bind("endpointClick", function(endpoint, originalEvent) {
						var e = jQuery.Event("endpointClick");
						jQuery("#"+endpoint.elementId).trigger( e ); 
						});
					// context menu (right click) on any component.
					jsPlumb.bind("contextmenu", function(component, originalEvent) {
						var e = jQuery.Event("contextmenu");
						jQuery("#"+component.id).trigger( e ); 
						originalEvent.preventDefault();
						return false;
					});

		            jsPlumb.bind("jsPlumbConnection", function(conn) {
						var e = jQuery.Event("endpointClick");
						jQuery("#"+conn.connection.id).trigger( e );
		            });

					$(this).data('jsgraph', {
						target : $this,
						jsPlumb : VjsPlumb
					});

				});
			},
			destroy : function( ) {

				return this.each(function(){

					var $this = $(this),
					data = $this.data('tooltip');

					// Namespacing FTW
					$(window).unbind('.tooltip');
					data.tooltip.remove();
					$this.removeData('tooltip');

				})

			},
			add : function(id, content, options) {
				var settings = $.extend( {
					'draggable'  : true,
					'color'      : "black",
					'lineWidth'  : 2,
					'position'   : [0,0],
				}, options);

				var ep = "";
				ep = '<div class="ep"></div>';

				$(this).append('<div id="graph_component_'+id+'">'+content+ep+'</div>');
				var wind = $('#graph_component_'+id);
				
				wind.offset({ top: settings['position'][1], left: settings['position'][0] })

				if(settings['draggable']) wind.addClass("draggable");

				jsPlumb.makeSource(wind.find(".ep"), {
					parent:wind,
					//anchor:"BottomCenter",
					anchor:"Continuous",
					connector:[ "StateMachine", { curviness:20 } ],
					connectorStyle:{
						strokeStyle:settings['color'],
						lineWidth:settings['lineWidth'],
					},
					maxConnections:5,
					onMaxConnections:function(info, e) {
						alert("Maximum connections (" + info.maxConnections + ") reached");
					}
				});

				// make all .window divs draggable
				jsPlumb.draggable($(this).find(".draggable"));

	            jsPlumb.makeTarget(wind, {
					dropOptions:{ hoverClass:"dragHover" },
					anchor:"Continuous"			
					//anchor:"TopCenter"			
				});
			},
			addConnection: function(src_id, tgt_id, options)  {
				var settings = $.extend( {
					'draggable'  : true,
					'arrow'  : true,
					'detachable': true,
					'label'      : "",
					'tooltip'      : "",
					'endpoint'      : "Blank",
					'hoverColor'   : 'red',
				}, options);

				var overlay = [];
				if(settings['label'].length>0)
					overlay[overlay.length] = ["Label", {
						cssClass:"component label",		    			        				 
						label : 	settings['label'],
						location:0.3
					}];
				if(settings['arrow'])
					overlay[overlay.length]=["PlainArrow", {location:1, width:20, length:12} ];

				var connection = jsPlumb.connect({
					source:"graph_component_"+src_id,
					target:"graph_component_"+tgt_id, 
					/*anchors:["Continuous", "Continuous"], 
					tooltip:		settings["tooltip"],
					endpoint:		settings['endpoint'], 
					hoverPaintStyle: { strokeStyle:settings['hoverColor'] }, 
					endpointsOnTop:true,
					overlays:		overlay,
					detachable:		settings['detachable'],*/
				});


			},
			show : function( ) { // ...
			},
			hide : function( ) { // ...

			},
			update : function( content ) { // ...

			}
	};

	$.fn.jsgraph = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.jsgraph' );
		}    

	};

})( jQuery );

