import React from "react";
import { Platform, StatusBar } from "react-native";
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";

// import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import SignupSuccess from "./screens/SignupSuccess";
import NotApprovedYet from "./screens/NotApprovedYet";
import ForgotUser from "./screens/ForgotUser";
import ForgotPass from "./screens/ForgotPass";
import ForgotSuccess from "./screens/ForgotSuccess";
import ForgotError from "./screens/ForgotError";

import Home from "./screens/Home";
import Approve from "./screens/Approve";
import ApproveConfirm from "./screens/ApproveConfirm";
import Outbox from "./screens/Outbox";
import OutboxView from "./screens/OutboxView";
import NewRXDraftConfirm from "./screens/NewRXDraftConfirm";
import WidthdrawConfirm from "./screens/WidthdrawConfirm";
import Processed from "./screens/Processed";
import ProcessedView from "./screens/ProcessedView";
import NewRX from "./screens/NewRX";
import NewRXConfirm from "./screens/NewRXConfirm";
import Settings from "./screens/Settings";
import Account from "./screens/Account";
import Notifications from "./screens/Notifications";

//Form Elements
import EditQty from "./screens/form/EditQty";
import EditPhone from "./screens/form/EditPhone";
import EditPetName from "./screens/form/EditPetName";
import EditPatientName from "./screens/form/EditPatientName";
import EditRxItem from "./screens/form/EditRxItem";
import EditRefill from "./screens/form/EditRefill";
import EditInstructions from "./screens/form/EditInstructions";
import Feedback from "./screens/form/Feedback";


const headerStyle = {
    marginTop: Platform.OS === "android" ? 0 : 0,
    // marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor:'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(171,179,189, 0.5)',
};


export const createRootNavigator = (signedIn = false) => {

    var petMedsRouter = createStackNavigator({
        SignIn: {
            screen: SignIn,
            navigationOptions: {
                title: "Sign In",
                header: null,
                headerStyle
            }
        },
        SignupSuccess: {
            screen: SignupSuccess,
            navigationOptions: {
                header: null,
                headerStyle
            }
        },
        NotApprovedYet: {
            screen: NotApprovedYet,
            navigationOptions: {
                header: null,
                headerStyle
            }
        },
        ForgotUser: {
            screen: ForgotUser,
            navigationOptions: {
                header: null,
                headerStyle
            }
        },
        ForgotPass: {
            screen: ForgotPass,
            navigationOptions: {
                header: null,
                headerStyle
            }
        },
        ForgotSuccess: {
            screen: ForgotSuccess,
            navigationOptions: {
                header: null,
                headerStyle
            }
        },
        ForgotError: {
            screen: ForgotError,
            navigationOptions: {
                header: null,
                headerStyle
            }
        },
    
        // Secure Area Navigation
        Home: {
            screen: Home,
            navigationOptions: {
                title: "Home",
                headerStyle
            }
        },
        Approve: {
            screen: Approve,
            navigationOptions: {
                // title: "Approve",
                headerStyle
            }
        },
        ApproveConfirm: {
            screen: ApproveConfirm,
            navigationOptions: {
                header: null,
            }
        },
        Outbox: {
            screen: Outbox,
            navigationOptions: {
                title: "Outbox",
                headerStyle
            }
        },
        OutboxView: {
            screen: OutboxView,
            navigationOptions: {
                headerStyle
            }
        },
        WidthdrawConfirm: {
            screen: WidthdrawConfirm,
            navigationOptions: {
                headerStyle
            }
        },
        Processed: {
            screen: Processed,
            navigationOptions: {
                title: "Processed",
                headerStyle
            }
        },
        ProcessedView: {
            screen: ProcessedView,
            navigationOptions: {
                // title: "Processed",
                headerStyle
            }
        },
        NewRX: {
            screen: NewRX,
            navigationOptions: {
                header: null,
            }
        },
        NewRXConfirm: {
            screen: NewRXConfirm,
            navigationOptions: {
                header: null,
            }
        },
        NewRXDraftConfirm: {
            screen: NewRXDraftConfirm,
            navigationOptions: {
                header: null,
            }
        },
    
        Settings: {
            screen: Settings,
            navigationOptions: {
                title: "Account",
                headerStyle
            }
        },
        Account: {
            screen: Account,
            navigationOptions: {
                title: "Account Details",
                headerStyle
            }
        },
        Notifications: {
            screen: Notifications,
            navigationOptions: {
                title: "Notification Settings",
                headerStyle
            }
        },
    
        // Form Elements
        EditQty: {
            screen: EditQty,
            navigationOptions: {
                header:null
            }
        },
        EditPhone: {
            screen: EditPhone,
            navigationOptions: {
                header:null
            }
        },
        EditPetName: {
            screen: EditPetName,
            navigationOptions: {
                header:null
            }
        },
        EditPatientName: {
            screen: EditPatientName,
            navigationOptions: {
                header:null
            }
        },
        EditRxItem: {
            screen: EditRxItem,
            navigationOptions: {
                header:null
            }
        },
        EditRefill: {
            screen: EditRefill,
            navigationOptions: {
                header:null
            }
        },
        EditInstructions: {
            screen: EditInstructions,
            navigationOptions: {
                header:null
            }
        },
        Feedback: {
            screen: Feedback,
            navigationOptions: {
                header:null
            }
        }
    },
    {
        initialRouteName: signedIn ? "Home" : "SignIn"
    });

    return createAppContainer(petMedsRouter);

    // if(signedIn){
    //     return createAppContainer(petMedsRouter)
    // }

    // return createAppContainer(SignedOut)

};


// export const createRootNavigator_old = (signedIn = false) => {
//     return createSwitchNavigator(
//         {
//             SignedIn: {
//                 screen: secureArea
//             },
//             SignedOut: {
//                 screen: SignedOut
//             }
//         },
//         {
//             initialRouteName: signedIn ? "SignedIn" : "SignedOut"
//         }
//     );
// };
