import { AsyncStorage } from "react-native";
import { Session } from './services/data/Session';
// import { _getUserData } from './services/data/DataStore';
import { dbTables } from './helper';
import Config from './services/config';

export const onSignIn = () => {
    return AsyncStorage.setItem(Config.USER_KEY, "true");
}

export const onSignOut = () => {
    AsyncStorage.removeItem(Config.USER_KEY);
    return AsyncStorage.removeItem(Config.USER_DATA_KEY);
}

export const isSignedIn = () => {

    // _getUserData(function(userdata){
    //     if(userdata !== null){
    //         Session.user = userdata;
    //         Session.db =  dbTables(userdata.vetId);
    //         console.log(Session)
    //         resolve(true);
    //     }else{
    //         resolve(false);
    //     }
    // })

    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(Config.USER_KEY)
            .then(res => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => reject(err));
    });
};
