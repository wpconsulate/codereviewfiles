import React, { Component } from 'react';
import { 
    View 
    } from "react-native";

import { Button } from 'react-native-elements'
import styles from "./Styles";


export default class ListFooter extends Component {

    render() {
        return (
            <View style={styles.footer}>
                <Button
                    title="Start New Prescription"
                    loading={false}
                    icon={{name: 'plus', size: 20, type: 'font-awesome'}}
                    iconContainerStyle={{marginRight: 10}}
                    loadingProps={{size: 'large', color: 'rgba(111, 202, 186, 1)'}}
                    titleStyle={{fontWeight: '700'}}
                    buttonStyle={styles.fullBtn}
                    containerStyle={{marginTop: 20, width: 300, height: 50}}
                    onPress={() => {
                        this.props.navigation.push('NewRX', { refreshData:true });
                    }}
                    />
            </View>
        );
    }
  
}
