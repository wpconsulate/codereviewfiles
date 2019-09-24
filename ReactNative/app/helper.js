import moment from 'moment';
import {
    Analytics,
    Hits as GAHits,
    Experiment as GAExperiment
} from 'react-native-google-analytics';
import Config from './services/config';

import Constants from 'expo-constants';

var Fabric = require('react-native-fabric');
var { Crashlytics } = Fabric;


let ga = this.ga = null;

const gaId = 'UA-124354762-1';

// Forces a native crash for testing
// Crashlytics.crash();

export const gaTrack = (ScreenName) => {

    if(Constants.isDevice && typeof Constants.platform.ios === 'object' ){
        // console.log("iOS");
        ga = new Analytics(gaId, Constants.deviceId, 1, "iOS");
        let screenView = new GAHits.ScreenView(
            '1800 PetMeds App',
            ScreenName,
            Constants.platform.ios.model,  // iPhone 7 Plus
            Constants.platform.ios.systemVersion,  // 10.3
        );
        ga.send(screenView);
    }
    else if(Constants.isDevice && typeof Constants.platform.android === 'object' ){
        // console.log("Android");
        ga = new Analytics(gaId, Constants.deviceId, 1, "Android");

        let screenView = new GAHits.ScreenView(
            '1800 PetMeds App',
            ScreenName,
            Constants.platform.android.versionCode,  // iPhone 7 Plus
            Constants.sessionId,  //
        );
        ga.send(screenView);
    }
    else{
        let platform = Constants.platform.ios?"iOS":"Android";
        ga = new Analytics(gaId, "Simulator", 1, platform);
        let screenView = new GAHits.ScreenView(
            '1800 PetMeds App',
            ScreenName,
            "Emulator iOS",
            "iOS 11"
        );
        ga.send(screenView);
    }
}


export const dbTables = (vetId) => {
    return  {
                outbox: vetId + "_outboxRX",
                outboxDraft: vetId + "_outboxDraftRX",
                pending: vetId + "_pendingRX",
                processed: vetId + "_processedRX",
                rxStatus: vetId + "_rxStatus",
                notify: vetId + "_notify",
            };
}

export const fabricUserSet = (user) => {
    Crashlytics.setUserName(user.vetId);
    Crashlytics.setUserEmail(user.vetEmail);
    Crashlytics.setUserIdentifier(user.vetId);
}

export const reportError = (info)=> {
    // Record a non-fatal JS error only on Android
    Crashlytics.logException(info);
    
    // Record a non-fatal JS error only on iOS
    Crashlytics.recordError(info);
}

export const appVersion = () => { return Config.ver; }