<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

if ( !function_exists( 'chld_thm_cfg_locale_css' ) ):
    function chld_thm_cfg_locale_css( $uri ){
        if ( empty( $uri ) && is_rtl() && file_exists( get_template_directory() . '/rtl.css' ) )
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
endif;
add_filter( 'locale_stylesheet_uri', 'chld_thm_cfg_locale_css' );
         
if ( !function_exists( 'child_theme_configurator_css' ) ):
    function child_theme_configurator_css() {
        wp_enqueue_style( 'chld_thm_cfg_child', trailingslashit( get_stylesheet_directory_uri() ) . 'style.css', array( 'hello-elementor','hello-elementor','hello-elementor-theme-style' ) );
    }
endif;
add_action( 'wp_enqueue_scripts', 'child_theme_configurator_css', 10 );

// END ENQUEUE PARENT ACTION

/**
 * Proper way to enqueue scripts and styles.
 */
function wpdocs_theme_name_scripts() {
	// wp_enqueue_style( 'child-theme-style', get_stylesheet_directory_uri().'/style.css?v'.time() );
  
  wp_enqueue_style( 'jquery-ui-style', 'https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css');
  wp_enqueue_style( 'jquery-timepicker-style', get_stylesheet_directory_uri().'/css/mdtimepicker.css');
  
  
  wp_enqueue_script('jquery-ui-script', 'https://code.jquery.com/ui/1.13.2/jquery-ui.js', array ( 'jquery-core' ), 1.1, true);
  wp_enqueue_script( 'jquery-timepicker-script', get_stylesheet_directory_uri().'/js/mdtimepicker.min.js', array ( 'jquery-core' ), 1.2, true);

  // if(is_page_template( 'page-bookingform.php' )){
    wp_enqueue_style( 'swiper-style', 	'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css');
    wp_enqueue_style( 'intlTelInput-style', get_stylesheet_directory_uri().'/css/intlTelInput.css');
    
    wp_enqueue_script( 'swiper-script', 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js');
    wp_enqueue_script( 'intlTelInput-script', get_stylesheet_directory_uri().'/js/intlTelInput.min.js', array ( 'jquery-core' ), 1.1, true);
    wp_enqueue_script( 'paypal-script', 'https://www.paypal.com/sdk/js?client-id=Afx9LuDsOjCCjyzjV1WWUAaL7GljTUeAz3mLJqDD3nq7qjmTuSsyU3IN0I6H3ei9ziMm25rcepGunSjI&currency=USD&enable-funding=venmo&disable-funding=credit', array(), null, false);
    wp_enqueue_script('jToast', get_stylesheet_directory_uri().'/js/jToast.js', array ( 'jquery-core' ), 1.2, true);
  // }

  wp_enqueue_script('custom', get_stylesheet_directory_uri().'/js/custom.js?v'.time(), array ( 'jquery-core' ), 1.1, true);

  wp_localize_script( 'custom', 'my_ajax_object',
            array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );


}
add_action( 'wp_enqueue_scripts', 'wpdocs_theme_name_scripts' );  

add_shortcode( 'BookAirportTransfer', 'bookAirportTransfer' );
function bookAirportTransfer() {
	return '<div class="bookAirportTransfer">
    <div class="headingContainer">
      <h2>Book Airport Ride</h2>
      <small>For Guest Users Only</small>
      <hr class="gradientSeprator" />
    </div>
    <div class="bookingalert">
        <div class="alertcontent">
            <ul></ul>
        </div>
    </div>
    <div class="bookAirportFormContaienr">
      <div class="bookFormField pickUpField">
          <div class="iconContainer">
            <span class="pinIcon">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none">
                <path d="M9.31303 9.40408L5.58112 13.136L1.84921 9.40408C1.11112 8.66598 0.608478 7.72558 0.404843 6.70181C0.201208 5.67805 0.305727 4.61688 0.705185 3.65252C1.10464 2.68815 1.7811 1.86389 2.649 1.28398C3.51691 0.70406 4.5373 0.394531 5.58112 0.394531C6.62495 0.394531 7.64533 0.70406 8.51324 1.28398C9.38115 1.86389 10.0576 2.68815 10.4571 3.65252C10.8565 4.61688 10.961 5.67805 10.7574 6.70181C10.5538 7.72558 10.0511 8.66598 9.31303 9.40408ZM5.58112 6.84499C5.89217 6.84499 6.19048 6.72142 6.41043 6.50148C6.63038 6.28153 6.75394 5.98322 6.75394 5.67217C6.75394 5.36112 6.63038 5.06281 6.41043 4.84286C6.19048 4.62291 5.89217 4.49935 5.58112 4.49935C5.27007 4.49935 4.97176 4.62291 4.75181 4.84286C4.53187 5.06281 4.4083 5.36112 4.4083 5.67217C4.4083 5.98322 4.53187 6.28153 4.75181 6.50148C4.97176 6.72142 5.27007 6.84499 5.58112 6.84499Z" fill="#64666B"/>
              </svg>
            </span>
            <span class="text">Pick-Up</span>
          </div>
          <div class="fieldContainer">
            <input id="pickupField" name="pickup" type="text" placeholder="Address, Airport, Hotel,..." />
            <input type="hidden" name="place_id" id="place_id" />
            <input type="hidden" name="pickup_postal_code" id="pickup_postal_code" placeholder="Type Here">
          </div>
       </div>
      <div class="bookFormField dropOffField">
          <div class="iconContainer">
            <span class="pinIcon">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none">
                <path d="M9.31303 9.40408L5.58112 13.136L1.84921 9.40408C1.11112 8.66598 0.608478 7.72558 0.404843 6.70181C0.201208 5.67805 0.305727 4.61688 0.705185 3.65252C1.10464 2.68815 1.7811 1.86389 2.649 1.28398C3.51691 0.70406 4.5373 0.394531 5.58112 0.394531C6.62495 0.394531 7.64533 0.70406 8.51324 1.28398C9.38115 1.86389 10.0576 2.68815 10.4571 3.65252C10.8565 4.61688 10.961 5.67805 10.7574 6.70181C10.5538 7.72558 10.0511 8.66598 9.31303 9.40408ZM5.58112 6.84499C5.89217 6.84499 6.19048 6.72142 6.41043 6.50148C6.63038 6.28153 6.75394 5.98322 6.75394 5.67217C6.75394 5.36112 6.63038 5.06281 6.41043 4.84286C6.19048 4.62291 5.89217 4.49935 5.58112 4.49935C5.27007 4.49935 4.97176 4.62291 4.75181 4.84286C4.53187 5.06281 4.4083 5.36112 4.4083 5.67217C4.4083 5.98322 4.53187 6.28153 4.75181 6.50148C4.97176 6.72142 5.27007 6.84499 5.58112 6.84499Z" fill="#64666B"/>
              </svg>
            </span>
            <span class="text">Drop-Off</span>
          </div>
          <div class="fieldContainer">
            <input id="dropOffField" name="dropoff" type="text" placeholder="Address, Airport, Hotel,..." />
            <input type="hidden" name="dropoff_postal_code" id="dropoff_postal_code" placeholder="Type Here">
          </div>
       </div>
      <div class="bookFormField dateField">
          <div class="iconContainer">
            <span class="pinIcon">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M9.51318 1.98092H11.8588C12.0143 1.98092 12.1635 2.04271 12.2735 2.15268C12.3834 2.26265 12.4452 2.41181 12.4452 2.56733V11.9499C12.4452 12.1054 12.3834 12.2546 12.2735 12.3645C12.1635 12.4745 12.0143 12.5363 11.8588 12.5363H1.30345C1.14792 12.5363 0.998769 12.4745 0.888796 12.3645C0.778823 12.2546 0.717041 12.1054 0.717041 11.9499V2.56733C0.717041 2.41181 0.778823 2.26265 0.888796 2.15268C0.998769 2.04271 1.14792 1.98092 1.30345 1.98092H3.64909V0.808105H4.82191V1.98092H8.34036V0.808105H9.51318V1.98092ZM1.88986 5.49938V11.3635H11.2724V5.49938H1.88986ZM3.06268 7.84502H5.99472V10.1907H3.06268V7.84502Z" fill="#64666B"/>
              </svg>
            </span>
            <span class="text">Date</span>
          </div>
          <div class="fieldContainer">
          <input name="pickupdate" type="text" placeholder="Month, Day, Year"
          id="pickupdateField" >
          </div>
       </div>
      <div class="bookFormField timeField">
          <div class="iconContainer">
            <span class="pinIcon">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.58113 12.1227C3.3424 12.1227 0.717041 9.49736 0.717041 6.25862C0.717041 3.01989 3.3424 0.394531 6.58113 0.394531C9.81987 0.394531 12.4452 3.01989 12.4452 6.25862C12.4452 9.49736 9.81987 12.1227 6.58113 12.1227ZM7.16754 6.25862V3.32658H5.99472V7.43144H9.51318V6.25862H7.16754Z" fill="#64666B"/>
              </svg>
            </span>
            <span class="text">Time</span>
          </div>
          <div class="fieldContainer">
            <input name="time" id="timeField" type="text" placeholder="Select Time" />
          </div>
       </div>
    </div>
    <div class="submitContainer">
        <hr class="gradientSeprator" />
        <button class="submitBookAirport">Search</submit>
    </div>
  </div>';
}

add_action('wp_ajax_discount_code', 'discount_code');
add_action('wp_ajax_nopriv_discount_code', 'discount_code');

function discount_code()
{
// echo $_POST['code'];    
  $args  = array(
    'posts_per_page'    => 1,
    'post_type'         => 'discount-code',
    's'    => $_POST['code'],
    'exact' => true
  );

  $the_query = new WP_Query( $args );

  if( $the_query->have_posts() ){
    // echo "YES";
    $discount_type = '';
    $usage = '';
    $expiry_date = '';
    $discount_amount = '';
    $discount_percentage = '';
    $total = $_POST['total'];
    $now_total = 0;

    while( $the_query->have_posts() ){
      $the_query->the_post();
      $discount_type = get_field('discount_type');
      $usage = get_field('usage');
      $expiry_date = get_field('expiry_date');
      $discount_amount = get_field('discount_amount');
      $discount_percentage = get_field('discount_percentage');
    }
    // echo $usage;
    if($usage  == 'One Time'){
      $code_used = get_field('code_used');
      if($code_used){
        wp_send_json_error( array( 
          'error' => 'Code already used.',
        ), 200 );
        exit;
      }
    }

    if($expiry_date){
      $date_now = date("d/m/Y"); // this format is string comparable 31/03/2023
  
      if ($date_now > $expiry_date) {
          wp_send_json_error( array( 
            'error' => 'Code is Expired.',
          ), 200 );
          exit;

      }
    }

    
    if($discount_type == "Flat"){
      if($total < $discount_amount){
        wp_send_json_error( array( 
          'error' => 'Discount is more than actual price, so this code cannot be used.',
        ), 200 );
        exit;
      }
      $now_total = ($total - $discount_amount);
      
    }else if($discount_type == "Percentage"){
      $numVal1 = $total;
      $numVal2 = $discount_percentage / 100;
      $now_total = $numVal1 - ($numVal1 * $numVal2);
    }

    
    wp_send_json_success( array( 
      'discount_type' => $discount_type, 
      'usage' => $usage,
      'discount_amount' => $discount_amount,
      'discount_percentage' => $discount_percentage,
      'now_total' => $now_total
    ), 200 );


  }else{
    wp_send_json_error( array( 
      'error' => 'Invalid Code',
    ), 200 );
  }

  wp_reset_query();
  exit;
}


add_action('wp_ajax_get_car_fares_action', 'get_car_fares_funt');
add_action('wp_ajax_nopriv_get_car_fares_action', 'get_car_fares_funt');

function get_car_fares_funt(){
  global $wpdb;

  $all_postal_codes = array (
    0 => '10001',
  1 => '10002',
  2 => '10003',
  3 => '10004',
  4 => '10005',
  5 => '10006',
  6 => '10007',
  7 => '10009',
  8 => '10010',
  9 => '10011',
  10 => '10012',
  11 => '10013',
  12 => '10014',
  13 => '10015',
  14 => '10016',
  15 => '10017',
  16 => '10018',
  17 => '10019',
  18 => '10020',
  19 => '10021',
  20 => '10022',
  21 => '10023',
  22 => '10024',
  23 => '10025',
  24 => '10026',
  25 => '10027',
  26 => '10028',
  27 => '10029',
  28 => '10030',
  29 => '10031',
  30 => '10032',
  31 => '10033',
  32 => '10034',
  33 => '10035',
  34 => '10036',
  35 => '10037',
  36 => '10038',
  37 => '10039',
  38 => '10040',
  39 => '10041',
  40 => '10044',
  41 => '10045',
  42 => '10048',
  43 => '10055',
  44 => '10060',
  45 => '10069',
  46 => '10090',
  47 => '10095',
  48 => '10098',
  49 => '10099',
  50 => '10103',
  51 => '10104',
  52 => '10105',
  53 => '10106',
  54 => '10107',
  55 => '10110',
  56 => '10111',
  57 => '10112',
  58 => '10115',
  59 => '10118',
  60 => '10119',
  61 => '10120',
  62 => '10121',
  63 => '10122',
  64 => '10123',
  65 => '10128',
  66 => '10151',
  67 => '10152',
  68 => '10153',
  69 => '10154',
  70 => '10155',
  71 => '10158',
  72 => '10161',
  73 => '10162',
  74 => '10165',
  75 => '10166',
  76 => '10167',
  77 => '10168',
  78 => '10169',
  79 => '10170',
  80 => '10171',
  81 => '10172',
  82 => '10173',
  83 => '10174',
  84 => '10175',
  85 => '10176',
  86 => '10177',
  87 => '10178',
  88 => '10199',
  89 => '10270',
  90 => '10271',
  91 => '10278',
  92 => '10279',
  93 => '10280',
  94 => '10281',
  95 => '10282',
  );

  $pickup_org = $_POST['pickup'] ? $_POST['pickup'] : "";
  $dropoff_org = $_POST['dropoff'] ? $_POST['dropoff'] : "";
  $pickup_postal_code = $_POST['pickup_postal_code'] ? $_POST['pickup_postal_code'] : "";
  $dropoff_postal_code = $_POST['dropoff_postal_code'] ? $_POST['dropoff_postal_code'] : "";

  $pickup = $_POST['pickup'] ? $_POST['pickup'] : "";
  $dropoff = $_POST['dropoff'] ? $_POST['dropoff'] : "";

  $pickup = str_replace(',', '', $pickup);
  $dropoff = str_replace(',', '', $dropoff);

  $pickup = str_replace('(', '', $pickup);
  $dropoff = str_replace('(', '', $dropoff);

  $pickup = str_replace(')', '', $pickup);
  $dropoff = str_replace(')', '', $dropoff);

  $pickup = str_replace('-', ' ', $pickup);
  $dropoff = str_replace('-', ' ', $dropoff);

  $pickup_ex = explode(" ", $pickup);
  $dropoff_ex = explode(" ", $dropoff);

  if(in_array($pickup_postal_code, $all_postal_codes) || in_array($dropoff_postal_code, $all_postal_codes)){
    $new_pickup = in_array( "JFK" ,$pickup_ex ) ? "JFK" : "";
    $new_pickup = in_array( "LGA" ,$pickup_ex ) ? "LGA" : $new_pickup;
    $new_pickup = in_array( "EWR" ,$pickup_ex ) ? "EWR" : $new_pickup;
    $new_pickup = in_array( "Manhattan" ,$pickup_ex ) ? "Manhattan" : $new_pickup;

    $new_dropoff = in_array( "JFK" ,$dropoff_ex ) ? "JFK" : "";
    $new_dropoff = in_array( "LGA" ,$dropoff_ex ) ? "LGA" : $new_dropoff;
    $new_dropoff = in_array( "EWR" ,$dropoff_ex ) ? "EWR" : $new_dropoff;
    $new_dropoff = in_array( "Manhattan" ,$dropoff_ex ) ? "Manhattan" : $new_dropoff;


    $new_pickup = empty($new_pickup) ? "Manhattan" : $new_pickup;
    $new_dropoff = empty($new_dropoff) ? "Manhattan" : $new_dropoff;

    $fares = array();

    $sql = "SELECT * FROM `wp_fares` WHERE `pickup` = '".$new_pickup."' AND `dropoff` = '".$new_dropoff."' ORDER BY `fare` ASC";
    $results = $wpdb->get_results($sql);
    if(!empty($results)){
      if($results[0]->airport_address == $pickup_org || $results[0]->airport_address == $dropoff_org){
        foreach($results as $result){
          $sql_tax = "SELECT * FROM `wp_fare_taxes` WHERE `id` = ".$result->tax_id." ";
          $results_tax = $wpdb->get_results($sql_tax);
          array_push($fares, $results_tax[0]->all_inclusive.'||'.$results_tax[0]->service_charge.'||'.$results_tax[0]->tolls.'||'.$results_tax[0]->airport_fee.'||'.$results_tax[0]->congestion_fee.'||'.$results_tax[0]->fuel.'||'.$results_tax[0]->bcf.'||'.$results_tax[0]->sales_tax.'||'.$result->fare);
        }
        echo implode("//", $fares);
      }
      else{
        echo "error|Sorry! No route found.";
      }
    }
    else{
      echo "error|Sorry! No route found.";
    }
    
  }
  else{
    echo "error|Please enter valid address";
  }
  die();

}


// add_filter( 'woocommerce_paypal_checkout_description', 'custom_paypal_checkout_description', 10, 2 );
// function custom_paypal_checkout_description( $description, $order_id ) {
//     $new_description = "Your extra description goes here.";
//     return $description . $new_description;
// }


