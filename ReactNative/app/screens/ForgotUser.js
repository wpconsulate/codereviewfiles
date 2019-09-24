import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    Image,
    Text,
    View
    } from "react-native";
import { FormLabel, FormInput, Button } from 'react-native-elements'
import styles from "./Styles";
import {gaTrack} from "../helper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { _forgotUser } from "../services/api"

export default class forgotUser extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false,
            email:null,
            isValidEmail:false
        };

    }


    componentDidMount() {
        gaTrack( "Forgot User!" );
    }

    _onFieldChange = (emailVal) => {

        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (reg.test(emailVal) === true){
            this.setState({ email: emailVal, isValidEmail:true });
        }else{
            this.setState({ email: emailVal, isValidEmail:false });
        }

    }


    _forgotUser = () => {

        const {
            isValidEmail,
            email,
        } = this.state;

        // saving var for this class
        var _this = this;

        //Set Loading True
        this.setState({ isLoading: true });

        _forgotUser(email, function(res){
            // end Loading
            _this.setState({ isLoading: false });

            if(res.status === "true"){
                _this.props.navigation.navigate('SignIn');
            }else{
                _this.props.navigation.navigate('ForgotError', { action:"forgotuser" });
            }

        });

    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={[styles.flexContainer, styles.padT25, styles.padScreen]} >
                        <View style={[styles.listWrapper]}>

                            <View style={styles.overlayActionBar}>
                                <Text
                                    style={[styles.overlayActionBarLeft, styles.grey]}
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                        }}
                                >
                                    <Icon
                                            name='angle-left'
                                            size={40}
                                            style={[styles.blue]}
                                        />
                                </Text>
                            </View>

                            <KeyboardAvoidingView contentContainerStyle={styles.loginContainer} >

                                <View style={styles.alignCenter}>
                                    <Image
                                        source={require('../images/logo.png')}
                                    />
                                </View>

                                <Text adjustsFontSizeToFit={true} numberOfLines={2}  style={[styles.heading,styles.selfCenter,styles.marT10,styles.marB25,styles.darkBlue,styles.bold]} clear>
                                    FORGOT USERNAME?
                                </Text>

                                <View style={styles.inputContainer}>
                                    <FormLabel>YOUR EMAIL ADDRESS</FormLabel>
                                    <FormInput
                                        value={this.state.email}
                                        keyboardAppearance='light'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType='email-address'
                                        returnKeyType={'next'}
                                        blurOnSubmit={true}
                                        containerStyle={{}}
                                        inputStyle={{ marginLeft: 0 }}
                                        placeholder={''}
                                        ref={input => this.emailInput = input}
                                        // onSubmitEditing={() => this.passwordInput.focus()}
                                        onChangeText={ (text)=> { this._onFieldChange(text) } }
                                        // errorMessage={isUsernameValid ? null : 'Plese Enter Valid Username and at least 4 characters!'}
                                    />
                                </View>

                                <Text adjustsFontSizeToFit={true} numberOfLines={4} style={styles.textContent}>
                                    Your username will be sent to the email address you have provided. If you no longer have access to your email address, please create a&nbsp;
                                    <Text
                                        style={styles.linkTxt}
                                        onPress={() => {
                                            this.props.navigation.navigate('SignIn', {
                                                page:'SignUp'
                                            });
                                        }}
                                    >new login</Text>.
                                </Text>

                                <Button
                                    buttonStyle={styles.sbmtBtn}
                                    backgroundColor={'rgba(0,96,169, 1)'}
                                    title="Submit"
                                    disabled={this.state.isLoading || this.state.isValidEmail?false:true}
                                    disabledStyle={styles.disabledBtn}
                                    loading={this.state.isLoading}
                                    loading={this.state.isLoading}
                                    onPress={() => {
                                        this._forgotUser();
                                    }}
                                />

                            </KeyboardAvoidingView>

                        </View>
                    </View>

                :
                    <Text>Loading...</Text>
                }

            </View>
            );
        }


}
