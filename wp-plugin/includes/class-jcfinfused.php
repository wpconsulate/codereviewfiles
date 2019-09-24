<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://dmarkweb.com
 * @since      1.0.0
 *
 * @package    Jcfinfused
 * @subpackage Jcfinfused/includes
 */

use Infusionsoft\Token;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Jcfinfused
 * @subpackage Jcfinfused/includes
 * @author     DM+Team <dmarkweb@gmail.com>
 */
class Jcfinfused {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Jcfinfused_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
    protected $version;
    
    /**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
    protected $infusionsoft;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'PLUGIN_NAME_VERSION' ) ) {
			$this->version = PLUGIN_NAME_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'jcfinfused';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Jcfinfused_Loader. Orchestrates the hooks of the plugin.
	 * - Jcfinfused_i18n. Defines internationalization functionality.
	 * - Jcfinfused_Admin. Defines all hooks for the admin area.
	 * - Jcfinfused_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-jcfinfused-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-jcfinfused-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-jcfinfused-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-jcfinfused-public.php';
        
        
		/**
		 * The class responsible for Hooks
		 */
        // require_once dirname( __FILE__ ) . '/class-jcfhooks.php';
        


		$this->loader = new Jcfinfused_Loader();
		

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Jcfinfused_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Jcfinfused_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Jcfinfused_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Jcfinfused_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
        $this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
        
        //Initialize the infusionsoft Instance
        $this->loader->add_action( 'plugins_loaded', $this, 'jcfInfuSetup', 1 );

        $this->loader->add_action( 'wp', $this, 'jcfInfuseCheck', 1 );
		
        $this->loader->add_action( 'infusedwoo_payment_complete', $plugin_public, 'jcfinfused_contact_update', 20, 2 );


        if (! wp_next_scheduled ( 'send_quest_reminder' )) {
            wp_schedule_event(time(), 'twicedaily', 'send_quest_reminder');
        }


