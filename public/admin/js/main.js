 $(document).ready(function () {
	 
 	$(".ts-sidebar-menu li a").each(function () {
 		if ($(this).next().length > 0) {
 			$(this).addClass("parent");
 		};
 	})
 	var menux = $('.ts-sidebar-menu li a.parent');
 	$('<div class="more"><i class="fa fa-angle-down"></i></div>').insertBefore(menux);
 	$('.more').click(function () {
 		$(this).parent('li').toggleClass('open');
 	});
	$('.parent').click(function (e) {
		e.preventDefault();
 		$(this).parent('li').toggleClass('open');
 	});
 	$('.menu-btn').click(function () {
 		$('nav.ts-sidebar').toggleClass('menu-open');
 	});
	 
	 
	 $('#zctb').DataTable();
	 
	  
	 $('.datetimepicker').datetimepicker({
	   icons: {
		 time: "fa fa-clock-o",
		 date: "fa fa-calendar",
		 up: "fa fa-chevron-up",
		 down: "fa fa-chevron-down",
		 previous: 'fa fa-chevron-left',
		 next: 'fa fa-chevron-right',
		 today: 'fa fa-screenshot',
		 clear: 'fa fa-trash',
		 close: 'fa fa-remove'
	   }
	 });
	
 });
  
 function initMap() {
	


	const myLatlng = { lat: 1, lng: 1 };
	const map = new google.maps.Map(document.getElementById("map"), {
	  zoom: 4,
	  center: myLatlng,
	});
	const marker = new google.maps.Marker({
	  position: myLatlng,
	  map,
	  title: "Click to zoom",
	});
	map.addListener("center_changed", () => {
	  // 3 seconds after the center of the map has changed, pan back to the
	  // marker.
	  window.setTimeout(() => {
		map.panTo(marker.getPosition());
	  }, 3000);
	});
	marker.addListener("click", () => {
	  map.setZoom(8);
	  map.setCenter(marker.getPosition());
	});
  }
