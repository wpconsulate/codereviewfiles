<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://dmarkweb.com
 * @since             1.0.0
 * @package           Jcfinfused
 *
 * @wordpress-plugin
 * Plugin Name:       jcfInfused
 * Plugin URI:        https://dmarkweb.com/wordpress/plugins/jcfinfused
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            DM+Team
 * Author URI:        https://dmarkweb.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       jcfinfused
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

$jcfinfused = null;

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PLUGIN_NAME_VERSION', '1.0.0' );
define( 'PLUGIN_DB_VERSION', '1.0.0' );
define( 'JCFINFUSED_PATH', plugin_dir_path(  __FILE__ ) );
define( 'JCFINFUSED_URL', plugin_dir_url( __FILE__ ) );


define( 'JCFINFUSED_CONSULATION_QUESTIONNAIRE_LINK', "https://jcfcoaching.com/consultation-questionnaire/" );
define( 'JCFINFUSED_BRAVERMAN_ASSESSMENT_LINK', "https://jcfcoaching.com/braverman-assessment/" );
define( 'JCFINFUSED_BASIC_PRODUCT_IDS', '9895' );
define( 'JCFINFUSED_NTSS_PRODUCT_IDS', '9895,9896,9897,9898' );
define( 'JCFINFUSED_BASIC_POINTS', 1 );
define( 'JCFINFUSED_NTSS_POINTS', 4 );


require_once JCFINFUSED_PATH.'/vendor/autoload.php';


if ( !function_exists('pr') ){
    function pr( $arr , $dye = 0){
       $root = debug_backtrace();
       $file = str_replace($_SERVER['DOCUMENT_ROOT'],'',$root[0]['file']);
       $string = '</br>Line: '.$root[0]['line'].'</br>File : '.$file;

       echo "<pre>";        
       print_r($arr);        
       echo "</pre>";

       if($dye == 1){            
           die($string);
       }
    }
}



function addDMLog( $logs ){

    // pr($logs);

    try{
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "http://logs-01.loggly.com/inputs/64136f39-596c-4875-9dfb-4a56b4a1959d/tag/http/",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            // CURLOPT_POSTFIELDS => "{ \"message\" : \"API Call made\" }",
            CURLOPT_POSTFIELDS => $logs,
            CURLOPT_HTTPHEADER => array(
                // "Content-Type: application/json"
                "Content-Type: text/plain"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            // pr( "cURL Error #:" . $err );
        } else {
            // pr( $response );
        }
    }
    catch(Exception $e) {
        error_log( 'Unable to Post Log: ' .$e->getMessage() );
    }
    

}


/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-jcfinfused-activator.php
 */
function activate_jcfinfused() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-jcfinfused-activator.php';
	Jcfinfused_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-jcfinfused-deactivator.php
 */
function deactivate_jcfinfused() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-jcfinfused-deactivator.php';
	Jcfinfused_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_jcfinfused' );
register_deactivation_hook( __FILE__, 'deactivate_jcfinfused' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-jcfinfused.php';


/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_jcfinfused() {
    global $jcfinfused;
	$jcfinfused = new Jcfinfused();
    $jcfinfused->run();
}
run_jcfinfused();