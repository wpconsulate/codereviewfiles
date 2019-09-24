import React, { Component } from 'react';
import {
    Image,
    Text,
    Linking,
    View
    } from "react-native";
import { Button } from "react-native-elements";
import styles from "./Styles";
import {gaTrack} from "../helper";


export default class SignupSuccess extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false,
            phone: '+18887386331'
        };

    }


    componentDidMount() {
        gaTrack( "Successful Signup" );
    }

    callNumber = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }


    render() {
        return (
            <View style={[styles.paddedContainer,{}]}>
                {this.state.fontLoaded ?
                    <View style={[styles.padT80, {alignContent:'center'}]} >
                        <Image
                            source={require('../images/petmeds-logo.png')}
                            style={styles.logoImg1800}
                        />

                        <Text adjustsFontSizeToFit={true} numberOfLines={2}  style={styles.textContent} clear>
                            Thank you for your request! Your request has been sent but has not yet been approved.
                        </Text>
                        <Text adjustsFontSizeToFit={true} numberOfLines={2} style={styles.textContent}>
                            Please check back later or call us at <Text style={styles.linkTxt} onPress={()=>{this.callNumber('tel:'+this.state.phone)}}>1-888-738-6331</Text> to expedite.
                        </Text>

                        <Button
                            containerViewStyle={{ overflow:'hidden',}}
                            buttonStyle={styles.callBtn}
                            backgroundColor="#03A9F4"
                            title="Call Now"
                            onPress={() => { this.callNumber('tel:'+this.state.phone) }}
                        />

                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[styles.textContent, styles.linkTxt]} onPress={()=>{ this.props.navigation.navigate('SignIn', { refreshData: true }) }}>
                            Go to login screen
                        </Text>

                    </View>

                :
                    <Text>Loading...</Text>
                }

            </View>
            );
        }


}
