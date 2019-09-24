import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    Image,
    Text,
    View
    } from "react-native";
import { Button } from "react-native-elements";
import styles from "./Styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import {gaTrack} from "../helper";

export default class forgotError extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            errType:null,
            isLoading: false
        };

    }


    componentDidMount() {
    
        var action = "forgotuser";
        if( this.props.navigation.state.params !== undefined && this.props.navigation.state.params.action !== undefined ){
            action = this.props.navigation.state.params.action;
        }

        this.setState({ errType:action });
        gaTrack( "Forgot "+action+" Error" );
    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={[styles.flexContainer, styles.padT100, styles.padScreen]} >

                        <View style={[styles.listWrapper]}>

                            <View style={styles.alignCenter}>
                                <Icon
                                    name='exclamation'
                                    size={40}
                                    style={[styles.red, styles.padB80]}
                                    />
                            </View>

                            <Text adjustsFontSizeToFit={true} numberOfLines={2}  style={[styles.heading,styles.selfCenter,styles.marT10,styles.marB25,styles.darkBlue,styles.bold]} clear>
                                HMM…
                            </Text>
                            <Text adjustsFontSizeToFit={true} numberOfLines={3} style={[styles.textContent, styles.padScreen]}>
                                {
                                    this.state.errType == "forgotuser"
                                        ?"No user is found with that email address. Please create a new secure login or try again."
                                        :"No user is found with that username. Please create a new secure login or try again."
                                }
                            </Text>

                            <Button
                                    buttonStyle={[styles.fullBtn,styles.marB15]}
                                    backgroundColor={'rgba(0,96,169, 1)'}
                                    title="Create New Login"
                                    onPress={() => {
                                        this.props.navigation.navigate('SignIn', {
                                            page:'SignUp'
                                        });
                                    }}
                                />
                            <Button
                                    buttonStyle={styles.fullBtnInverse}
                                    color={'rgba(0,96,169, 1)'}
                                    title="Try Again"
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                    }}
                                />


                        </View>

                    </View>

                :
                    <Text>Loading...</Text>
                }

            </View>
            );
        }


}
