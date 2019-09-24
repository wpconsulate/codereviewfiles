import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    Image,
    Text,
    View
    } from "react-native";
import { FormLabel, FormInput, Button } from 'react-native-elements'
import styles from "./Styles";

import Icon from 'react-native-vector-icons/FontAwesome';
import { _forgotPass } from "../services/api"
import {gaTrack} from "../helper";

export default class forgotPass extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false,
            username:null,
            isValid:false
        };

    }


    componentDidMount() {
        
        gaTrack( "Forgot Password" );
    }

    _onFieldChange = (userVal) => {
        if ( userVal.length > 2 ){
            this.setState({ username: userVal, isValid:true });
        }else{
            this.setState({ username: userVal, isValid:false });
        }

    }


    _forgotPass = () => {

        const {
            isValid,
            username,
        } = this.state;

        // saving var for this class
        var _this = this;

        //Set Loading True
        this.setState({ isLoading: true });

        _forgotPass(username, function(res){
            // end Loading
            _this.setState({ isLoading: false });

            if(res.status === "true"){
                _this.props.navigation.navigate('SignIn');
            }else{
                _this.props.navigation.navigate('ForgotError', { action:"forgotpass" });
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
                                    FORGOT PASSWORD?
                                </Text>

                                <View style={styles.inputContainer}>
                                    <FormLabel>YOUR USERNAME</FormLabel>
                                    <FormInput
                                        value={this.state.username}
                                        keyboardAppearance='light'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType='default'
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
                                    Your password will be sent to the email address you have provided. If you no longer have access to your email address, please create a&nbsp;
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
                                    disabled={this.state.isLoading || this.state.isValid?false:true}
                                    disabledStyle={styles.disabledBtn}
                                    loading={this.state.isLoading}
                                    onPress={() => {
                                        this._forgotPass();
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
