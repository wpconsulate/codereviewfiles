<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://dmarkweb.com
 * @since      1.0.0
 *
 * @package    Jcfinfused
 * @subpackage Jcfinfused/admin/pages
 */
use Infusionsoft\Token;

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
class Jcfinfused_Settings {
    
    
	public function __construct() {
        add_action( 'admin_enqueue_scripts', array($this, 'repeater_field_enqueue') );
        // add_filter('query_vars', array($this, 'add_redirect_url'), 0, 1);
        // add_action('init', array($this, 'init_func') );
    }


    function repeater_field_enqueue() {
        wp_enqueue_script( 'jquery' );
        wp_enqueue_script( 'wp-util' );
        // wp_enqueue_script( 'repeater-js', JCFINFUSED_URL . 'assets/js/repeater.js', array( 'jquery', 'wp-util' ), '', true );
    }

    
    function init_func(){
        add_rewrite_rule('^jcfinfused/([^/]*)/?','index.php?jcfinfused=1&state=$matches[1]','top');
    }


    
    function add_redirect_url(){
        $vars[] = 'jcfinfused';
        return $vars;
    }

    
    /**
     * This function renders the contents of the page associated with the Submenu
     * Submenu class.
     */
    private function getUserOpts($active = null){

        global $jcfinfused;

        $res = $jcfinfused->get_infusionsoft()->restfulRequest('get', $jcfinfused->get_infusionsoft()->getBaseUrl(). '/rest/v1/users');
        // pr($res, 1);
        $user_select = '';
        if(!empty($res)){
            // $users = json_decode($res);
            foreach($res['users'] as $user){
                // pr($user, 1);
                $_selected = ($active == $user['id'])?'selected="selected"':'';
                if($user['status'] == 'Active'){
                    $user_select .= '<option '.$_selected.' value="'.$user['id'].'">'.$user['preferred_name'].'</option>';
                }
            }
        }

        return $user_select;
    }