        $this->loader->add_action( 'send_quest_reminder', $plugin_public, 'send_questionnaire_reminder' );
        // $this->loader->add_action( 'jcfinfused_renew', $plugin_public, 'jcfinfused_infuse_token' );

    }

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Jcfinfused_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
    }



    public function getProtectedVar($obj, $var){
        $propGetter = Closure::bind(  function($prop){return $this->$prop;}, $obj, $obj );
        return $propGetter($var);
    }
    

    public function jcfInfuseCheck( $try = 1 ){
        global $jcfinfused;

        if (get_option('jcfinfused_token')) {

            $jcfinfused_settings = get_option( 'jcfinfused_settings' );

            $jcfinfused_token = get_option('jcfinfused_token');

            try{
                $coaches = $jcfinfused->get_infusionsoft()->restfulRequest('get', $jcfinfused->get_infusionsoft()->getBaseUrl(). '/rest/v1/users');
            }
            catch(Exception $e) {
                
                if($try>1){
                    
                }
                try{
                    $refRes = $this->refreshToken( $jcfinfused_token->refreshToken, $jcfinfused_settings['api_client_id'], $jcfinfused_settings['api_client_secret'] );

                    if(isset($refRes['error']) && !empty($refRes['error'])){
                        
                    }else{
                        $this->infusionsoft->setToken(new Token( $refRes ));
                        update_option('jcfinfused_token', $this->infusionsoft->getToken() );
                        $this->jcfInfuseCheck($try+1);
                    }
                    
                }
                catch(Exception $e2) {
                    echo 'unable to refresh Token: ' .$e2->getMessage();
                }

                echo 'unable to fetch coaches Err: ' .$e->getMessage();
            }

        }

    }



    //----------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------- BOF InfusionSoft Function -----------------------------------------------------------


        /**
         * This function setup the InfusionSoft API and setup the basic details and access token etc
         * @uses get_option
         */
        public function jcfInfuSetup(){
            // Assuming we are setting a field inside a metabox
            $jcfinfused_settings = get_option( 'jcfinfused_settings' );

            if($jcfinfused_settings['api_client_id'] != "" && $jcfinfused_settings['api_client_secret'] != ""){

                $this->infuSetup( $jcfinfused_settings['api_client_id'], $jcfinfused_settings['api_client_secret'] );

            }

        }

        /**
         * Function that'll Initialize the Infusionsoft
         */
        private function infuSetup($api_client_id, $api_client_secret){

            // delete_option('jcfinfused_token');

            $this->infusionsoft = new Infusionsoft\Infusionsoft(array(
                'clientId'     => $api_client_id,
                'clientSecret' => $api_client_secret,
                'redirectUri'  => get_option('siteurl')."/wp-admin/options-general.php?page=jcfinfused_settings",
            ));
            

            // pr(get_option('jcfinfused_token'));
            
            if (get_option('jcfinfused_token')) {
                $this->infusionsoft->setToken( get_option('jcfinfused_token') );
            }


            //If Response code received from Infusionsoft and Token not set
            if ( isset($_GET['code']) ) {
                $this->infusionsoft->requestAccessToken($_GET['code']);
                update_option('jcfinfused_token', $this->infusionsoft->getToken() );
                $this->redirectURLtoDashboard();
                wp_die();

            }
            // If Token Not set redirect to Authorization URL
            else if ( !$this->infusionsoft->getToken() ){
                // pr($this->infusionsoft->getToken(), 1);
                if ( is_admin() && current_user_can('administrator') ){
                    $this->redirectAuthorizationUrl();
                }
                    
            }

            

            //If we need to refresh the Token??
            if( $this->infusionsoft->isTokenExpired() ){
                $refRes = $this->refreshToken( $this->infusionsoft->getToken()->refreshToken, $api_client_id, $api_client_secret );
                if(isset($refRes['error']) && !empty($refRes['error'])){
                    
                    if(is_admin()){
                        $this->redirectAuthorizationUrl();
                    }else{

                    }

                }else{
                    $this->infusionsoft->setToken(new Token( $refRes ));
                    update_option('jcfinfused_token', $this->infusionsoft->getToken() );
                }
            }
            
            // pr($refRes);
            
            // pr($this->getProtectedVar($contact, 'given_name'), 1);
            
            // pr($this->infusionsoft->getToken(), 1);
        }

        /**
         * @param string $code
         *
         * @return array
         * @throws InfusionsoftException
         */
        private function requestAccessToken( $code )
        {
            $params = array(
                'client_id'     => $this->infusionsoft->getClientId(),
                'client_secret' => $this->infusionsoft->getClientSecret(),
                'code'          => $code,
                'grant_type'    => 'authorization_code',
                'redirect_uri'  => $this->infusionsoft->getRedirectUri(),
            );
            $client = $this->infusionsoft->getHttpClient();
            
            try{

                $tokenInfo = $client->request('POST', $this->infusionsoft->getTokenUri(), [
                    'body'    => http_build_query($params),
                    'headers' => ['Content-Type' => 'application/x-www-form-urlencoded']
                ]);
                $tokenInfo = json_decode($tokenInfo, true);

                $this->infusionsoft->setToken(new Token( $tokenInfo ));
                // pr($this->infusionsoft->getToken(), 1);
                update_option('jcfinfused_token', $tokenInfo );
                
                return $this->infusionsoft->getToken();

            } catch (BadResponseException $e) {
                // pr($e, 1);
            }
            
        }



        public function refreshToken( $refToken, $api_client_id, $api_client_secret ){

            try {
                $curl = curl_init();
    
                curl_setopt_array($curl, array(
                    CURLOPT_URL => "https://api.infusionsoft.com/token",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS => "grant_type=refresh_token&refresh_token=".$refToken,
                    CURLOPT_HTTPHEADER => array(
                        "Content-Type: application/x-www-form-urlencoded",
                        "cache-control: no-cache"
                    ),
                    CURLOPT_HEADER => 0,
                    CURLOPT_USERPWD => $api_client_id . ":" . $api_client_secret
                ));
    
                $response = curl_exec($curl);
                $err = curl_error($curl);
    
                curl_close($curl);
    
                if ($err) {
                    return $err;
                } else {
                    return json_decode($response, true);
                }
            } catch (BadResponseException $e) {
                throw new HttpException($e->getMessage(), $e->getCode(), $e);
            }
        }


        /**
         * Function to redirect User to URL
         */
        private function redirectAuthorizationUrl(){
            wp_redirect($this->infusionsoft->getAuthorizationUrl());
            ?>
            <script type="text/javascript">
                // Simulate a mouse click:
                window.location.href = "<?php echo $this->infusionsoft->getAuthorizationUrl()?>";

                // Simulate an HTTP redirect:
                window.location.replace("<?php echo $this->infusionsoft->getAuthorizationUrl()?>");
            </script>
            <?php
            wp_die("redirecting to :".$this->infusionsoft->getAuthorizationUrl());
        }

        /**
         * Function to redirect User to URL
         */
        private function redirectURLtoDashboard(){
            wp_redirect(get_option('siteurl')."/wp-admin/options-general.php?page=jcfinfused_settings");
            ?>
            <script type="text/javascript">
                // Simulate a mouse click:
                window.location.href = "<?php echo get_option('siteurl').'/wp-admin/options-general.php?page=jcfinfused_settings'?>";

                // Simulate an HTTP redirect:
                window.location.replace("<?php echo get_option('siteurl').'/wp-admin/options-general.php?page=jcfinfused_settings'?>");
            </script>
            <?php
            // echo '<a href="'.get_option('siteurl')."/wp-admin/options-general.php?page=jcfinfused_settings".'">Redirect here</a>';
        }

        /**
         * Retrieve the infusionsoft instance
         *
         * @since     1.0.0
         * @return    string    The version number of the plugin.
         */
        public function get_infusionsoft() {
            return $this->infusionsoft;
        }

        
    
        private function addDemoContact(){
            /*
                    $contact = array(
                        'email_addresses' => array(
                            'email' => 'asadsadsadasda@test.com',
                            'field' => 'EMAIL1'
                        ),
                        'given_name' => 'John',
                        'family_name' => 'Doe',
                        'phone_numbers' => array(
                            'field' => 'PHONE1', 
                            'number' => '123-123-1234'
                        )
                    );
                    $this->infusionsoft->contacts->create($contact);
                */
        }


    //-------------------------------------------- EOF InfusionSoft Function -----------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------------


}
