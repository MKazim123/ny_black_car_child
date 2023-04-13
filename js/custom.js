jQuery(document).ready(function($) {

  
  var IspickUpChange = false;
  var IsdropOffChange = false;

    $( "#pickupdateField" ).datepicker({ minDate: 0 });

    // $( "#timeField" ).timepicker({
    //   interval: 15,
    //   zindex: 9
    // });
    mdtimepicker('#timeField', {
      theme: 'green'
    });

    const phoneInputField = document.querySelector("#phoneField");
    let phoneInput = null;
    if(phoneInputField){
      phoneInput = window.intlTelInput(phoneInputField, {
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        initialCountry: "us",
        preferredCountries: ["us","ca","gb" ],
        separateDialCode: true
      });
    }

      


    $('.edit-ico').click(() => {
      $('.fieldset-block fieldset').hide()
      $('.fieldset-block fieldset:first-child').show()

      $(".booking-container #progressbar li").removeClass("active")
      $(".booking-container #progressbar li:first-child").addClass("active")
    })

    $('button.submitBookAirport').click(() => {
        let pickUp = $('input#pickupField')
        let dropOff = $('input#dropOffField')
        let date = $('input#pickupdateField')
        let time = $('input#timeField')

        let fare = "";
        let formdata = new FormData();
        let pickup_postal_code = $('#pickup_postal_code').val();
        let dropoff_postal_code = $('#dropoff_postal_code').val();
        formdata.append('pickup',$(pickUp).val());
        formdata.append('dropoff',$(dropOff).val());
        formdata.append('pickup_postal_code',pickup_postal_code);
        formdata.append('dropoff_postal_code',dropoff_postal_code);
        formdata.append('action','get_car_fares_action');
        jQuery.ajax({
            type: "post",
            data : formdata,
            url: my_ajax_object.ajax_url,
            success: function(msg){
                let split_msg = msg.split("|");
                if(split_msg[0] != "error"){
                 
                  fare = msg;


                  var $pu, $do, $dt, $tm = false;
        
                  $pu = (validate(pickUp)) ?? false;
                  $do = (validate(dropOff)) ?? false;
                  $dt = (validate(date)) ?? false;
                  $tm = (validate(time)) ?? false;

                  if($pu && $do && $dt && $tm) {
                    let data = {
                        pickUp: $(pickUp).val(),
                        dropOff: $(dropOff).val(),
                        date: $(date).val(),
                        time: $(time).val(),
                        fare: fare,
                      }

                      if(IspickUpChange && IsdropOffChange){
                        localStorage.setItem('bookAirport',JSON.stringify(data))
                        window.location.href = "/blackcar/airport-booking/";
                      }else{
                        $('.bookingalert .alertcontent ul').append('<li>Please enter valid address</li>');
                        $('.bookingalert').show()
                        moveUp()
                      }
                        // setTimeout(() => {
                        // }, 1000);
                  }
                }
                else{
                  $('.bookingalert .alertcontent ul').append('<li>'+split_msg[1]+'</li>');
                  $('.bookingalert').show()
                  moveUp()
                }
                // alert(msg);
            },
            cache: false,
            contentType: false,
            processData: false
        });
        

        $('.bookingalert').hide()
        $('.bookingalert .alertcontent ul').html("")

        
    })


    window.PlaceAutocompleteSearch = () => {
        var options = {
          componentRestrictions: {country: "us"},
          fields: ["address_components", "geometry", "icon", "name"],
          strictBounds: false,
          types: ["establishment"],
        };

        var input = document.getElementById("pickupField");
        if(input){
            var autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.setFields(["place_id", "geometry", "name"]); 
            // console.log('pp')   
        }
          
          var inputtwo = document.getElementById("dropOffField");
          if(inputtwo){
            var autocompleteTwo = new google.maps.places.Autocomplete(inputtwo, options);
            autocompleteTwo.setFields(["place_id", "geometry", "name"]);    
            // console.log('dd')   
          }

        

        autocomplete.addListener("place_changed", () => {
          IspickUpChange = true;
          
          if(document.getElementById("dropOffField").value != ''){
            if(document.getElementById("wayPointMap")){
              routeChanged()
            }
          }

          var place = autocomplete.getPlace();
          var addressComponents = place.address_components;
          var postalCode = '';

          for (var i = 0; i < addressComponents.length; i++) {
            var addressType = addressComponents[i].types[0];
            if (addressType === 'postal_code') {
              postalCode = addressComponents[i].long_name;
            }
          }
          $('#pickup_postal_code').val(postalCode);
          console.log('Pickup postal code:', postalCode);
        });
        
        autocompleteTwo.addListener("place_changed", () => {
          IsdropOffChange = true;   
          
          if(document.getElementById("pickupField").value != ''){
            if(document.getElementById("wayPointMap")){
              routeChanged()
            }
          }
          var placeTwo = autocompleteTwo.getPlace();
          var addressComponentsTwo = placeTwo.address_components;
          var postalCodeTwo = '';

          for (var i = 0; i < addressComponentsTwo.length; i++) {
            var addressType = addressComponentsTwo[i].types[0];
            if (addressType === 'postal_code') {
              postalCodeTwo = addressComponentsTwo[i].long_name;
            }
          }
          $('#dropoff_postal_code').val(postalCodeTwo);
          console.log('Dropoff postal code:', postalCodeTwo);
        });

        $("input#pickupField").keydown(function () {
            IspickUpChange = false;
        });

        $("input#dropOffField").keydown(function () {
            IsdropOffChange = false;
        });

        if(document.getElementById("wayPointMap")){


          // GET LOCAL STORAGE DATA 
          

            var localAirport = localStorage.getItem('bookAirport')
            if(localAirport){
              localAirport = JSON.parse(localAirport)

              $('.dp-block input#pickupField').val(localAirport.pickUp)
              $('.dp-block input#dropOffField').val(localAirport.dropOff)
              $('.dp-block input#pickupdateField').val(localAirport.date)
              // $('.dp-block input#timeField').val(localAirport.time)
              // $('.dp-block input#timeField').attr("type", "time")
              mdtimepicker('#timeField', 'setValue', localAirport.time);

              let split_fare = localAirport.fare.split("//");
              let split_b_sedan = split_fare[0].split("||");
              let split_s_suv = split_fare[1].split("||");
              let split_l_suv = split_fare[2].split("||");
              $('.car_price.b_sedan').text("$"+split_b_sedan[0]);
              $('.car_price.b_sedan').attr('data-price', split_b_sedan[0]);
              $('.car_price.s_suv').text("$"+split_s_suv[0]);
              $('.car_price.s_suv').attr('data-price', split_s_suv[0]);
              $('.car_price.l_suv').text("$"+split_l_suv[0]);
              $('.car_price.l_suv').attr('data-price', split_l_suv[0]);

              $('input.b_sedan.service_charge').val(split_b_sedan[1]);
              $('input.b_sedan.tolls').val(split_b_sedan[2]);
              $('input.b_sedan.airport_fee').val(split_b_sedan[3]);
              $('input.b_sedan.congestion_fee').val(split_b_sedan[4]);
              $('input.b_sedan.fuel').val(split_b_sedan[5]);
              $('input.b_sedan.bcf').val(split_b_sedan[6]);
              $('input.b_sedan.sales_tax').val(split_b_sedan[7]);
              $('input.b_sedan.basic_fare').val(split_b_sedan[8]);

              $('input.s_suv.service_charge').val(split_s_suv[1]);
              $('input.s_suv.tolls').val(split_s_suv[2]);
              $('input.s_suv.airport_fee').val(split_s_suv[3]);
              $('input.s_suv.congestion_fee').val(split_s_suv[4]);
              $('input.s_suv.fuel').val(split_s_suv[5]);
              $('input.s_suv.bcf').val(split_s_suv[6]);
              $('input.s_suv.sales_tax').val(split_s_suv[7]);
              $('input.s_suv.basic_fare').val(split_s_suv[8]);

              $('input.l_suv.service_charge').val(split_l_suv[1]);
              $('input.l_suv.tolls').val(split_l_suv[2]);
              $('input.l_suv.airport_fee').val(split_l_suv[3]);
              $('input.l_suv.congestion_fee').val(split_l_suv[4]);
              $('input.l_suv.fuel').val(split_l_suv[5]);
              $('input.l_suv.bcf').val(split_l_suv[6]);
              $('input.l_suv.sales_tax').val(split_l_suv[7]);
              $('input.l_suv.basic_fare').val(split_l_suv[8]);
              
              IspickUpChange = true
              IsdropOffChange = true

              setTimeout(() => {
                routeChanged()
                // alert(jQuery('.vehicle-item input.service_charge').val());
              }, 3000);
            }


            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
            const map = new google.maps.Map(document.getElementById("wayPointMap"), {
                zoom: 6,
                center: { lat: -34.397, lng: 150.644 },
                disableDefaultUI: true,
                mapTypeControl: false,
                styles: [
                    {
                      elementType: "geometry",
                      stylers: [{ color: "#f5f5f5" }],
                    },
                    {
                      elementType: "labels.icon",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#616161" }],
                    },
                    {
                      elementType: "labels.text.stroke",
                      stylers: [{ color: "#f5f5f5" }],
                    },
                    {
                      featureType: "administrative.land_parcel",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#bdbdbd" }],
                    },
                    {
                      featureType: "poi",
                      elementType: "geometry",
                      stylers: [{ color: "#eeeeee" }],
                    },
                    {
                      featureType: "poi",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#757575" }],
                    },
                    {
                      featureType: "poi.park",
                      elementType: "geometry",
                      stylers: [{ color: "#E2E4F0" }],
                    },
                    {
                      featureType: "poi.park",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#9e9e9e" }],
                    },
                    {
                      featureType: "road",
                      elementType: "geometry",
                      stylers: [{ color: "#ffffff" }],
                    },
                    {
                      featureType: "road.arterial",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#757575" }],
                    },
                    {
                      featureType: "road.highway",
                      elementType: "geometry",
                      stylers: [{ color: "#dadada" }],
                    },
                    {
                      featureType: "road.highway",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#616161" }],
                    },
                    {
                      featureType: "road.local",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#9e9e9e" }],
                    },
                    {
                      featureType: "transit.line",
                      elementType: "geometry",
                      stylers: [{ color: "#e5e5e5" }],
                    },
                    {
                      featureType: "transit.station",
                      elementType: "geometry",
                      stylers: [{ color: "#eeeeee" }],
                    },
                    {
                      featureType: "water",
                      elementType: "geometry",
                      stylers: [{ color: "#C5D5E2" }],
                    },
                    {
                      featureType: "water",
                      elementType: "labels.text.fill",
                      stylers: [{ color: "#9e9e9e" }],
                    },
                  ]
              });

              var icons = {
                start: new google.maps.MarkerImage(
                 // URL
                 '/wp-content/uploads/2023/02/car-icon.png',
                 // (width,height)
                 new google.maps.Size( 43, 34 ),
                 // The origin point (x,y)
                 new google.maps.Point( 0, 0 ),
                 // The anchor point (x,y)
                 new google.maps.Point( 22, 32 )
                ),
                end: new google.maps.MarkerImage(
                 // URL
                 '/wp-content/uploads/2023/02/map_marker.png',
                 // (width,height)
                 new google.maps.Size( 36, 49 ),
                 // The origin point (x,y)
                 new google.maps.Point( 0, 0 ),
                 // The anchor point (x,y)
                 new google.maps.Point( 22, 32 )
                )
               };

            directionsRenderer.setOptions({
                polylineOptions: {
                  strokeColor: '#2DB640'
                }
              });

            directionsRenderer.setMap(map);
            let markers = [];

            function routeChanged () {
              directionsService.route({
                  origin: {
                      query: document.getElementById("pickupField").value,
                  },
                  destination: {
                      query: document.getElementById("dropOffField").value,
                  },
                  travelMode: google.maps.TravelMode.DRIVING,
                  })
                  .then((response) => {
                  directionsRenderer.setDirections(response);
                  setMapOnAll(null);
                  markers = [];
                  const leg = response.routes[ 0 ].legs[ 0 ];
                  makeMarker( leg.start_location, icons.start, "Pickup" );
                  makeMarker( leg.end_location, icons.end, 'Dropoff' );
                  setMapOnAll(map);
                  })
                  .catch((e) => console.log("Directions request failed due to " + e));
            }


                function makeMarker( position, icon, title ) {

                  const marker = new google.maps.Marker({
                      position: { lat: position.lat(), lng: position.lng() },
                      icon: icon,
                      title: title
                    });

                  markers.push(marker);
                }
                function setMapOnAll(map) {
                  for (let i = 0; i < markers.length; i++) {
                    markers[i].setMap(map);
                  }
                }
        }

    }
        
    var pickupInput = document.getElementById("pickupField");
    if(pickupInput){
        var scriptTag = document.createElement('script')
        scriptTag.id = 'google-map-api'
        scriptTag.setAttribute('type','text/javascript')
        scriptTag.setAttribute('src','https://maps.googleapis.com/maps/api/js?key={API_KEY}&libraries=places&callback=PlaceAutocompleteSearch')
        scriptTag.setAttribute('async',true)
        scriptTag.setAttribute('defer',true)
        $('body').append(scriptTag)
    }



    
    var swiper = new Swiper(".bookingSwiperThumb", {
        spaceBetween: 20,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
        }
      });
      var swiper2 = new Swiper(".bookingSwiper", {
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        thumbs: {
          swiper: swiper,
        },
      });


      function moveUp () {
        if(window.innerWidth < 767){
          window.scrollTo({top: 700, behavior: 'smooth'});
        }else{
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }


//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var error = false

$(".booking-container .next").click(function(){
	// if(animating) return false;
	// animating = true;


  $('.bookingalert').hide()
  $('.bookingalert .alertcontent ul').html("")
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();

  if($("fieldset").index(next_fs) < 3){
    // console.log($("fieldset").index(next_fs))
    $(".discountField").css("pointer-events", "unset")
    $(".discountField").css("opacity", "1")
    $(".discountField").attr('data-used', 0)
    $("input#discountField").val("")
    $("input#afterDiscount").val("")
    $("p.total-discount").remove()
    $("p.total-old").remove()
    $("p.grat-amount").remove()

    $('.total-block .sum-title span').text((parseFloat($('#basePrice').val())).toFixed(2))
    $('.total-block .sum-title').attr('data-total', (parseFloat($('#basePrice').val())).toFixed(2))
    $('input[type=radio][name=gr-radio]').prop('checked', false);



    var selected_vehicle = $('.vehicle-item.selected')
    var vehicle = $(selected_vehicle).children('.vehicle-content').children('h3').text()


    if(vehicle == 'Small Suv'){
      $('.bookingSwiper .swiper-wrapper .swiper-slide:first-child img').attr('src', '/wp-content/uploads/2023/03/car2mainf.png');
      $('.bookingSwiper .swiper-wrapper .swiper-slide:nth-child(2) img').attr('src', '/wp-content/uploads/2023/03/car2f2.png');
      $('.bookingSwiper .swiper-wrapper .swiper-slide:nth-child(3) img').attr('src', '/wp-content/uploads/2023/03/car2f3.png');

      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:first-child img').attr('src', '/wp-content/uploads/2023/03/car2g1.png');
      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:nth-child(2) img').attr('src', '/wp-content/uploads/2023/03/car2f2.png');
      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:nth-child(3) img').attr('src', '/wp-content/uploads/2023/03/car2f3.png');
      
    }else if(vehicle == 'Luxury Suv'){
      $('.bookingSwiper .swiper-wrapper .swiper-slide:first-child img').attr('src', '/wp-content/uploads/2023/03/car3mainf.png');
      $('.bookingSwiper .swiper-wrapper .swiper-slide:nth-child(2) img').attr('src', '/wp-content/uploads/2023/03/car3f2.png');
      $('.bookingSwiper .swiper-wrapper .swiper-slide:nth-child(3) img').attr('src', '/wp-content/uploads/2023/03/car3f3.png');

      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:first-child img').attr('src', '/wp-content/uploads/2023/03/car3g1.png');
      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:nth-child(2) img').attr('src', '/wp-content/uploads/2023/03/car3f2.png');
      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:nth-child(3) img').attr('src', '/wp-content/uploads/2023/03/car3f3.png');
      
    }else{
      $('.bookingSwiper .swiper-wrapper .swiper-slide:first-child img').attr('src', '/wp-content/uploads/2023/03/car1mainf.png');
      $('.bookingSwiper .swiper-wrapper .swiper-slide:nth-child(2) img').attr('src', '/wp-content/uploads/2023/03/car1ff2.png');
      $('.bookingSwiper .swiper-wrapper .swiper-slide:nth-child(3) img').attr('src', '/wp-content/uploads/2023/03/car1ff3.png');

      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:first-child img').attr('src', '/wp-content/uploads/2023/03/car1g1e.png');
      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:nth-child(2) img').attr('src', '/wp-content/uploads/2023/03/car1ff2.png');
      $('.bookingSwiperThumb .swiper-wrapper .swiper-slide:nth-child(3) img').attr('src', '/wp-content/uploads/2023/03/car1ff3.png');
    }
  }else{
    $('.dp-block').css('pointer-events','none')
    $('.dp-block').css('opacity','0.9')
  }

  
  // Set Fields Data
	setFieldData(current_fs, next_fs)

  // console.log(error)
  // if(!error){
  //   moveForward(current_fs, next_fs)
  // }
	
});


  function moveForward(current_fs, next_fs){

	//activate next step on progressbar using the index of next_fs
    $(".booking-container #progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    $(".booking-container #progressbar li").eq($(".booking-container fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show(); 
    current_fs.hide();
    // animating = false;
    moveUp();
  }

$(".booking-container .previous").click(function(){
	// if(animating) return false;
	// animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$(".booking-container #progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	$(".booking-container #progressbar li").eq($(".booking-container fieldset").index(previous_fs)).addClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
  current_fs.hide();
  
  $('.dp-block').css('pointer-events','unset')
  $('.dp-block').css('opacity','1')
    // animating = false;
  moveUp();

});

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(regex.test(email)){
      return true
    }else{
      $('.bookingalert .alertcontent ul').append('<li>Enter valid email.<br/>e.g: johndoe@example.com</li>');
      $('.bookingalert').show()
      moveUp();
      return false
    }
  }

  function validate(field) {


   var value = $(field).val()
  //  var type = $(field).attr('type')
   
   if(value == ''){

      var label = $(field).closest('.fieldContainer').siblings('.iconContainer').children('.text').text()
      $('.bookingalert .alertcontent ul').append('<li>' + label + ' field is required.</li>');
      $('.bookingalert').show()
      moveUp();
      return false
    }else{
      return true
   }

  }

  function vehicleValidation (selected_vehicle){
    if($(selected_vehicle).length == 0){
      $('.bookingalert .alertcontent ul').append('<li>Please select vehicle.</li>');
      $('.bookingalert').show()
      moveUp();
      return false
    }else{
      return true
    }
  }

  function setFieldData (current_fs, next_fs) {
    var current_index = $("fieldset").index(current_fs)

    var pickUp = $('input#pickupField')
    var dropOff = $('input#dropOffField')
    var date = $('input#pickupdateField')
    var time = $('input#timeField')

    var selected_vehicle = $('.vehicle-item.selected')

    var name = $('input#nameField')
    var email = $('input#emailField')
    var phone = $('input#phoneField')

    var flight_no = $('input#pickUpDetailField')
    var pickup_sign = $('input#pickUpSignField')
    var reference_code = $('input#referenceField')
    var special_req = $('input#notesField')

    var $pu, $do, $dt, $tm = false;
    
    $pu = (validate(pickUp)) ?? false;
    $do = (validate(dropOff)) ?? false;
    $dt = (validate(date)) ?? false;
    $tm = (validate(time)) ?? false;
    
    



    if($pu && $do && $dt && $tm) {
      if(IspickUpChange && IsdropOffChange){
        
          let data = {
            pickUp: $(pickUp).val(),
            dropOff: $(dropOff).val(),
            date: $(date).val(),
            time: $(time).val(),
          }
          localStorage.setItem('bookAirport',JSON.stringify(data))

        if(current_index == 0 && vehicleValidation(selected_vehicle)){
          moveForward(current_fs, next_fs);
        }
        else if(current_index == 1){
  
          var $na, $em, $ph = false;
          
          $na = (validate(name)) ?? false;
          $em = (validate(email)) ?? false;
          $ph = (validate(phone)) ?? false;
  
          if($na && $em && $ph){
  
            $em = (isEmail($(email).val())) ?? false;
            if($em){
              moveForward(current_fs, next_fs);
            }
          }
        }
        else if(current_index > 1){
          moveForward(current_fs, next_fs);
        }
      }else{
        $('.bookingalert .alertcontent ul').append('<li>Please enter valid address</li>');
        $('.bookingalert').show()
        moveUp()
      }
    }

    $('.vehicle-data div[data-field=Guest] p').text(($(name).val() != '') ? $(name).val() : 'N/A' )
    $('.vehicle-data div[data-field=Email] p').text(($(email).val() != '') ? $(email).val() : 'N/A' )
    $('.vehicle-data div[data-field=Phone] p').text(($(phone).val() != '') ? phoneInput.getNumber(intlTelInputUtils.numberFormat.E164) : 'N/A' )

    $('.vehicle-data div[data-field=Pickup-sign] p').text(($(pickup_sign).val() != '') ? $(pickup_sign).val() : 'N/A' )
    $('.vehicle-data div[data-field=Reference-code] p').text(($(reference_code).val() != '') ? $(reference_code).val() : 'N/A' )
    $('.vehicle-data div[data-field=Flight-number] p').text(($(flight_no).val() != '') ? $(flight_no).val() : 'N/A' )
    $('.vehicle-data div[data-field=Special-requests] p').text(($(special_req).val() != '') ? $(special_req).val() : 'N/A' )



    // moveForward(current_fs, next_fs);
  }


    $(".qty-btn").click(function(){
        var clck_type = $(this).attr("data-v")
        var val = parseInt($(this).siblings("p").attr("data-qty"));
        if(clck_type == "add"){
            if(val< 9){
                var result = val + 1
                $(this).siblings("p").attr("data-qty", result)
                $(this).siblings("p").text("0" + result)
            }
        }else{
            if(val> 1){
                var result = val - 1
                $(this).siblings("p").attr("data-qty", result)
                $(this).siblings("p").text("0" + result)
            }
        }
    })

    $(".veh-select").click(function(e){
        e.preventDefault()
        $(".vehicle-item").removeClass("selected")
        $(this).parents(".vehicle-item").addClass("selected")


        
    
        var vehicle_price = $('.vehicle-item.selected .vehicle-content .vehicle-footer .vehicle-footer-content h5').attr('data-price')
        var vehicle_quantity = $('.vehicle-item.selected .vehicle-content .vehicle-footer .v-qty p').attr('data-qty')
        var selected_vehicle = $('.vehicle-item.selected')
        var vehicle = $(selected_vehicle).children('.vehicle-content').children('h3').text()
        $('.vehicle-data div[data-field=Vehicle] p').text((vehicle != '') ? vehicle : 'N/A' )

        if(vehicle_quantity > 1){
          $('.vehicle-data div[data-field=Vehicle] p').append('<span> x' + vehicle_quantity + '</span')
        }else{
          $('.vehicle-data div[data-field=Vehicle] p span').remove()
        }

        var total_price = (vehicle_price * vehicle_quantity)
        // total_price = (total_price != '') ? total_price : 0

        $('.total-block .sum-title span').text((parseFloat(total_price)).toFixed(2))
        $('.total-block .sum-title').attr('data-total', (parseFloat(total_price)).toFixed(2))
        $('.total-block .sum-title').attr('data-oldTotal', (parseFloat(total_price)).toFixed(2))
        $('#basePrice').val(parseFloat(total_price).toFixed(2))
        $('#afterDiscount').val("")


        $('input[type=radio][name=gr-radio]').prop('checked', false);
        $('input#gratitudefield').val("")
        $('.bookFormField.gratitudeField').hide()
        $(".booking-container .next")[0].click()
    })



    $('input[type=radio][name=carseatradio]').change(function() {
        if (this.value == 'assistance') {
          $('.bookSeatBlock').hide()
          // $('input#seatsField').attr('disabled', true)
          // $('.seatsTypeField select').attr('disabled', true)
        }else{
          $('.bookSeatBlock').show()
          // $('input#seatsField').attr('disabled', false)
          // $('.seatsTypeField select').attr('disabled', false)
        }
    });

     $('input[type=radio][name=gr-radio]').change(function() {
      // var current_total = $('.total-block .sum-title').attr('data-oldTotal')
      // if(current_total == undefined){
      //   current_total = $('.total-block .sum-title').attr('data-total')
      // }

      // current_total = parseFloat(current_total)
        if(this.value != 'none'){
          if (this.value == 'fixed') {
              $('input#gratitudefield').val("")
              $('.bookFormField.gratitudeField').show()
              // $('.total-block .sum-title span').text(parseFloat(current_total).toFixed(2))
              // $('.total-block .sum-title').attr('data-total', parseFloat(current_total).toFixed(2))
              // $('.total-block .sum-title').attr('data-oldTotal', parseFloat(current_total).toFixed(2))
          }else{
              $('.bookFormField.gratitudeField').hide()
              // var total = current_total + (current_total * (parseFloat(this.value) / 100))
              // $('.total-block .sum-title span').text(parseFloat(total).toFixed(2))
              // $('.total-block .sum-title').attr('data-total', parseFloat(total).toFixed(2))
              // $('.total-block .sum-title').attr('data-oldTotal', parseFloat(current_total).toFixed(2))
          }
        }else{
          $('.bookFormField.gratitudeField').hide()
          // $('.total-block .sum-title span').text(parseFloat(current_total).toFixed(2))
          // $('.total-block .sum-title').attr('data-total', parseFloat(current_total).toFixed(2))
          // $('.total-block .sum-title').attr('data-oldTotal', parseFloat(current_total).toFixed(2))
        }
    calGrat()

    });

    $('input#gratitudefield').change(function() {
      // var current_total = $('.total-block .sum-title').attr('data-oldTotal')
      // if(current_total == undefined){
      //   current_total = $('.total-block .sum-title').attr('data-total')
      // }

      // current_total = parseFloat(current_total)
      // if($('input#gratitudefield').val() > 0){
      //   var total = (current_total + parseFloat($('input#gratitudefield').val()))
      //   $('.total-block .sum-title span').text(parseFloat(total).toFixed(2))
      //   $('.total-block .sum-title').attr('data-total', parseFloat(total).toFixed(2))
      //   $('.total-block .sum-title').attr('data-oldTotal', parseFloat(current_total).toFixed(2))
      // }else{
      //   $('.total-block .sum-title span').text(parseFloat(current_total).toFixed(2))
      //   $('.total-block .sum-title').attr('data-total', parseFloat(current_total).toFixed(2))
      //   $('.total-block .sum-title').attr('data-oldTotal', parseFloat(current_total).toFixed(2))
      // }
    calGrat()
    })

    $("input#discountField").on('keypress',function(e) {
        if(e.which == 13) {
          e.preventDefault()
          $(".discountField .fieldContainer button").click()
        }
    });

    $(".discountField .fieldContainer button").click(function(e){
        e.preventDefault()
        var code = $('input#discountField').val();
        var button = $('.discountField .fieldContainer button')
        var total = parseFloat($('#basePrice').val())
        if(code != ''){
          $.ajax({ 
            data: {action: 'discount_code', code:code, total: total},
            type: 'post',
            url: my_ajax_object.ajax_url,
            beforeSend: function() {
              $('.summary-discount .invalidText').remove()
              button.html('<div class="loader"></div>')
              button.attr('disabled', true)
            },
            success: function(data) {
                //  console.log(data); //should print out the name since you sent it along
                 button.html('Apply')
                 button.attr('disabled', false)

                if(data.success){
                  var discount_type = data.data.discount_type;
                  var discount_amount = parseInt(data.data.discount_amount);
                  var discount_percentage = data.data.discount_percentage;
                  var usage = data.data.usage;
                  var now_total = data.data.now_total
                  var discount_text = ''
  
                  if(discount_type == "Flat"){
                    discount_text = '-' + (discount_amount).toFixed(2) + ' USD'
                    
                  }else if(discount_type == "Percentage"){
                    discount_text = '-' + discount_percentage + '%'
                  }

                  $('.total-block .sum-title').attr('data-total', now_total.toFixed(2))
                  $('.total-block .sum-title').attr('data-oldTotal', now_total.toFixed(2))
                  $('.total-block .sum-title span').text(now_total.toFixed(2))
                  $('#afterDiscount').val(now_total.toFixed(2))

                  if($('.total-old').length > 0){
                    $('.total-old').html("Base Price: " + total.toFixed(2) + " <span>USD</span>")
                    $("<p class='total-discount'>Discount: " + discount_text + "</p>").insertAfter($(".total-old"));
                  }else{
                    $('.total-block').prepend("<p class='total-discount'>Discount: " + discount_text + "</p>")
                    $('.total-block').prepend("<p class='total-old'>Base Price: " + total.toFixed(2)  + " <span>USD</span></p>")
                  }
                  var grr = $('input[type=radio][name=gr-radio]:checked')
                  if($(grr).length > 0){
                    calGrat()
                  }
                  // $('.total-block').prepend("<p class='total-old'>Base price: " + total + " <span>USD</span></p>")

                  $(".discountField").css("pointer-events", "none")
                  $(".discountField").css("opacity", "0.7")
                  $(".discountField").attr('data-used', 1)
                  // $(".total-block").css("line-height", "40px")
                }
                else{
                  $('.summary-discount').append('<div class="invalidText">' + data.data.error + '</div>')
                  button.html('Apply')
                  button.attr('disabled', false)
                }
           },
           error: function(e) {
              //  console.log(e);
               $('.summary-discount').append('<div class="invalidText">Invalid Code</div>')
           }
        });
        }
    })


    
    function calGrat(){
      var basePrice = parseFloat($('#basePrice').val())
      var grat_total = 0
      var grat_amount = 0
      
      var afterDiscount = parseFloat($('#afterDiscount').val())
      console.log(afterDiscount)

      var grr = $('input[type=radio][name=gr-radio]:checked').val()
        if(grr != 'none'){
          if (grr == 'fixed') {
            var fixed_amount = parseFloat($('input#gratitudefield').val())
            if(fixed_amount > 0){
              grat_total = (afterDiscount > 0) ? afterDiscount + fixed_amount : basePrice + fixed_amount
              grat_amount = fixed_amount
            }else{
              grat_total = (afterDiscount > 0) ? afterDiscount : basePrice
              grat_amount = 0
            }
          }else{
            grat_amount = basePrice * (parseFloat(grr) / 100)

            var total = (afterDiscount > 0) ? afterDiscount + grat_amount: basePrice + grat_amount
            grat_total = total
          }
        }else{
          grat_total = (afterDiscount > 0) ? afterDiscount : basePrice
          grat_amount = 0
        }

        
      if($('.grat-amount').length > 0){
        $('.grat-amount').html("Gratuity: <span>" + grat_amount.toFixed(2) + "</span> USD")
      }else{
        $('.total-block').prepend("<p class='grat-amount'>Gratuity: <span>" + grat_amount.toFixed(2) + "</span> USD</p>")
      }

      if($('.total-old').length > 0){
        $('.total-old').html("Base Price: " + basePrice.toFixed(2) + " <span>USD</span>")
      }else{
        $('.total-block').prepend("<p class='total-old'>Base Price: " + basePrice.toFixed(2) + " <span>USD</span></p>")
      }


      $('.total-block .sum-title span').text((parseFloat(grat_total)).toFixed(2))
      $('.total-block .sum-title').attr('data-total', (parseFloat(grat_total)).toFixed(2))
      console.log(grat_total)
    }

})
