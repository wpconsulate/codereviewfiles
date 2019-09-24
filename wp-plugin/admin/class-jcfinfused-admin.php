<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://dmarkweb.com
 * @since      1.0.0
 *
 * @package    Jcfinfused
 * @subpackage Jcfinfused/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Jcfinfused
 * @subpackage Jcfinfused/admin
 * @author     DM+Team <dmarkweb@gmail.com>
 */
class Jcfinfused_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
        $this->version = $version;
        
        $this->load_dependencies();

        $this->init();

    }
    

    /**
	 * Load the required dependencies for this plugin.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for creating Submenu Pages
		 * core plugin.
		 */
		require_once dirname( __FILE__ ) . '/class-jcfinfused-submenu.php';

        /**
		 * Admin Settings Page
		 * core plugin.
		 */
        require_once dirname( __FILE__ ) . '/pages/class-settings.php';
        
	}

    public function init(){
        add_action( 'plugins_loaded', array($this, 'jcfinfused_admin_settings') );
    }


    public function jcfinfused_admin_settings(){
        $settings = new Jcfinfused_Submenu( new Jcfinfused_Settings() );
        $settings->init();
    }

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Jcfinfused_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Jcfinfused_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/jcfinfused-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Jcfinfused_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Jcfinfused_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/jcfinfused-admin.js', array( 'jquery' ), $this->version, false );

	}

}
