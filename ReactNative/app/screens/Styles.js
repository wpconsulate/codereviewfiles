import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_PAD = 20;
const CONTENT_WIDTH = ( SCREEN_WIDTH - ( SCREEN_PAD * 2 ) );
const colors = {
    white:'rgba(255, 255, 255, 1)',
    darkBlue:'rgba(0,65,115, 1)',
    blue:'rgba(0,96,169, 1)',
    red:'rgba(227,24,55, 1)',
    grey:'rgba(171,179,189, 1)',
    sky:'rgba(248,250,252, 1)',
};

isIphoneX = () => {
    return (Platform.OS === 'ios' && SCREEN_HEIGHT === 812);
}

// alert(isIphoneX())


const styles = StyleSheet.create({
    //------------------------------------------------------------
    // Padding CSS
    //------------------------------------------------------------
    padT10:{
        paddingTop: 10
    },
    padT15:{
        paddingTop:15
    },
    padT25:{
        paddingTop:25
    },
    padT30:{
        paddingTop:30
    },
    padT40:{
        paddingTop:40
    },
    padT80:{
        paddingTop:80
    },
    padT100:{
        paddingTop:100
    },

    padB10:{
        paddingBottom: 10
    },
    padB15:{
        paddingBottom:15
    },
    padB25:{
        paddingBottom:25
    },
    padB30:{
        paddingBottom:30
    },
    padB80:{
        paddingBottom:80
    },
    padl70:{
        paddingLeft: 70,
    },
    padr70:{
        paddingRight: 70,
    },
    padScreen:{
        paddingLeft: SCREEN_PAD,
        paddingRight: SCREEN_PAD,
    },
    padAround:{
        paddingTop: SCREEN_PAD,
        paddingBottom: SCREEN_PAD,
        paddingLeft: SCREEN_PAD,
        paddingRight: SCREEN_PAD,
    },

    //------------------------------------------------------------
    // Margin CSS
    //------------------------------------------------------------
    marT5:{
        marginTop: 5
    },
    marT10:{
        marginTop: 10
    },
    marT15:{
        marginTop:15
    },
    marT25:{
        marginTop:25
    },
    marB5:{
        marginBottom: 5
    },
    marB10:{
        marginBottom: 10
    },
    marB15:{
        marginBottom:15
    },
    marB20:{
        marginBottom:20
    },
    marB25:{
        marginBottom:25
    },
    marR10:{
        marginRight: 10
    },
    marR20:{
        marginRight: 20
    },
    marL10:{
        marginLeft: 10
    },
    marL20:{
        marginLeft: 20
    },
    marContainerScreen:{
        marginLeft: SCREEN_PAD,
        marginRight: SCREEN_PAD,
    },

    //------------------------------------------------------------
    // TxtColors
    //------------------------------------------------------------
    white:{
        color: colors.white,
    },
    blue:{
        color: colors.blue,
    },
    darkBlue:{
        color: colors.darkBlue,
    },
    red:{
        color: colors.red,
    },
    grey:{
        color: colors.grey
    },
    sky:{
        color: colors.sky
    },

    //------------------------------------------------------------
    // BG Colors
    //------------------------------------------------------------
    whitebg:{
        backgroundColor: colors.white
    },
    bluebg:{
        backgroundColor: colors.blue
    },
    redbg:{
        backgroundColor: colors.red
    },
    skybg:{
        backgroundColor: colors.sky
    },


    //------------------------------------------------------------
    // Buttons
    //------------------------------------------------------------
    fullBtn:{
        // width: CONTENT_WIDTH,
        marginBottom:10,
        backgroundColor: 'rgba(0,96,169, 1)',
        borderColor: 'rgba(0,96,169, 1)', 
        borderWidth: 1,
        borderRadius: 2,
        paddingVertical: 10
    },
    fullBtnInverse:{
        // width: CONTENT_WIDTH,
        marginBottom:10,
        backgroundColor: 'rgba(255,255,255, 1)',
        borderColor: 'rgba(0,96,169, 1)',
        borderWidth: 1,
        borderRadius: 2,
        paddingVertical: 15
    },
    fullBtnStikyBottom:{
        position:'absolute',
        left: 0,
        bottom: 0,
        width: SCREEN_WIDTH,
    },
    fullBtnTxt:{
        fontWeight:'bold'
    },
    halfBtn:{
        backgroundColor: 'rgba(0,96,169, 1)', 
        borderColor: 'rgba(0,96,169, 1)',
        borderWidth: 1,
        borderRadius: 2,
        paddingVertical: 13,
        width: ( (SCREEN_WIDTH / 2) - (SCREEN_PAD+5) ), // Make width half the size of the screen - padding + keep 10px margin between
    },
    halfBtnInverse:{
        backgroundColor: 'rgba(255,255,255, 1)',
        borderColor: 'rgba(0,96,169, 1)',
        borderWidth: 1,
        borderRadius: 2,
        paddingVertical: 13,
        width: ( (SCREEN_WIDTH / 2) - (SCREEN_PAD+5) ), // Make width half the size of the screen - padding + keep 10px margin between
    },
    halfBtnDanger:{
        backgroundColor: 'rgba(255,255,255, 1)',
        borderColor: 'rgba(227,24,55, 1)',
        borderWidth: 1,
        borderRadius: 2,
        paddingVertical: 13,
        width: ( (SCREEN_WIDTH / 2) - (SCREEN_PAD+5) ), // Make width half the size of the screen - padding + keep 10px margin between
    },
    disabledBtn:{
        backgroundColor:'rgba( 0, 96, 169, 0.3 )'
    },

    


    // Oth Global CSS
    borderBottom1:{
        borderBottomWidth: 1,
        borderBottomColor:'#000000',
    },

    // Global Elements CSS
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    paddedContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingTop: SCREEN_PAD,
        paddingBottom: SCREEN_PAD,
        paddingLeft: SCREEN_PAD,
        paddingRight: SCREEN_PAD,
        // width: SCREEN_WIDTH - ( SCREEN_PAD * 2 )
    },
    contentWidth:{
        width: CONTENT_WIDTH
    },
    flexContainer:{
        display:'flex', 
        flex:1, 
        flexDirection:'column'
    },
    alignCenter:{
        alignItems:'center'
    },
    alignVCenter:{
        justifyContent:'center'
    },
    selfCenter:{
        alignSelf: 'center',
    },
    textRight:{
        alignSelf: 'flex-end',
    },
    txtCenter:{
        textAlign: 'center',
    },
    txtRight:{
        textAlign: 'right',
    },
    txtJustify:{
        textAlign: 'justify',
    },
    
    bold:{
        fontWeight:'bold'
    },
    headerStyle:{
        marginTop: Platform.OS === "android" ? 0 : 0,
        backgroundColor:'white'
    },
    headerStyle2:{
        marginTop: Platform.OS === "android" ? 0 : 0,
        backgroundColor:'white',
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerCenterWidth:{
        width: SCREEN_WIDTH-110,
    },
    pageTitle:{
        fontSize:20,
    },
    pageSubTitle:{
        fontSize:10,
        color: 'rgb(155,155,155)',
        fontWeight:'bold'
    },
    smallTxt:{
        fontSize:12
    },
    footer:{

        marginTop:10,
        flexBasis: isIphoneX()?95:75,
        flexGrow: 0,
        flexShrink: 0,

        width:SCREEN_WIDTH,
        backgroundColor:'white',
        paddingTop: 10,
        paddingBottom: isIphoneX()?30:10,
        
        // boxShadow: '0px -4px 5px 0px rgba(0,0,0,0.21)',
        shadowColor: '#000000', 
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 3,
        shadowOpacity: 0.4

    },
    footernopad:{

        marginTop:10,
        flexBasis: isIphoneX()?80:50,
        flexGrow: 0,
        flexShrink: 0,

        width:SCREEN_WIDTH,
        backgroundColor:'white',
        paddingTop: 0,
        paddingBottom: 0,
    },
    footer2horizontal:{

        marginTop:10,
        display:'flex',
        flexBasis: isIphoneX()?95:80,
        flexGrow: 0,
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent:'space-between',

        width:SCREEN_WIDTH,
        backgroundColor:'white',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: SCREEN_PAD,
        paddingRight: SCREEN_PAD,
        
        // boxShadow: '0px -4px 5px 0px rgba(0,0,0,0.21)',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 3,
        shadowOpacity: 0.4

    },
    footer2button:{
        position: 'absolute',
        bottom:isIphoneX()?20:0,
        left:0,
        flexBasis: isIphoneX()?160:140,
        width:SCREEN_WIDTH,
        backgroundColor:'white',
        paddingTop: 10,
        paddingBottom: 10,
        
    },
    fade:{
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    inputContainer:{
        marginLeft: 15,
        marginRight: 15,
        ...Platform.select({
            ios: {
                borderBottomColor: colors.grey,
                borderBottomWidth: 0,
                marginLeft: 20,
                marginRight: 20,
            },
            android:{
                borderBottomColor: colors.black,
                borderBottomWidth: 0,
                marginLeft: 20,
                marginRight: 20,
            }
        }),
    },
    inputDefaultContainer:{
        marginLeft:0,marginRight:0
    },
    input:{
        // breaks tests - fix before release
        // Invariant Violation: Invalid undefined `width` of type `string`
        // supplied to `StyleSheet input`, expected `number`.
        // width: '100%',
        marginLeft: 20,
        marginRight: 20,
        color: colors.blue,
        borderBottomColor: colors.grey,
        borderBottomWidth: 1,
        ...Platform.select({
            android: {
                minHeight: 46,
                width: SCREEN_WIDTH - 40,
                borderBottomWidth: 0,
            },
            ios: {
                minHeight: 36,
                width: SCREEN_WIDTH - 40,
            },
        }),
    },
    rawInput:{
        // breaks tests - fix before release
        // Invariant Violation: Invalid undefined `width` of type `string`
        // supplied to `StyleSheet input`, expected `number`.
        // width: '100%',
        marginLeft: 20,
        marginRight: 20,
        color: colors.blue,
        borderBottomColor: colors.grey,
        borderBottomWidth: 1,
        ...Platform.select({
            android: {
                minHeight: 46,
                width: SCREEN_WIDTH - 40,
                borderBottomWidth: 0,
            },
            ios: {
                minHeight: 36,
                width: SCREEN_WIDTH - 40,
            },
        }),
    },

    testingBorder:{
        borderBottomColor:'red',borderBottomWidth:5,
    },

    //------------------------------------------------------------
    //  Form Elements
    //------------------------------------------------------------
    inputContainer:{
        borderBottomColor: 'rgba(0, 96, 169, 0.99)',
        marginLeft: 0,
        marginEnd: 0,
        marginBottom: 20,
    },
    messageCont:{
    //     flexBasis: 40,
    //     flexGrow: 0,
    //     flexShrink: 0,

    },


    //------------------------------------------------------------
    //  Date Picker Time Picker
    //------------------------------------------------------------
    dateTimePickerCont:{
        alignSelf: 'flex-end'
    },
    dateTimePickerInput:{
        borderWidth:0,
        alignItems : 'flex-end',
        alignSelf: 'flex-end',
    },


    //------------------------------------------------------------
    //  Header Listing Pages
    //------------------------------------------------------------
    headContainer:{
        flexDirection: "row",
        height: 80,
        backgroundColor:'white',
        paddingLeft:20,
        paddingRight:20,
        paddingTop: Platform.OS == "ios" ? 20 : 20, // only for IOS to give  Space
        borderBottomColor:'rgba(171,179,189, 0.3)',
        borderBottomWidth:1,
        // Shadow CSS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        // its for android
        elevation: 2,
    },
    headLeft:{ display:'flex', flex:1},
    headCenter:{display:'flex', flex:2},
    headRight:{display:'flex', flex:1, alignItems:"flex-end", marginTop: 15},
    headLogo:{ 
        flexDirection: "row",
        alignSelf:'center',
        width: 154,
        height: 30,
        backgroundColor:'white',
        marginTop: isIphoneX()?20:15
    },

    //------------------------------------------------------------
    // Login Page CSS
    //------------------------------------------------------------
    loginContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabTitle: {
        backgroundColor: 'white',
        padding:4
    },
    selectedTabTitle: {
        borderBottomWidth:4,
        borderBottomColor:'#0060a9'
    },
    loginTextButton: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    titleContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    formContainerFull: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        paddingTop: 30,
        paddingBottom: 20, 
    },
    formContainer: {
        backgroundColor: 'white',
        width: CONTENT_WIDTH,
        paddingTop: 32,
        paddingBottom: 32, 
    },
    loginButton: {
        width:'auto'
    },
    loginText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    helpContainer: {
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    error:{
        borderColor: 'red',
        borderBottomColor:'red',
    },

    //------------------------------------------------------------
    // Account Settings
    //------------------------------------------------------------
    textDisplayContainer:{
        
    },
    displayLabel:{
        color:'rgb(155,155,155)',
        fontSize:12
    },
    verLabel:{
        color:'rgb(155,155,155)',
        fontSize:11
    },

    //------------------------------------------------------------
    // Notifications Settings
    //------------------------------------------------------------
    quiteHoursCard:{
        flex:1,
        flexDirection: 'column',
        marginTop: 20,
        marginBottom: 20,
        borderTopWidth:1,
        borderTopColor: 'rgb(216, 216, 216)',
        display: 'flex',
    },
    quiteHoursRow:{
        borderBottomColor:'rgba(216, 216, 216, 0.25)',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height:40,
        marginLeft: 20,
        marginRight: 20,
    },
    quiteHoursRowLeft:{
        flex:1,
    },
    quiteHoursRowRight:{
        flex:1,
    },
    quiteHoursAndTxt:{
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    quiteHoursAddBtn:{
        fontWeight:'bold',
        fontSize:16,
        marginTop: 30,
        marginBottom: 40,
    },

    empty:{
        // width: CONTENT_WIDTH,
        // alignSelf: 'flex-start',
    },
    

    // Sign In / Sign Up Page CSS
    tabCont:{
        flexDirection:'row',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 10,
        paddingLeft:0,
        paddingRight: 0,
        flexBasis: 40,
        flexGrow: 0,
        flexShrink: 0,
    },
    tabTitle: {
        backgroundColor: 'white',
        padding:4,
        margin: 0,
        marginLeft: 0,
    },
    rowCont:{
        borderBottomWidth:1,
        borderBottomColor: '#EEE',
        paddingTop: 10,
        paddingBottom: 10,
    },
    selectedTabTitle: {
        borderBottomWidth:4,
        borderBottomColor:'#0060a9'
    },
    tinyLinks:{
        marginLeft: SCREEN_PAD,
        marginRight: SCREEN_PAD,
        marginTop: 8,
    },
    titleViewCont:{
        flex: 1,
        flexDirection:'row'
    },
    itemStatus:{
        flex: 1,
        justifyContent: 'center',
    },
    unredDot:{
        color: "rgba(0, 96, 169, 1)",
        alignSelf: 'center',
    },
    titleSec:{
        flex: 10,
    },
    viewLink:{
        flex: 5,
        justifyContent: 'center',
    },
    titleView:{
        fontSize:18,
        color:'rgba(0, 0, 0, 1)',
    },
    titleUnread:{
        fontWeight: 'bold',
    },
    dateView:{
        fontSize:12,
        color:'rgba(155, 155, 155, 1)',
        fontWeight: 'bold',
    },
    subtitleView:{
        fontSize:12,
        color:'rgba(155, 155, 155, 1)',
    },
    viewBtn:{
        backgroundColor:'white',
        borderWidth: 1,
        borderColor: "rgba(0, 96, 169, 1)",
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 2,
    },
    listWrapper:{
        flexGrow:1,
        borderWidth:0,
        flexShrink: 1,
    },
    listContainer:{
        marginTop: 0, 
        borderTopWidth: 0, 
        borderBottomWidth: 0
    },
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
    },


    //------------------------------------------------------------
    // SignUp Confirmation Page
    //------------------------------------------------------------
    confirmContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingTop:80,
        // justifyContent:'flex-start',
        alignItems: 'center',
        paddingLeft: SCREEN_PAD,
        paddingRight: SCREEN_PAD,
    },
    logoImg1800: {
        width: 260,
        height: 50,
        marginTop: 40,
        marginBottom: 60,
        alignSelf: 'center',
    },
    logoImg: {
        width:120,
        height:120,
        marginBottom: 60,
        alignSelf: 'center',
    },
    textContent:{
        fontSize: 16,
        marginBottom:25,
        alignSelf: 'center',
        textAlign:'center'
    },
    linkTxt:{
        color:'rgb(0,96,169)',
    },
    callBtn:{
        // width: SCREEN_WIDTH - ( SCREEN_PAD * 3 ),
        marginBottom:10,
        marginLeft:0,
        backgroundColor:'rgb(0,96,169)',
    },


    //------------------------------------------------------------
    // Styles for View RX Page
    //------------------------------------------------------------
    rxSecContainer:{
        borderBottomColor:'rgba(216, 216, 216, 0.5)',
        borderBottomWidth: 1,
        backgroundColor:'rgba(255, 255, 255, 1)',
        paddingTop: SCREEN_PAD,
        // paddingBottom: SCREEN_PAD,
        marginLeft: SCREEN_PAD,
        marginRight: SCREEN_PAD,
        flexDirection: 'column',
    },
    rxDetailsColRow:{
        flexDirection: 'row',
        paddingBottom: 20,
    },
    rxDetailsCol:{
        flex:1,
    },
    rxDetailsColLeft:{
        flex:7,
    },
    rxDetailsColRight:{
        flex:5,
    },
    rxDetailsColEditable:{
        flex:17,
    },
    rxDetailsColAction:{
        flex:3,
        alignItems: 'flex-end',
        justifyContent:'center'
    },
    rxEditLink:{
        fontSize:14,
        color:'rgb(0,96,169)',
        fontWeight:'bold'
    },
    rxDetailsLabel:{
       fontSize:14,
       color:'rgba(155, 155, 155, 1)',
       fontWeight:'bold'
    },
    rxDetailsTxt:{
        fontSize:16,
        color:'rgba(0, 0, 0, 1)',
        
    },


    //------------------------------------------------------------
    // Styles for View RX Page Edit Overlay
    //------------------------------------------------------------
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        // opacity: 0.5,
        // padding: SCREEN_PAD,
        backgroundColor: colors.white,
        height: isIphoneX()?SCREEN_HEIGHT-90:SCREEN_HEIGHT-65,
        width: SCREEN_WIDTH,
    },
    overlayActionBar:{
        flexBasis: isIphoneX()?70:45,
        flexGrow: 0,
        flexShrink: 0,
        justifyContent:'space-between',
        flexDirection: 'row',
        marginBottom: 10,
        // backgroundColor:'red',
        flex:1
    },
    overlayActionBarLeft:{
        flex:1,
        color:'rgb(0,96,169)',
        fontWeight:'bold',
        marginTop: isIphoneX()?20:0,
    },
    overlayActionBarRight:{
        flex:1,
        textAlign:'right',
        fontWeight:'bold',
        marginTop: isIphoneX()?20:0,
    },

});


export default styles;