<?php

/**
 * Fired during plugin activation
 *
 * @link       https://dmarkweb.com
 * @since      1.0.0
 *
 * @package    Jcfinfused
 * @subpackage Jcfinfused/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Jcfinfused
 * @subpackage Jcfinfused/includes
 * @author     DM+Team <dmarkweb@gmail.com>
 */
class Jcfinfused_Activator {

	public function __construct() {

	}

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		
		global $wpdb;

		// Create table for coach/client relationship
		$table_name = $wpdb->prefix . "jcfinfused_clients";
		
		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_name (
							`id` INT(9) NOT NULL AUTO_INCREMENT,
							`infusionsoft_coach_id` INT(10) NOT NULL COMMENT 'UserId under infusionsoft',
							`infusionsoft_client_id` INT(10) NOT NULL COMMENT 'ContactId under infusionsoft',
							`order_id` INT(10) NOT NULL COMMENT 'WooCommerce Suscription Id',
							`points_earned` SMALLINT(10) NOT NULL,
							`coach_points` SMALLINT(10) NOT NULL 
							`coach_percentage` FLOAT(10) NOT NULL 
							`status` ENUM('active','inactive','suspended','') NOT NULL DEFAULT 'active',
							`created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
							PRIMARY KEY (`id`)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );

		add_option( 'jcfinfused_db_version', PLUGIN_DB_VERSION );

	}


	function install_data() {
		global $wpdb;
		
		$table_name = $wpdb->prefix . 'jcfinfused_clients';
		
		$wpdb->insert( 
				$table_name, 
				array( 
					'infusionsoft_coach_id' => 4454, 
					'infusionsoft_client_id' => 4454,
					'order_id' => 200,
					'points_earned' => 1,
					'coach_points' => 22,
					'coach_percentage' => 10.2,
					'status' => 'active',
					'created' => current_time( 'mysql' )
				)
			);
	}

}