    /**
     * This function renders the contents of the page associated with the Submenu
     * that invokes the render method. In the context of this plugin, this is the
     * Submenu class.
     */
    public function render() {

        global $jcfinfused;

        if(isset($_POST['submit_jcfinfused']) && trim($_POST['submit_jcfinfused']) === 'yes' ){
            $_post_jcfinfused_settings = $_POST['jcfinfused_settings'];
            $_post_jcfinfused_settings['email_contents'] = htmlentities(wpautop($_POST['jcfinfused_email_contents']));
            $_post_jcfinfused_settings['welcm_email_contents'] = htmlentities(wpautop($_POST['jcfinfused_welcm_contents']));
            $_post_jcfinfused_settings['reminder_contents'] = htmlentities(wpautop($_POST['jcfinfused_reminder_contents']));
            update_option('jcfinfused_settings',$_post_jcfinfused_settings);
            // pr($_POST, 1);
        }

        $default_contents = '
                            <p>I\'m {coach_name}, your JCF coach. I\'ll be here to look after you and make sure anything you need help with is taken care of. I can help you with anything to do with your:</p>
                            <p>
                                sleep <br/>
                                digestion<br/>
                                training<br/>
                                nutrition<br/>
                                injuries<br/>
                                brain function/thinking<br/>
                                hormones
                            </p>
                            <p>If you ever have any issues I\'m just one message away :)</p>
                            <p>To get started, please book in for a call with me <a href="{coach_link}">here!</a></p>
                            <p>I\'m really excited to help you. This is going to be epic!!!</p>
                            <p>&nbsp;</p>
                            <p>Speak soon.</p>
                            <p>{coach_name}</p>
                    ';

        // Assuming we are setting a field inside a metabox
        $jcfinfused_settings = get_option( 'jcfinfused_settings' );
        $jcfinfused_settings = wp_parse_args( $jcfinfused_settings, array(
                                                                        'api_client_id'=>'',
                                                                        'api_client_secret'=>'', 
                                                                        'rows'=>[], 
                                                                        'welcm_email_title'=>"Welcome to JCF Coaching!",
                                                                        'reminder_title'=>"",
                                                                        'reminder_contents'=>"",
                                                                        'welcm_email_contents'=>"",
                                                                        'email_title'=>"Thank you for your order",
                                                                        'email_greetings'=>"Hey {client_name}",
                                                                        'email_subtitle'=>"Welcome to JCF!",
                                                                        'email_contents'=>$default_contents 
                                                                        )
                                                                    );

        // pr($jcfinfused->get_infusionsoft()->getToken(), 1);
        // pr('https://api.infusionsoft.com/crm/rest/v1/users?access_token='.$jcfinfused->get_infusionsoft()->getToken()->accessToken);
        
        // $user_select = getUserDD();

        ?>
        <style type="text/css">
            #jcfinfused-field-group-data{
                position:relative;
                padding: 15px;
            }
            #jcfinfused-field-group-data .jcfinfused-field-api,
            #jcfinfused-field-group-data .jcfinfused-field-group{
                position:relative;
                background-color: #EDEDED;
                padding: 10px 20px;
                margin-bottom: 15px;
            }
            .progress-bar{
                width: 90%;
                background-color: #4a686f;
                height: 35px;
                margin: 5px 0;
                border-radius: 2px;
                /* box-shadow: 0 1px 5px #000 inset, 0 1px 0 #444; */
                position: relative;
                display: inline-block;
            }
            .progress-bar span {
                display: inline-block;
                height: 100%;
                border-radius: 3px;
                box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;
                transition: width .4s ease-in-out;
                background-color: #101010;
            }
            
            .progress-text {
                text-align: right;
                color: white;
                position: absolute;
                top: 8px;
                width: 53%;
            }

            #jcfinfused-field-group-data .jcfinfused_settings_user,
            #jcfinfused-field-group-data input[type=text]{
                width: 85%;
                height: 35px;
            }
        </style>

        <form action="" method="post">
        
        
            <div id="jcfinfused-field-group-data">
                <h2>Infusionsoft API Info</h2>
                <div class="jcfinfused-field-api">
                
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="jcfinfused_settings_api_client_id">
                                    <strong><?php _e( 'API Client ID', 'jcfinfused' ); ?></strong>
                                </label>
                            </th>
                            <td>
                                <input type="text" name="jcfinfused_settings[api_client_id]" id="jcfinfused_settings_api_client_id" size="50" value="<?php echo $jcfinfused_settings['api_client_id']?>" />
                            </td>
                        <tr>
                        <tr>
                            <th scope="row">
                                <label for="jcfinfused_settings_api_client_secret">
                                    <strong><?php _e( 'API Client Secret', 'jcfinfused' ); ?></strong>
                                </label>
                            </th>
                            <td>
                                <input type="text" name="jcfinfused_settings[api_client_secret]" id="jcfinfused_settings_api_client_secret" size="20" value="<?php echo $jcfinfused_settings['api_client_secret']?>" />
                            </td>
                        <tr>
                    </table>
                    
                </div>

                <?php
                    // pr($jcfinfused_settings);
                ?>

                <h2>JCFInfused Settings</h2>
                <?php
                if(isset($jcfinfused_settings['rows']) && !empty($jcfinfused_settings['rows'])){
                    foreach( $jcfinfused_settings['rows'] as $key=>$field ) {
                        // pr($field);
                            ?>
                            <div class="jcfinfused-field-group">
                                <table class="form-table">
                                    <tr>
                                        <th scope="row">
                                            <label for="jcfinfused_settings_<?php echo $key?>_user">
                                                <strong><?php _e( 'User', 'jcfinfused' ); ?></strong>
                                            </label>
                                        </th>
                                        <td>
                                            <select id="jcfinfused_settings_<?php echo $key?>_user" name="jcfinfused_settings[rows][<?php echo $key?>][user]"  class="jcfinfused_settings_user">
                                                <?php echo $this->getUserOpts($field['user'])?>
                                            </select>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">
                                            <label for="jcfinfused_settings_<?php echo $key?>_points">
                                                <strong><?php _e( 'Points', 'jcfinfused' ); ?></strong>
                                            </label>
                                        </th>
                                        <td>
                                            <input type="text" id="jcfinfused_settings_<?php echo $key?>_points" name="jcfinfused_settings[rows][<?php echo $key?>][points]" value="<?php echo $field['points']?>" />
                                        </td>
                                    </tr>


                                    <tr>
                                        <th scope="row">
                                            <label for="jcfinfused_settings_<?php echo $key?>_link">
                                                <strong><?php _e( 'Link', 'jcfinfused' ); ?></strong>
                                            </label>
                                        </th>
                                        <td>
                                            <input type="text" id="jcfinfused_settings_<?php echo $key?>_link" name="jcfinfused_settings[rows][<?php echo $key?>][link]" value="<?php echo $field['link']?>" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">
                                            <label for="jcfinfused_settings_<?php echo $key?>_priority">
                                                <strong><?php _e( 'Priority', 'jcfinfused' ); ?></strong>
                                            </label>
                                        </th>
                                        <td>
                                            <input type="text" id="jcfinfused_settings_<?php echo $key?>_priority" name="jcfinfused_settings[rows][<?php echo $key?>][priority]" value="<?php echo $field['priority']?>" />
                                            <?php
                                                $percentage = 0;
                                                if(isset($field['percent']))
                                                    $percentage = $field['percent'];

                                                $percentage = number_format($percentage, 2);
                                            ?>
                                            <input type="hidden" name="jcfinfused_settings[rows][<?php echo $key?>][percent]" value="<?php echo $percentage; ?>" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colspan="2">
                                            <div class="progress-bar blue">
                                                <span style="width: <?php echo $percentage;?>%"></span>
                                                <div class="progress-text"><?php echo $percentage;?>%</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <a href="javascript:void()" class="field-data-remove">Remove</a>
                                        </td>
                                    </tr>
                                </table>
                                
                            </div>
                    <?php 
                    } 
                }
                ?>
            </div>

            <button type="button" id="field_data_add" class="button button-secondary">Add User</button>

            <br />
            <br />
            <br />
            <br />

            <h2>Welcome Email</h2>
            <p>Client's Welcome Email contents below:</p>
            <p> You can use the following Template variables which will be dynamically be replaced in any of these</p>
            <ul>
                <li>{client_name} -> Client's First Name in Infusionsoft</li>
                <li>{coach_name} -> Coach's Name in Infusionsoft</li>
                <li>{coach_link} -> Coach's Link Added above</li>
                <li>{contact_id} -> client_id in Infusionsoft</li>
                <li>{appstore_link} -> Apple's App store link</li>
                <li>{playstore_link} -> Android Playstore link</li>
                <li>{questionnaire_link} -> Questionnaire Link</li>
            </ul>
            <div class="mail_contents" style="width:700px; max-width:100%;">

                <div class="row">
                    <h4><label>Welcome Email Title</label></h4>
                    <input type="text" name="jcfinfused_settings[welcm_email_title]" value="<?php echo $jcfinfused_settings['welcm_email_title']?>" class="widefat" />
                    <br />
                    <br />
                </div>
                <div class="row">
                    <h4><label>Welcome Email Contents</label></h4>
                    <?php
                        $settings = array(
                            'teeny' => true,
                            'textarea_rows' => 15,
                            'tabindex' => 1
                        );
                        $welcm_email_contents = stripslashes( html_entity_decode($jcfinfused_settings['welcm_email_contents']) );
                        wp_editor( $welcm_email_contents, 'jcfinfused_welcm_contents', $settings);
                    ?>
                </div>

            </div>


            <br />
            <br />
            <br />
            <br />

            <h2>Client Email Settings</h2>
            <p>You can configure Email Contents to Client from Coach below:</p>
            <p> You can use the following Template variables which will be dynamically be replaced in any of these</p>
            <ul>
                <li>{client_name} -> Client's First Name in Infusionsoft</li>
                <li>{coach_name} -> Coach's Name in Infusionsoft</li>
                <li>{coach_link} -> Coach's Link Added above</li>
                <li>{contact_id} -> client_id in Infusionsoft</li>
                <li>{appstore_link} -> Apple's App store link</li>
                <li>{playstore_link} -> Android Playstore link</li>
                <li>{questionnaire_link} -> Questionnaire Link</li>
            </ul>
            
            <div class="mail_contents" style="width:700px; max-width:100%;">
                
                <div class="row">
                    <h4><label>Email Title</label></h4>
                    <input type="text" name="jcfinfused_settings[email_title]" value="<?php echo $jcfinfused_settings['email_title']?>" class="widefat" />
                    <br />
                    <br />
                </div>

                <div class="row">
                    <h4><label>Email Greetings</label></h4>
                    <input type="text" name="jcfinfused_settings[email_greetings]" value="<?php echo $jcfinfused_settings['email_greetings']?>" class="widefat" />
                    <br />
                    <br />
                </div>

                <div class="row">
                    <h4><label>Email Subtitle</label></h4>
                    <input type="text" name="jcfinfused_settings[email_subtitle]" value="<?php echo $jcfinfused_settings['email_subtitle']?>" class="widefat" />
                    <br />
                    <br />
                </div>

                <div class="row">
                    <h4><label>Email Contents</label></h4>
                    <?php
                        $settings = array(
                            'teeny' => true,
                            'textarea_rows' => 15,
                            'tabindex' => 1
                        );
                        $email_contents = stripslashes( html_entity_decode($jcfinfused_settings['email_contents']) );
                        wp_editor( $email_contents , 'jcfinfused_email_contents', $settings);
                    ?>
                </div>
            </div>

            

            <?php

                    // echo $email_contents;
            ?>

            <br />
            <br />
            <br />
            <a href="<?php echo home_url("/wp-admin/admin-ajax.php?action=jcf_preview");?>" target="preview">View Email Preview</a>
            <br />
            <br />
            <br />

            <h2>Reminder Email Contents</h2>
            <p>Client's Welcome Email contents below:</p>
            <div class="mail_contents" style="width:700px; max-width:100%;">

                <div class="row">
                    <h4><label>Reminder Email Subject</label></h4>
                    <input type="text" name="jcfinfused_settings[reminder_title]" value="<?php echo stripslashes($jcfinfused_settings['reminder_title'])?>" class="widefat" />
                    <br />
                    <br />
                </div>
                <div class="row">
                    <h4><label>Reminder Email Contents</label></h4>
                    <?php
                        $settings = array(
                            'teeny' => true,
                            'textarea_rows' => 15,
                            'tabindex' => 1
                        );
                        $reminder_contents = stripslashes( html_entity_decode($jcfinfused_settings['reminder_contents']) );
                        wp_editor( $reminder_contents, 'jcfinfused_reminder_contents', $settings);
                    ?>
                </div>

            </div>

            <br />
            <br />


            <input type="hidden" name="submit_jcfinfused" value="yes" />
            <button type="submit" id="jcfinfused_submit" class="button button-primary">Submit</button>

            <script type="text/html" id="tmpl-repeater">
                <div class="jcfinfused-field-group">
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="jcfinfused_settings_{{ data.count }}_user">
                                    <strong><?php _e( 'User', 'jcfinfused' ); ?></strong>
                                </label>
                            </th>
                            <td>
                                <select id="jcfinfused_settings_{{ data.count }}_user" name="jcfinfused_settings[rows][{{ data.count }}][user]" class="jcfinfused_settings_user" >
                                    <?php echo $this->getUserOpts()?>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="jcfinfused_settings_{{ data.count }}_points">
                                    <strong><?php _e( 'Points', 'jcfinfused' ); ?></strong>
                                </label>
                            </th>
                            <td>
                                <input type="text" id="jcfinfused_settings_{{ data.count }}_points" name="jcfinfused_settings[rows][{{ data.count }}][points]" value="" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="jcfinfused_settings_{{ data.count }}_link">
                                    <strong><?php _e( 'Link', 'jcfinfused' ); ?></strong>
                                </label>
                            </th>
                            <td>
                                <input type="text" id="jcfinfused_settings_{{ data.count }}_link" name="jcfinfused_settings[rows][{{ data.count }}][link]" value="" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="jcfinfused_settings_{{ data.count }}_priority">
                                    <strong><?php _e( 'Priority', 'jcfinfused' ); ?></strong>
                                </label>
                            </th>
                            <td>
                                <input type="text" id="jcfinfused_settings_{{ data.count }}_priority" name="jcfinfused_settings[rows][{{ data.count }}][priority]" value="" />
                                <input type="hidden" name="jcfinfused_settings[rows][{{ data.count }}][percent]" value="0" />
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2">
                                <div class="progress-bar blue">
                                    <span style="width: 0%"></span>
                                    <div class="progress-text">0%</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <a href="javascript:void()" class="field-data-remove">remove</a>
                            </td>
                        </tr>
                    </table>

                </div>
            </script>
            
            <script>
                jQuery(function(){
                    // Getting the template by ID - #tmpl-template
                    // var template = wp.template('template');

                    // Getting the HTML and passing data to be included
                    // var data = { text: 'Some Text' };
                    // var html = template( data );

                    // ul could be a variable holding the UL such as $("ul");
                    // adding the HTML under that element
                    // ul.append( html );

                    jQuery("#field_data_add").on( 'click', function(e){
                        e.preventDefault();
                        var template = wp.template('repeater');
                        var html     = template({count:jQuery("#jcfinfused-field-group-data .jcfinfused-field-group").length});
                        jQuery("#jcfinfused-field-group-data").append( html );
                    });

                    jQuery( "#jcfinfused-field-group-data" ).on( 'click', '.field-data-remove', function(e){
                        e.preventDefault();
                        jQuery(this).closest('.jcfinfused-field-group').remove();
                    });

                });
            </script>



        </form>
        <?php

    }

}
