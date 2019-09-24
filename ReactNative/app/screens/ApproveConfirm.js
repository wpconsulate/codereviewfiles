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

export default class ApproveConfirm extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false
        };

    }


    componentDidMount() {
        gaTrack( "Rx Approved" );
    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={[styles.flexContainer, styles.padT80, styles.padScreen]} >

                        <View style={[styles.listWrapper]}>

                            <View style={[styles.alignCenter,styles.padT80]}>
                                <Icon
                                    name='question-circle'
                                    size={40}
                                    style={[styles.darkBlue, styles.padB30]}
                                    />
                            </View>

                            <Text adjustsFontSizeToFit={true} numberOfLines={2} style={[styles.textContent, styles.padScreen]}>
                                We see you’ve made changes to this prescription but haven’t approved it.
                            </Text>
                            <Text adjustsFontSizeToFit={true} numberOfLines={2} style={[styles.textContent, styles.padScreen]}>
                                Would you like to approve it now or save your changes for later?
                            </Text>




                        </View>

                        <View style={styles.footer2button}>
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
