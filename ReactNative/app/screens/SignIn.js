import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Keyboard,
    ScrollView,
    UIManager,
    KeyboardAvoidingView,
    Dimensions,
    DeviceEventEmitter,
    LayoutAnimation,
    ReactNative,
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { _userSignup, _userSignIn} from "../services/api"
import { retrieveItem, storeItem } from '../services/data/DataStore'
import Icon from 'react-native-vector-icons/FontAwesome';
import {gaTrack} from "../helper";
import {Session} from '../services/data/Session';
import Config from '../services/config';
import { onSignIn } from "../auth";
import styles from "./Styles";

var Fabric = require('react-native-fabric');
var { Crashlytics } = Fabric;



// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
    && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class SignIn extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fullname: '',
            email: '',
            username: '',
            password: '',
            passwordConfirmation: '',
            phone: '',
            lic_number: '',
            overlay: true,
            isSecureEntry:true,
            isNameValid: true,
            isEmailValid: true,
            isUsernameValid: true,
            isPasswordValid: true,
            isPhoneValid: true,
            isLicenceValid: true,
            fontLoaded: true,
            selectedCategory: 0,
            isLoading: false,
            navigation:null,
            updatedCatOnLoad:false,
            isError:false,
            errMsg:"OK",
            visibleHeight:null,
            isSignupSuccess:false,
            focusedInput:null,
            scrollCordsX:0,
            scrollCordsY:0,

        };

        this.selectCategory = this.selectCategory.bind(this);
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);

        // UrbanAirship.setUserNotificationsEnabled(true);

    }

    componentDidMount() {
        
        gaTrack( this.state.selectedCategory === 0?"Login":"SignUp");

        // Crashlytics test
        // setTimeout(() => {
        //     Alert.alert('CRASH!');
        //     Crashlytics.crash();
        // }, 5000); // Crash after 5 seconds.

    }


    /*****************************************************************/
    //  Keyboard related functions
    /*****************************************************************/
    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    keyboardDidShow (e) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        let newSize = Dimensions.get('window').height - (e.endCoordinates.height + 0);
        this.setState({
            visibleHeight: newSize
        })
        // console.log("height:"+newSize)
    }

    keyboardDidHide (e) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
            // visibleHeight: Dimensions.get('window').height
            visibleHeight: null
        })
    }

    _scrollToInput (reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.scrollToFocusedInput(reactNode)
    }
    /*****************************************************************/
    // End of Keyboard related functions
    /*****************************************************************/

    dismissAlertInfo(){
        this.setState({
            overlay: false
        });
    }
    selectCategory(selectedCategory) {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            selectedCategory,
            isLoading: false,
        });
        gaTrack( selectedCategory === 0?"Login":"SignUp");
    }

    toggleSecureEntry=()=>{
        this.setState({isSecureEntry: !this.state.isSecureEntry });
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    }

    _chkEmptyVal = (val) => {
        if( val === null || val === "" )
            return true;
        return false;
    }

    _validateSignUpForm = () => {

        var {
            fullname,
            username,
            email,
            password,
            phone,
            lic_number,
            passwordConfirmation,

            isNameValid,
            isEmailValid,
            isUsernameValid,
            isPasswordValid,
            isPhoneValid,
            isLicenceValid,
            errMsg
        } = this.state;
        errMsg = "OK"

        const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        if( this._chkEmptyVal(username) ){
            isUsernameValid = false;
            this.usernameInput.shake();
            if(errMsg == "OK")
                errMsg = "Username is required!";
        }
        //Check if username consists Special Characters?
        else if( format.test(username) === true ){
            console.log("Special characters found")
            isUsernameValid = false;
            this.usernameInput.shake();
            if(errMsg == "OK")
                errMsg = "User name cannot have special characters or spaces!";
        }
        else
            isUsernameValid = true;

        if( this._chkEmptyVal(password) ){
            isPasswordValid = false;
            this.passwordInput.shake();
            if(errMsg == "OK")
                errMsg = "Password is required!";

        }else if(password != passwordConfirmation){
            isPasswordValid = false;
            this.passwordInput.shake();
            this.confirmationInput.shake();
            if(errMsg == "OK")
                errMsg = "Password & Confirm Password doesn't match!";
        }
        else
            isPasswordValid = true;

        //Full Name
        if( this._chkEmptyVal(fullname) ){
            isNameValid = false;
            this.fullnameInput.shake();
            if(errMsg == "OK")
                errMsg = "Fullname is required!";
        }
        else
            isNameValid = true;

        if( !this.validateEmail(email) ){
            isEmailValid = false;
            this.emailInput.shake();
            if(errMsg == "OK")
                errMsg = "Email should be valid!";
        }
        else
            isEmailValid = true;

        if( this._chkEmptyVal(phone) ){
            isPhoneValid = false;
            this.phoneInput.shake();
            if(errMsg == "OK")
                errMsg = "Phone is required!";
        }
        else
            isPhoneValid = true;

        if( this._chkEmptyVal(lic_number) ){
            isLicenceValid = false;
            this.licNumberInput.shake();
            if(errMsg == "OK")
                errMsg = "Licence Number is required!";
        }
        else
            isLicenceValid = true;

        if(
            !isNameValid || !isEmailValid || !isUsernameValid || !isPasswordValid || !isPhoneValid || !isLicenceValid
        ){
            this.setState({
                isNameValid:isNameValid,
                isEmailValid:isEmailValid,
                isUsernameValid:isUsernameValid,
                isPasswordValid:isPasswordValid,
                isPhoneValid:isPhoneValid,
                isError:true,
                errMsg:errMsg,
                isLicenceValid:isLicenceValid,
            });
            return false;
        }
        else{
            this.setState({
                isNameValid:true,
                isEmailValid:true,
                isUsernameValid:true,
                isPasswordValid:true,
                isPhoneValid:true,
                isLicenceValid:true,
                isError:false,
            });
        }
        return true;
    }

    signUp() {
        const {
            fullname,
            email,
            username,
            password,
            phone,
            lic_number,
        } = this.state;
        this.setState({ isLoading: true });

        //Validate Fields
        if(this._validateSignUpForm()){

            // saving var for this class
            var _this = this;

            const signup_data = {
                fullname:fullname,
                email:email,
                username:username,
                password:password,
                phone:phone,
                lic_number:lic_number
            };

            // Login Call to API
            _userSignup(signup_data, function(res){

                LayoutAnimation.easeInEaseOut();

                if(res !== undefined){

                    // Update the State and Password set to valid
                    _this.setState({
                        isLoading: false,
                        isUsernameValid: true
                    });

                    if(res.status === "true"){
                        _this.selectCategory(0)
                        _this.setState({
                            isSignupSuccess: true,
                            errMsg: "Registered Successfully!"
                        });
                        //
                        _this.props.navigation.navigate("SignupSuccess");
                    }else{
                        _this.setState({
                            isSignupSuccess: false,
                            isError: true,
                            errMsg: res.error
                        });
                    }
                }
                else{
                    _this.setState({
                        isError: true,
                        isLoading: false,
                        errMsg: "Something went wrong!, Please try again later!"
                    });
                }

            });
        }else{
            this.setState({ isLoading: false });
        }

    }

    login() {

        const {
            username,
            password,
        } = this.state;

        this.setState({ isLoading: true });
        // saving var for this class
        var _this = this;

        // Login Call to API
        _userSignIn(username, password, function(res){

            LayoutAnimation.easeInEaseOut();

            // Update the State and Password set to valid
            _this.setState({
                isLoading: false,
                isUsernameValid: true
            });

            if(res !== undefined && res.vetPhone !== undefined){

                if(res.vetPhone != "Vet Name Does not exist" && res.vetPhone != "Invalid Password or Login"){
                    // console.log(res);
                    if(res.vetApproved === "Y"){

                        //Store User Data on Successful Signup
                        var userObj = {
                            username: _this.state.username,
                            password: _this.state.password,
                            vetId: res.vetId,
                            vetName:res.vetName,
                            vetEmail:res.vetEmail,
                            vetPhone:res.vetPhone,
                            vetLicence:res.vetLicence,
                        };
                        //Store Login Data to Local DB
                        storeItem(Config.USER_DATA_KEY, userObj);

                        //Store Login Data to Session
                        Session.user = userObj;

                        onSignIn().then(() => { _this.props.navigation.navigate("Home") } );

                      }else{

                        _this.props.navigation.navigate('NotApprovedYet');

                      }

                }else{
                    _this.setState({
                        isError: true,
                        errMsg: res.vetPhone
                    });
                    _this.usernameInput.shake();
                    _this.passwordInput.shake();
                }
            }
            else{
                _this.setState({
                    isError: true,
                    errMsg: "Something went wrong!, Please try again later!"
                });
            }

        });

    }

    render() {

        if( this.props.navigation.state.params !== undefined && this.props.navigation.state.params.page === "SignUp" ){
            this.props.navigation.state.params.page = undefined;
            this.selectCategory(1)
        }

        const {
            selectedCategory,
            isLoading,
            fullname,
            username,
            email,
            password,
            phone,
            lic_number,
            passwordConfirmation,

            isNameValid,
            isEmailValid,
            isUsernameValid,
            isPasswordValid,
            isPhoneValid,
            isLicenceValid,
            isSignupSuccess,
            isError,
            errMsg
        } = this.state;

        const isLoginPage = selectedCategory === 0;
        const isSignUpPage = selectedCategory === 1;

        return (
            <View style={[styles.container,{ maxHeight :this.state.visibleHeight}]}>
                {this.state.fontLoaded ?
                    <View>
                        <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}} contentContainerStyle={{ paddingVertical: 20,alignItems: 'center' }} enableOnAndroid={true} >

                                <View style={[styles.titleContainer,{height:isSignUpPage?80:150}]}>
                                    <Image source={require('../images/petmeds-logo.png')} style={{alignSelf:'center',width: 154,height: 30,}} />
                                </View>
                                <View style={{ flexDirection: 'row', display:'flex',flex:1 }}>
                                    <Button
                                        // disabled={isLoading}
                                        onPress={() => this.selectCategory(0)}
                                        containerStyle={{ flex: 1 }}
                                        buttonStyle={[styles.tabTitle, isLoginPage && styles.selectedTabTitle]}
                                        color={isLoginPage?'#0060a9':'#000000'}
                                        fontSize={14}
                                        title={'LOGIN'}
                                    />
                                    <Button
                                        // disabled={isLoading}
                                        clear
                                        onPress={() => this.selectCategory(1)}
                                        containerStyle={{ flex: 1 }}
                                        // titleStyle={[styles.tabTitle, isSignUpPage && styles.selectedTabTitle]}
                                        buttonStyle={[styles.tabTitle, isSignUpPage && styles.selectedTabTitle]}
                                        color={isSignUpPage?'#0060a9':'#000000'}
                                        fontSize={14}
                                        title={'SIGN UP'}
                                    />
                                </View>

                                <View style={[styles.formContainer]}>

                                    { isSignUpPage && this.state.overlay?
                                        <View style={[]}>
                                            
                                            <View style={[styles.inputContainer,styles.padScreen,{lineHeight:3}]}>
                                                <Text style={[styles.pageTitle,styles.txtJustify]}>
                                                    Use of the PetMeds4Vets app is restricted to currently licensed veterinarians in the United States.  By continuing, you certify under penalty of perjury that you are eligible to do so based on bona fide and current licensure as a veterinarian in a state within the United States.
                                                </Text>
                                            </View>

                                            <Button
                                                buttonStyle={[styles.fullBtn, styles.loginButton]}
                                                containerStyle={{ marginTop: 32, flex: 0 }}
                                                activeOpacity={0.3}
                                                title="I Understand!"
                                                onPress={() => {    this.dismissAlertInfo();    }}
                                                titleStyle={styles.loginTextButton}
                                            />

                                        </View>
                                        :
                                        <View />
                                    }


                                    {isLoginPage &&
                                        <View>
                                            <View style={styles.inputContainer}>
                                                <FormLabel>USERNAME</FormLabel>
                                                <FormInput
                                                    value={username}
                                                    keyboardAppearance='light'
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    keyboardType='default'
                                                    returnKeyType={'next'}
                                                    blurOnSubmit={true}
                                                    containerStyle={[{}, !isUsernameValid && styles.error]}
                                                    inputStyle={[{marginLeft: 0}]}
                                                    placeholder={''}
                                                    ref={input => this.usernameInput = input}
                                                    onSubmitEditing={() => this.passwordInput.focus()}
                                                    onChangeText={username => this.setState({ username })}
                                                    onFocus={() => { this.setState({ focusedInput: this.usernameInput }); }}
                                                    errorMessage={isUsernameValid ? null : 'Please Enter Valid Username and at least 4 characters!'}
                                                />

                                                {!isSignUpPage &&
                                                    <Text
                                                        style={[styles.smallTxt, styles.blue, styles.tinyLinks]}
                                                        onPress={() => {
                                                            this.props.navigation.navigate('ForgotUser');
                                                        }}
                                                    >
                                                        Forgot your username?
                                                    </Text>
                                                }
                                            </View>

                                            <View style={styles.inputContainer}>
                                                <FormLabel>Password</FormLabel>
                                                <View>
                                                    <FormInput
                                                        value={password}
                                                        keyboardAppearance='light'
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        secureTextEntry={this.state.isSecureEntry}
                                                        returnKeyType={isSignUpPage ? 'next' : 'done'}
                                                        blurOnSubmit={true}
                                                        containerStyle={[{}, !isPasswordValid && styles.error]}
                                                        inputStyle={[{ marginLeft: 0 }]}
                                                        placeholder={''}
                                                        ref={input => this.passwordInput = input}
                                                        onSubmitEditing={() => isSignUpPage ? this.confirmationInput.focus() : this.login()}
                                                        onChangeText={(password) => this.setState({ password })}
                                                        errorMessage={isPasswordValid ? null : 'Please enter at least 8 characters'}
                                                    />
                                                    <Icon
                                                        name={ this.state.isSecureEntry?'eye-slash':'eye'}
                                                        color='rgba(0,96,169, 1)'
                                                        size={18}
                                                        style={{position:'absolute',right:20,top:10}}
                                                        onPress={() => this.toggleSecureEntry()}
                                                        />
                                                </View>
                                                {!isSignUpPage &&
                                                    <Text
                                                        style={[styles.smallTxt, styles.blue, styles.tinyLinks]}
                                                        onPress={() => {
                                                            this.props.navigation.navigate('ForgotPass');
                                                        }}
                                                    >
                                                        Forgot your password?
                                                    </Text>
                                                }
                                            </View>

                                            <Button
                                                buttonStyle={[styles.fullBtn, styles.loginButton]}
                                                containerStyle={{ marginTop: 32, flex: 0 }}
                                                activeOpacity={0.3}
                                                title={isLoginPage ? 'LOGIN' : 'SIGN UP'}
                                                onPress={isLoginPage ? this.login : this.signUp}
                                                titleStyle={styles.loginTextButton}
                                                loading={isLoading}
                                                disabled={isLoading}
                                                disabledStyle={styles.disabledBtn}
                                            />

                                        </View>
                                    }

                                    
                                    {isSignUpPage && !this.state.overlay &&
                                            <View>
                                                <View style={styles.inputContainer}>
                                                    <FormLabel>USERNAME</FormLabel>
                                                    <FormInput
                                                        value={username}
                                                        keyboardAppearance='light'
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        keyboardType='default'
                                                        returnKeyType={'next'}
                                                        blurOnSubmit={true}
                                                        containerStyle={[{}, !isUsernameValid && styles.error]}
                                                        inputStyle={[{marginLeft: 0}]}
                                                        placeholder={''}
                                                        ref={input => this.usernameInput = input}
                                                        onSubmitEditing={() => this.passwordInput.focus()}
                                                        onChangeText={username => this.setState({ username })}
                                                        onFocus={() => { this.setState({ focusedInput: this.usernameInput }); }}
                                                        errorMessage={isUsernameValid ? null : 'Please Enter Valid Username and at least 4 characters!'}
                                                    />

                                                    {!isSignUpPage &&
                                                        <Text
                                                            style={[styles.smallTxt, styles.blue, styles.tinyLinks]}
                                                            onPress={() => {
                                                                this.props.navigation.navigate('ForgotUser');
                                                            }}
                                                        >
                                                            Forgot your username?
                                                        </Text>
                                                    }
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <FormLabel>Password</FormLabel>
                                                    <View>
                                                        <FormInput
                                                            value={password}
                                                            keyboardAppearance='light'
                                                            autoCapitalize='none'
                                                            autoCorrect={false}
                                                            secureTextEntry={this.state.isSecureEntry}
                                                            returnKeyType={isSignUpPage ? 'next' : 'done'}
                                                            blurOnSubmit={true}
                                                            containerStyle={[{}, !isPasswordValid && styles.error]}
                                                            inputStyle={[{ marginLeft: 0 }]}
                                                            placeholder={''}
                                                            ref={input => this.passwordInput = input}
                                                            onSubmitEditing={() => isSignUpPage ? this.confirmationInput.focus() : this.login()}
                                                            onChangeText={(password) => this.setState({ password })}
                                                            errorMessage={isPasswordValid ? null : 'Please enter at least 8 characters'}
                                                        />
                                                        <Icon
                                                            name={ this.state.isSecureEntry?'eye-slash':'eye'}
                                                            color='rgba(0,96,169, 1)'
                                                            size={18}
                                                            style={{position:'absolute',right:20,top:10}}
                                                            onPress={() => this.toggleSecureEntry()}
                                                            />
                                                    </View>
                                                    {!isSignUpPage &&
                                                        <Text
                                                            style={[styles.smallTxt, styles.blue, styles.tinyLinks]}
                                                            onPress={() => {
                                                                this.props.navigation.navigate('ForgotPass');
                                                            }}
                                                        >
                                                            Forgot your password?
                                                        </Text>
                                                    }
                                                </View>
                                                
                                                <View style={styles.inputContainer}>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <View>
                                                        <FormInput
                                                            value={passwordConfirmation}
                                                            secureTextEntry={this.state.isSecureEntry}
                                                            keyboardAppearance='light'
                                                            autoCapitalize='none'
                                                            autoCorrect={false}
                                                            keyboardType='default'
                                                            returnKeyType={'next'}
                                                            blurOnSubmit={true}
                                                            containerStyle={[{}, !isPasswordValid&& styles.error]}
                                                            inputStyle={[{ marginLeft: 0 }]}
                                                            placeholder={''}
                                                            ref={(input) => this.confirmationInput = input}
                                                            onSubmitEditing={() => this.fullnameInput.focus()}
                                                            onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
                                                        />
                                                        <Icon
                                                            name={ this.state.isSecureEntry?'eye-slash':'eye'}
                                                            color='rgba(0,96,169, 1)'
                                                            size={18}
                                                            style={{position:'absolute',right:20,top:10}}
                                                            onPress={() => this.toggleSecureEntry()}
                                                            />
                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <FormLabel>FIRST & LAST NAME</FormLabel>
                                                    <FormInput
                                                        value={fullname}
                                                        keyboardAppearance='light'
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        keyboardType='default'
                                                        returnKeyType={'next'}
                                                        blurOnSubmit={true}
                                                        containerStyle={[{}, !isNameValid && styles.error]}
                                                        inputStyle={[{ marginLeft: 0 }]}
                                                        placeholder={''}
                                                        ref={input => this.fullnameInput = input}
                                                        onSubmitEditing={() => this.emailInput.focus()}
                                                        onChangeText={fullname => this.setState({ fullname })}
                                                        errorMessage={isNameValid ? null : 'Please enter the same password'}
                                                        onFocus={(event) => {
                                                            // `bind` the function if you're using ES6 classes
                                                            // this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                                        }}
                                                    />
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormInput
                                                        value={email}
                                                        keyboardAppearance='light'
                                                        autoFocus={false}
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        keyboardType='email-address'
                                                        returnKeyType='next'
                                                        inputStyle={[{ marginLeft: 0 }]}
                                                        placeholder={''}
                                                        containerStyle={[{}, !isEmailValid && styles.error]}
                                                        ref={input => this.emailInput = input}
                                                        onSubmitEditing={() => this.phoneInput.focus()}
                                                        onChangeText={email => this.setState({ email })}
                                                        errorMessage={isEmailValid ? null : 'Please enter a valid email address'}
                                                    />
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <FormLabel>PHONE NUMBER</FormLabel>
                                                    <FormInput
                                                        value={phone}
                                                        keyboardAppearance='light'
                                                        autoFocus={false}
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        keyboardType='phone-pad'
                                                        returnKeyType='next'
                                                        inputStyle={[{ marginLeft: 0 }]}
                                                        placeholder={''}
                                                        containerStyle={[{}, !isPhoneValid && styles.error]}
                                                        ref={input => this.phoneInput = input}
                                                        onSubmitEditing={() => this.licNumberInput.focus()}
                                                        onChangeText={phone => this.setState({ phone })}
                                                        // errorMessage={isEmailValid ? null : 'Please enter a valid email address'}
                                                    />
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <FormLabel>STATE LICENSE NUMBER</FormLabel>
                                                    <FormInput
                                                        value={lic_number}
                                                        keyboardAppearance='light'
                                                        autoFocus={false}
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        keyboardType='default'
                                                        // keyboardType='numeric'
                                                        returnKeyType='done'
                                                        inputStyle={[{ marginLeft: 0 }]}
                                                        placeholder={''}
                                                        containerStyle={[{}, !isLicenceValid && styles.error]}
                                                        ref={input => this.licNumberInput = input}
                                                        // onSubmitEditing={() => this.passwordInput.focus()}
                                                        onChangeText={lic_number => this.setState({ lic_number })}
                                                        // errorMessage={isLicNumberValid ? null : 'Please enter a valid Licence Number'}
                                                    />
                                                </View>

                                                <Button
                                                    buttonStyle={[styles.fullBtn, styles.loginButton]}
                                                    containerStyle={{ marginTop: 32, flex: 0 }}
                                                    activeOpacity={0.3}
                                                    title={isLoginPage ? 'LOGIN' : 'SIGN UP'}
                                                    onPress={isLoginPage ? this.login : this.signUp}
                                                    titleStyle={styles.loginTextButton}
                                                    loading={isLoading}
                                                    disabled={isLoading}
                                                    disabledStyle={styles.disabledBtn}
                                                />

                                            </View>
                                    } 

                                    {isError &&
                                        <View><Text adjustsFontSizeToFit={true} numberOfLines={1} style={[{fontSize:12},styles.red, styles.marB10, styles.selfCenter]}>
                                            {errMsg}
                                        </Text></View>
                                    }
                                    {isSignupSuccess &&
                                        <View><Text adjustsFontSizeToFit={true} numberOfLines={1} style={[{fontSize:12},styles.blue, styles.marB10, styles.selfCenter]}>
                                            {errMsg}
                                        </Text></View>
                                    }

                                </View>

                            </KeyboardAwareScrollView>
                        </View>
                    :
                    <Text>Loading Login...</Text>
                }

            </View>
        );
    }
}
