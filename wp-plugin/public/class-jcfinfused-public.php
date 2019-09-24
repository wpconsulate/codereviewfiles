<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://dmarkweb.com
 * @since      1.0.0
 *
 * @package    Jcfinfused
 * @subpackage Jcfinfused/public
 */


use Infusionsoft\Token;
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Jcfinfused
 * @subpackage Jcfinfused/public
 * @author     DM+Team <dmarkweb@gmail.com>
 */
class Jcfinfused_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
        $this->version = $version;
        
        add_action( 'wp_ajax_jcf_preview', array($this, 'jcf_preview') );
        add_action( 'wp_ajax_jcf_demo', array($this, 'send_questionnaire_reminder') );

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/jcfinfused-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/jcfinfused-public.js', array( 'jquery' ), $this->version, false );

    }


    /**
     * Function that makes the Infusionsoft API call to update the Infusionsoft Contact and assign the Contact Owner User
     * @param accessToken
     * @param ContactId
     * @param ownerId
     */
    function apiAssignOwner($accessToken, $contactId, $ownerId){
        
        try {
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://api.infusionsoft.com/crm/rest/v1/contacts/".$contactId."/?access_token=".$accessToken,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "PATCH",
                CURLOPT_POSTFIELDS => "{\n  \"owner_id\": ".$ownerId."\n}",
                CURLOPT_HTTPHEADER => array(
                  "Content-Type: application/json",
                  "cache-control: no-cache"
                ),
            ));
            
            $response = curl_exec($curl);
            $err = curl_error($curl);
              
            curl_close($curl);

            if ($err) {
                return $err;
            } else {
                return $response;
            }
        } catch (BadResponseException $e) {
            throw new HttpException($e->getMessage(), $e->getCode(), $e);
        }
    
    }


    /**
     * Function to send Email Notification to contact by Coach User
     * @param accessToken
     * @param ContactId
     * @param ownerId
     */
    function sendEmailNotification($accessToken, $contactId, $userId, $payload){
        try {
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://api.infusionsoft.com/crm/rest/v1/emails/queue/?access_token=".$accessToken,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "PATCH",
                CURLOPT_POSTFIELDS => $payload,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json",
                    "cache-control: no-cache"
                ),
            ));
            
            $response = curl_exec($curl);
            $err = curl_error($curl);
              
            curl_close($curl);

            if ($err) {
                return $err;
            } else {
                return $response;
            }
        } catch (BadResponseException $e) {
            throw new HttpException($e->getMessage(), $e->getCode(), $e);
        }
    
    }


    public function jcfinfused_get_next_owner(){

        $jcfinfused_settings = get_option( 'jcfinfused_settings' );
        $owner_id = 0;
        if(isset($jcfinfused_settings['rows']) && !empty($jcfinfused_settings['rows'])){
            $_users = [];
            $_users_data = [];
            $_default_priotiry = [];

            // First let's create an array with Priorites & one for Users's adding their Id's to keys
            foreach( $jcfinfused_settings['rows'] as $key=>$field ) {
                // pr($field);
                if($field['percent'] < 100){
                    // $_users[$field['user']] = isset($_users[$field['user']])?$_users[$field['priority']]:$field['priority'];
                    // $_users[$field['user']] = $field['priority'];
                    $_users[$field['priority']] = $field['user'];
                }
                $_users_data[$field['user']] = $field;
                $_default_priotiry[$field['priority']] = $field['user'];
            }

            //If Coaches are all over 100% Just send all users to Priority 1 coach
            if(empty($_users)){
                $_users = $_default_priotiry;
            }

            ksort($_users);
            $owner_id = current($_users);
            // pr($jcfinfused_settings['rows']);
            // pr($_users);
            // pr($owner_id);
            // pr($_users_data[$owner_id], 1);
        }
        // return $owner_id;
        return $_users_data[$owner_id];
    }

    
    public function jcfinfused_owner_update_percentage($owner_id, $points){

        $jcfinfused_settings = get_option( 'jcfinfused_settings' );
        
        if(isset($jcfinfused_settings['rows']) && !empty($jcfinfused_settings['rows'])){

            foreach( $jcfinfused_settings['rows'] as $key=>$field ) {
                // pr($field);
                if($field['user'] == $owner_id){

                    $current_points = ( $field['points'] * $field['percent'] ) / 100;
                    $new_points = $current_points + $points;
                    $jcfinfused_settings['rows'][$key]['percent'] = ($new_points * 100) / $field['points'];

                    // pr('percent');
                    // pr(($new_points * 100) / $field['points']);

                }
                
            }
            // pr($jcfinfused_settings);
            update_option('jcfinfused_settings', $jcfinfused_settings);
            // pr(1,1);

        }
        return $owner_id;
    }
    

    /**
     * Function to return the Client Contact based on the ContactID
     * @var $contactID Id for coach to retrive
     * @return Array empty Array if no match found
     */
    public function getContactById( $contactID ){
        global $jcfinfused;
        // $client = $jcfinfused->get_infusionsoft()->contacts->find($contactId);
        $client = $jcfinfused->get_infusionsoft()->restfulRequest('get', $jcfinfused->get_infusionsoft()->getBaseUrl(). '/rest/v1/contacts/'.$contactID);
        return $client;
    }


    /**
     * Function to return the Coach User from the list of Coaches
     * @var $coachId Id for coach to retrive
     * @return Array empty Array if no match found
     */
    public function getCoachById( $coachId ){
        global $jcfinfused;
        $coaches = $jcfinfused->get_infusionsoft()->restfulRequest('get', $jcfinfused->get_infusionsoft()->getBaseUrl(). '/rest/v1/users');

        // return ;
        foreach($coaches['users'] as $coach){
            if( $coach['id'] == $coachId )
                return $coach;
        }
        return [];
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
	public function jcfinfused_contact_update($order_id, $contactId = 0 ) {

        global $jcfinfused, $wpdb;

        if (get_option('jcfinfused_token')) {

            $jcfinfused_token = get_option('jcfinfused_token');

            $order = wc_get_order( $order_id );
            //If Order exists
            if($order){
            
                $order->add_order_note("jcfinfused Contact Owner Assignment\n" );

                $consultation_questionnaire = JCFINFUSED_CONSULATION_QUESTIONNAIRE_LINK;
                $braverman_assessment = JCFINFUSED_BRAVERMAN_ASSESSMENT_LINK;

                $questionnaire_link = "";
                
                $points = 0;
                $points_earned = 0;

                foreach ($order->get_items() as $item_id => $item_data) {
                    $product = $item_data->get_product();

                    // $valid_product_ids = [10386, 2899, 13936, 13941];
                    
                    $basic_product_ids = [JCFINFUSED_BASIC_PRODUCT_IDS];
                    $ntss_product_ids = [JCFINFUSED_NTSS_PRODUCT_IDS];

                    if( in_array($product->get_id(), $basic_product_ids) ){
                        
                        $points_earned = JCFINFUSED_BASIC_POINTS;

                        $points += $points_earned;
                        
                    }else{
                        $points_earned = JCFINFUSED_NTSS_POINTS;

                        $points += $points_earned;
                    }

                    $is_ntss = false;
                    if( in_array($product->get_id(), $ntss_product_ids) ){
                        $questionnaire_link = '<a href="'.$consultation_questionnaire.'">Consultation Questionnaire</a><br />';
                        $is_ntss = true;
                    }else{
                        $questionnaire_link = '<a href="'.$consultation_questionnaire.'">Consultation Questionnaire</a><br />';
                        $questionnaire_link .= '<a href="'.$braverman_assessment.'">Braverman Assessment</a><br />';
                    }

                }

                //Get the Possible Next Owner
                $owner = $this->jcfinfused_get_next_owner();
                $owner_id = $owner['user'];

                if($owner_id){

                        try{
                            $contactUpdate = $this->apiAssignOwner( $jcfinfused_token->accessToken, $contactId, $owner_id );
                            addDMLog( json_encode( [ 'api'=>'apiAssignOwner', 'response' => $contactUpdate] ) );
                        }
                        //catch exception
                        catch(Exception $e) {
                            echo 'apiAssignOwner Err: ' .$e->getMessage();
                        }


                        // Insert Client Data
                        $clientData = [
                                        'infusionsoft_coach_id' => $owner_id,
                                        'infusionsoft_client_id' => $contactId,
                                        'order_id' => $order_id,
                                        'points_earned' => $points_earned,
                                        'coach_points' => $points,
                                        'status' => 'active',
                                        'created' => current_time( 'mysql' )
                                        ];
                        $wpdb->insert( $wpdb->prefix . "jcfinfused_clients",  $clientData );
                        // Insert Client Data

                        $this->jcfinfused_owner_update_percentage( $owner_id, $points );

                        //Default to Justin Hughes
                        // $coachLink = "http://www.scheduleyou.in/6ZzGBLYr3N";

                        // if( $owner_id == 4454 )
                        //     $coachLink = "http://www.scheduleyou.in/6ZzGBLYr3N";

                        // if( $owner_id == 5456 )
                        //     $coachLink = "http://www.scheduleyou.in/sgSrpxjTp8";


                        $coachLink = $owner['link'];
                        
                        try{
                        
                            $contact = $this->getContactById( $contactId );
                            // pr($contactId);
                            

                        }
                        //catch exception
                        catch(Exception $e) {
                            addDMLog( json_encode( [ 'api'=>'getCoachById', 'error' => $e] ) );
                            $contact = ['given_name'=>'JCF User'];
                        }
                        

                        try{
                            $coach = $this->getCoachById($owner_id);
                            
                            if(isset($coach['preferred_name'])){
                                $coach_name = $coach['preferred_name'];
                            }else{
                                $coach_name = "JCF Coach";
                            }

                        }
                        //catch exception
                        catch(Exception $e) {
                            $coach_name = "JCF Coach";
                            addDMLog( json_encode( [ 'api'=>'getCoachById', 'error' => $e] ) );
                        }

                        // Send email Notification to the Contact
                        $template_vars = [
                                            'contact_id'=>$contactId,
                                            'owner_id'=>$owner_id,
                                            // 'client_name'=>$jcfinfused->getProtectedVar( $contact, 'given_name' ),
                                            'client_name'=>$contact['given_name'],
                                            'coach_name'=>$coach_name,
                                            'coach_link'=>$coachLink,
                                            'appstore_link'=>$owner_id,
                                            'is_ntss'=>$is_ntss,
                                            'playstore_link'=>$owner_id,
                                            'questionnaire_link'=>$questionnaire_link
                                        ];
                        
                        
                        
                        try{
                            $welcm_email_contents = $this->jcfinfused_welcm_email_contents( $template_vars );

                            $emailRequestVars = [
                                                    "contacts"=>[$contactId],
                                                    "html_content"=>base64_encode($welcm_email_contents), 
                                                    "subject" => "Welcome to JCF Coaching!", 
                                                    "user_id"=>$owner_id 
                                                ];

                            
                            
                            // Queue Email to be sent via Infusionsoft
                            $response = $jcfinfused->get_infusionsoft()->restfulRequest('post', $jcfinfused->get_infusionsoft()->getBaseUrl(). '/rest/v1/emails/queue', $emailRequestVars);
                            

                            $email_html = $this->jcfinfused_email_contents( $template_vars );

                            $emailRequestVars = [
                                                    "contacts"=>[$contactId],
                                                    "html_content"=>base64_encode($email_html), 
                                                    "subject" => "Thank You for Subscrbing. Let's Get in Touch!", 
                                                    "user_id"=>$owner_id
                                                ];
                            
                            // Queue Email to be sent via Infusionsoft
                            $response = $jcfinfused->get_infusionsoft()->restfulRequest('post', $jcfinfused->get_infusionsoft()->getBaseUrl(). '/rest/v1/emails/queue', $emailRequestVars);

                        }
                        //catch exception
                        catch(Exception $e) {
                            error_log("can't send Email Notificatons upon Subscription Purchase for contact Id:".$contactId."!");
                            addDMLog( json_encode( [ 'api'=>'EmailQueue', 'error' => $e] ) );
                        }

                        $questionnaire_reminder = get_option('questionnaire_reminder');

                        if( !isset($questionnaire_reminder[$contactId]) ){
                            $template_vars['reminder'] = 1;
                            $questionnaire_reminder[$contactId] = $template_vars;
                            update_option('questionnaire_reminder',$questionnaire_reminder);
                        }

                        
                        try{
                            // Make GET request call to Mobile API
                            // $res_2 = $jcfinfused->get_infusionsoft()->restfulRequest('get', 'http://cron.jcfcoaching.com/create_and_connect/client/'.$contact['email_addresses'][0]['email']);
                            $res_2 = $jcfinfused->get_infusionsoft()->restfulRequest('get', 'http://cron.jcfcoaching.com/create_and_connect/contact_id/'.$contactId);

                            
                            //add logs
                            addDMLog( json_encode( [ 'api'=>'create_and_connect', 'response' => $res_2] ) );

                        }
                        //catch exception
                        catch(Exception $e) {
                            addDMLog( json_encode( [ 'api'=>'create_and_connect', 'error' => $e] ) );
                            error_log("Unable to call the create_and_connect API for contact ID:".$contactId."!");
                        }

                        // $this->sendEmailNotification($jcfinfused_token->accessToken, $contactId, $owner_id);
                        // pr($points, 1);
                        // pr($contactUpdate);
                    
                    
                }

            }

        }

        
    }


    /**
    * Function that is helpful parsing template files
    */
    function templatify($file, $to_replace_array){

        if( file_exists($file) ){
            $txt = file_get_contents($file);
            foreach($to_replace_array as $key=>$val){
                $txt = str_replace('{'.$key.'}', $val, $txt);
                // echo $key."=".$val;
            }
            return $txt;
        }
        return '';
    }

    
    /**
    * Function that is helpful parsing template files
    */
    function templatify_text($txt, $to_replace_array){

        foreach($to_replace_array as $key=>$val){
            $txt = str_replace('{'.$key.'}', $val, $txt);
            // echo $key."=".$val;
        }
        return $txt;

    }



    function jcfinfused_email_contents($template_vars){

        $jcfinfused_settings = get_option( 'jcfinfused_settings' );

        // pr($jcfinfused_settings);

        $email_contents = stripslashes( html_entity_decode($jcfinfused_settings['email_contents']) );

        $template_vars['email_title'] = $this->templatify_text( $jcfinfused_settings['email_title'], $template_vars );

        $template_vars['email_greetings'] = $this->templatify_text( $jcfinfused_settings['email_greetings'], $template_vars );
        
        $template_vars['email_subtitle'] = $this->templatify_text( $jcfinfused_settings['email_subtitle'], $template_vars );

        $template_vars['body'] = $this->templatify_text( $email_contents, $template_vars );

        $email_html = $this->templatify( JCFINFUSED_PATH . '/templates/email/new-subscription.html', $template_vars );

        return $email_html;
        
    }



    function jcfinfused_welcm_email_contents($template_vars){

        $jcfinfused_settings = get_option( 'jcfinfused_settings' );

        // pr($jcfinfused_settings);

        $email_contents = stripslashes( html_entity_decode($jcfinfused_settings['welcm_email_contents']) );

        $template_vars['email_title'] = stripslashes($jcfinfused_settings['welcm_email_title']);

        $template_vars['body'] = $this->templatify_text( $email_contents, $template_vars );

        $email_html = $this->templatify( JCFINFUSED_PATH . '/templates/email/welcome.html', $template_vars );

        return $email_html;
        
    }

    function jcfinfused_reminder_contents($template_vars){

        $jcfinfused_settings = get_option( 'jcfinfused_settings' );

        // pr($jcfinfused_settings);

        $reminder_contents = stripslashes( html_entity_decode($jcfinfused_settings['reminder_contents']) );

        $template_vars['email_title'] = stripslashes($jcfinfused_settings['reminder_title']);

        $template_vars['body'] = $this->templatify_text( $reminder_contents, $template_vars );

        $email_html = $this->templatify( JCFINFUSED_PATH . '/templates/email/welcome.html', $template_vars );

        return $email_html;
        
    }




    function jcfinfused_email_preview( $order_id, $contact_id ){

        // Send email Notification to the Contact
        $template_vars = [
            // 'conctact_id'=>$contactId,
            // 'owner_id'=>$owner_id,
            // 'client_name'=>$jcfinfused->getProtectedVar( $contact, 'given_name' ),
            // 'client_name'=>$contact['given_name'],
            // 'coach_name'=>$this->getCoachById($owner_id)['preferred_name'],
            // 'coach_link'=>$coachLink,
            // 'appstore_link'=>$owner_id,
            // 'playstore_link'=>$owner_id
        ];

        echo $this->jcfinfused_email_contents($template_vars);
        // echo $this->jcfinfused_welcm_email_contents($template_vars);
        die();
    }




    public function jcf_preview(){
        $this->jcfinfused_email_preview( 14521, 5698 );
        wp_die();
    }



    public function send_questionnaire_reminder(){
        
        global $jcfinfused;

        $max_reminders = 3;

        $jcfinfused_settings = get_option( 'jcfinfused_settings' );

        $questionnaire_reminder = get_option('questionnaire_reminder');

        
        
        foreach($questionnaire_reminder as $contact_id=>$vars ){

            if($vars['reminder'] < $max_reminders ){

                $email_contents = $this->jcfinfused_reminder_contents($vars);
                
                $emailRequestVars = [
                    "contacts"=>[$vars['contact_id']],
                    "html_content"=>base64_encode($email_contents), 
                    "subject" => stripslashes($jcfinfused_settings['reminder_title']), 
                    "user_id"=> $vars['owner_id']
                ];

                $response = $jcfinfused->get_infusionsoft()->restfulRequest('post', $jcfinfused->get_infusionsoft()->getBaseUrl(). '/rest/v1/emails/queue', $emailRequestVars);

                $questionnaire_reminder[$vars['contact_id']]['reminder'] = $new_reminder = intval($vars['reminder'])+1;

            }
            else{

                unset($questionnaire_reminder[$vars['contact_id']]);

            }

            

        }

        //Update the reminder Questionnaire
        update_option('questionnaire_reminder', $questionnaire_reminder);


        wp_die();
    }

}
