import React, { Component } from 'react';
import {
    Text,
    View
    } from "react-native";
import { Button } from "react-native-elements";
import styles from "./Styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import {gaTrack} from "../helper";

export default class NewRXDraftConfirm extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false,
            rxID:null,
            petname:"",
            fullname:"",
        };

    }


    componentDidMount() {
    
        // Set Params set by Parent Screen
        const rxID = this.props.navigation.getParam('rxID', null);
        const petname = this.props.navigation.getParam('petname', null);
        const fullname = this.props.navigation.getParam('fullname', null);

        this.setState({ rxID:rxID,petname:petname, fullname:fullname });
        gaTrack( "Draft Created" );

    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={[styles.flexContainer, styles.padT100, styles.padScreen]} >

                        <View style={[styles.listWrapper]}>

                            <View style={styles.alignCenter}>
                                <Icon
                                    name='paper-plane'
                                    size={40}
                                    style={[styles.darkBlue, styles.padB30]}
                                    />
                            </View>


                            <Text adjustsFontSizeToFit={true} numberOfLines={4} style={[styles.textContent, styles.padScreen]}>
                                Draft saved!
                            </Text>
                            <Text adjustsFontSizeToFit={true} numberOfLines={2} style={[styles.textContent, styles.padScreen]}>
                                You can view or edit it anytime by scrolling to the bottom of your Outbox.
                            </Text>

                            <Button
                                    buttonStyle={[styles.fullBtn,styles.marB15]}
                                    backgroundColor={'rgba(0,96,169, 1)'}
                                    title="Go to Outbox"
                                    onPress={() => {
                                        this.props.navigation.navigate('Outbox', { refreshData:true });
                                    }}
                                />
                            <Button
                                    buttonStyle={styles.fullBtnInverse}
                                    color={'rgba(0,96,169, 1)'}
                                    title="Start New Rx"
                                    onPress={() => {
                                        this.props.navigation.navigate('NewRX', { refreshData:true });
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
