import {red, blue, orange, grey} from '@material-ui/core/colors';

const GConfig = {
    Global: {
        buttonColor: blue[500],
        warningBtnColor: red[400],
        disableButtonColor: grey[700],
        feedbackBtnColor: blue[800],

        appBarColor: 'rgba(237,135,45,0.87)',
        welcomeBackground: 'white',

        title: {
            default: 'Arguate - Debate with random people',
            looking: 'Arguate - Looking ...',
            found: 'Arguate - You are connected!',
            nop: 'Arguate - Couldn\'t find anyone',
            ser: 'Arguate - Server error',
            otherD: 'Arguate - Other user disconnected',
            newMsg: 'Arguate - (!) New message'
        },
        showNumberOfPeople: true
    },
    TopicUI: {
        backgroundColor: 'bisque',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: '6px',

        planeBackgroundColor: 'lightBlue',
        searchBarMinuteToResetCache: 1
    },
    ChatUI: {
        box: 'none',
        fontWeight: 430,

        user_typing_pulse: 760,
    },
    ws: {
        chatFindingAttempts: [1, 1, 1, 1.5, 2.5, 4.5, 6],
    }
};

export default GConfig; 
