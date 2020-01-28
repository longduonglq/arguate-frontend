import React from 'react';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';

class WelcomeMsg extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Typography component='div' >
                <Box textAlign='justify' m={4} fontWeight='fontWeightRegular'
                    fontSize={18} >
                    <b>What is Arguate?</b><br/>
                    Arguate is a website that let you chat with
                    people who disagree with you. The goal of this website is to be a
                    platform where people could challenge each other beliefs via
                    interesting conversations.
                </Box>
                <Box textAlign='justify' m={4} fontWeight='fontWeightRegular'
                    fontSize={18} >
                    <b>How does Arguate work?</b><br/>
                    You will first need to choose at least one topic
                     by typing keywords in the search bar. You can also create
                    new topic by simply typing it in the search bar and press
                    Enter.
                    Once finished,
                    you can use the toggle switch to express your opinion about the topic.
                    A <b style={{color:'green'}}>green</b> toggle means you agree with the topic
                    while a <b style={{color:'red'}}>red</b> one means you disagree with it.
                    Then, press <b style={{color:'blue'}}>Start Chat</b>. Arguate will find
                    and match you with another user who has the opposite opinion.
                </Box>
                </Typography>
            </div>
        );
    }
}

export default WelcomeMsg;