 

(function($) {

	// for ie9 doesn't support debug console >>>
	if (!window.console) window.console = {};
	if (!window.console.log) window.console.log = function () { };
	// ^^^
	
	$.fn.gMapsLatLonPicker = (function() {
	
		var _self = this;
	
		///////////////////////////////////////////////////////////////////////////////////////////////
		// PARAMETERS (MODIFY THIS PART) //////////////////////////////////////////////////////////////
		_self.params = {
			defLat : 20.660850688281958,
			defLng : -103.35101618503171,
			defZoom : 12,
			queryLocationNameWhenLatLngChanges: true,
			queryElevationWhenLatLngChanges: true,
			mapOptions : {
				mapTypeId: google.maps.MapTypeId.HYBRID,
				mapTypeControl: false,
				disableDoubleClickZoom: true,
				zoomControlOptions: true,
				streetViewControl: false,
				styles: [
					{
					  "featureType": "poi.business",
					  "stylers": [
						{
						  "visibility": "off"
						}
					  ]
					},
					{
					  "featureType": "poi.park",
					  "elementType": "labels.text",
					  "stylers": [
						{
						  "visibility": "off"
						}
					  ]
					}
				]
			},
			strings : {
				markerText : "Drag this Marker",
				error_empty_field : "Couldn't find coordinates for this place",
				error_no_results : "Couldn't find coordinates for this place"
			},
			displayError : function(message) {
				alert(message);
			}
		};
	
	
		///////////////////////////////////////////////////////////////////////////////////////////////
		// VARIABLES USED BY THE FUNCTION (DON'T MODIFY THIS PART) ////////////////////////////////////
		_self.vars = {
			ID : null,
			LATLNG : null,
			map : null,
			marker : null,
			geocoder : null
		};
	
		///////////////////////////////////////////////////////////////////////////////////////////////
		// PRIVATE FUNCTIONS FOR MANIPULATING DATA ////////////////////////////////////////////////////
		var setPosition = function(position) {
			
	
			$(_self.vars.cssID + ".gllpZoom").val( _self.vars.map.getZoom() );
			$(_self.vars.cssID + ".gllpLongitude").val( position.lng() );
			$(_self.vars.cssID + ".gllpLatitude").val( position.lat() );
	
			$(_self.vars.cssID).trigger("location_changed", $(_self.vars.cssID));
	
			if (_self.params.queryLocationNameWhenLatLngChanges) {
				getLocationName(position);
			}
			if (_self.params.queryElevationWhenLatLngChanges) {
				getElevation(position);
			}
		};
	
		// for reverse geocoding
		var getLocationName = function(position) {
			var latlng = new google.maps.LatLng(position.lat(), position.lng());
			_self.vars.geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK && results[1]) {
					$(_self.vars.cssID + ".gllpLocationName").val(results[1].formatted_address);
				} else {
					$(_self.vars.cssID + ".gllpLocationName").val("");
				}
				$(_self.vars.cssID).trigger("location_name_changed", $(_self.vars.cssID));
			});
		};
	
		// for getting the elevation value for a position
		var getElevation = function(position) { 
			var latlng = new google.maps.LatLng(position.lat(), position.lng());
	
			var locations = [latlng];
	
			var positionalRequest = { 'locations': locations };
	
			_self.vars.elevator.getElevationForLocations(positionalRequest, function(results, status) {
				if (status == google.maps.ElevationStatus.OK) {
					if (results[0]) {
						$(_self.vars.cssID + ".gllpElevation").val( results[0].elevation.toFixed(3));
					} else {
						$(_self.vars.cssID + ".gllpElevation").val("");
					}
				} else {
					$(_self.vars.cssID + ".gllpElevation").val("");
				}
				$(_self.vars.cssID).trigger("elevation_changed", $(_self.vars.cssID));
			});
		};
	 
	
		///////////////////////////////////////////////////////////////////////////////////////////////
		// PUBLIC FUNCTIONS  //////////////////////////////////////////////////////////////////////////
		var publicfunc = {
	
			// INITIALIZE MAP ON DIV //////////////////////////////////////////////////////////////////
			init : function(object) {
	
				if ( !$(object).attr("id") ) { 
					if ( $(object).attr("name") ) {
						$(object).attr("id", $(object).attr("name") );
					} else {
						$(object).attr("id", "_MAP_" + Math.ceil(Math.random() * 10000) );
					}
				}
	
				_self.vars.ID = $(object).attr("id");
				_self.vars.cssID = "#" + _self.vars.ID + " ";
	
				_self.params.defLat  = $(_self.vars.cssID + ".gllpLatitude").val()  ? $(_self.vars.cssID + ".gllpLatitude").val()		: _self.params.defLat;
				_self.params.defLng  = $(_self.vars.cssID + ".gllpLongitude").val() ? $(_self.vars.cssID + ".gllpLongitude").val()	    : _self.params.defLng;
				_self.params.defZoom = 12;
				_self.vars.LATLNG = new google.maps.LatLng(_self.params.defLat, _self.params.defLng);
	
				_self.vars.MAPOPTIONS		 = _self.params.mapOptions;
				_self.vars.MAPOPTIONS.zoom   = _self.params.defZoom;
				_self.vars.MAPOPTIONS.center = _self.vars.LATLNG; 
	
				_self.vars.map = new google.maps.Map($(_self.vars.cssID + ".gllpMap").get(0), _self.vars.MAPOPTIONS);
				_self.vars.geocoder = new google.maps.Geocoder();
				_self.vars.elevator = new google.maps.ElevationService();
	
				_self.vars.marker = new google.maps.Marker({
					position: _self.vars.LATLNG,
					map: _self.vars.map,
					title: _self.params.strings.markerText,
					draggable: true
				});
	
				// Set position on doubleclick
				google.maps.event.addListener(_self.vars.map, 'click', function(event) {
					setPosition(event.latLng); 
					_self.vars.marker.setPosition(event.latLng);
				});
				$("#control_01").prop("checked", false);
				$("#control_02").prop("checked", false);
				$("#control_03").prop("checked", false);
				$("#control_04").prop("checked", false);
				$("#control_05").prop("checked", false);
				$("#control_06").prop("checked", false); 
				$("#predictor-form").on('submit', function() {
					// to each unchecked checkbox 
					$(this + 'input[type=checkbox]:not(:checked)').each(function () { 
						$(this).attr('checked', true).val(0);  
					});
					
				})
	
				// Set position on marker move
				google.maps.event.addListener(_self.vars.marker, 'dragend', function(event) {
					setPosition(_self.vars.marker.position); 
				});
	
				// Set zoom feld's value when user changes zoom on the map
				google.maps.event.addListener(_self.vars.map, 'zoom_changed', function(event) {
					$(_self.vars.cssID + ".gllpZoom").val( _self.vars.map.getZoom() );
					$(_self.vars.cssID).trigger("location_changed", $(_self.vars.cssID));
				});
	
				// Update location and zoom values based on input field's value
				$(_self.vars.cssID + ".gllpUpdateButton").bind("click", function() {
					var lat = $(_self.vars.cssID + ".gllpLatitude").val();
					var lng = $(_self.vars.cssID + ".gllpLongitude").val();
					var latlng = new google.maps.LatLng(lat, lng); 
					setPosition(latlng);
					
				});
	 
	
				// Zoom function triggered by gllp_perform_zoom listener
				$(document).bind("gllp_update_fields", function(event) {
					var lat = $(_self.vars.cssID + ".gllpLatitude").val();
					var lng = $(_self.vars.cssID + ".gllpLongitude").val();
					var latlng = new google.maps.LatLng(lat, lng);
					_self.vars.map.setZoom( parseInt( $(_self.vars.cssID + ".gllpZoom").val() ) );
					setPosition(latlng);
				});
			},
	
			// EXPORT PARAMS TO EASILY MODIFY THEM ////////////////////////////////////////////////////
			params : _self.params
	
		};
	
		return publicfunc;
	});
		
	$(document).ready( function() {
		if (!$.gMapsLatLonPickerNoAutoInit) { 
			$(".gllpLatlonPicker").each(function () {
				$obj = $(document).gMapsLatLonPicker();
				$obj.init( $(this) );
			});
		} 
		
	});
	//Identificar cambios en el mapa
	$(document).bind("location_changed", function(event, object) {
		//console.log("Se realizó el cambio: " + $(object).attr('id') ); 
	});
	
	}(jQuery)); 