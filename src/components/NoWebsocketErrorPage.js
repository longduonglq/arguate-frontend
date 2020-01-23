import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import GConfig from "../GConfig";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Logo from "../logo192.png";
import Toolbar from "@material-ui/core/Toolbar";

import '../styles/MainUI_style.css';
import '../styles/App.css';

class NoWebsocket extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{height: '100%'}}>
            <AppBar style={{backgroundColor: GConfig.Global.appBarColor,
                            }} position='static'>
                <Grid container spacing={3} justify='center' className='appBarGrid'>
                    <Toolbar style={{margin: 10}}>
                        <img src={Logo} width={64} height={64}/>
                        <Typography variant='h3'>
                            <Box textAlign='center' fontWeight={130}>
                                Arguate
                            </Box>
                        </Typography>
                    </Toolbar>
                </Grid>
            </AppBar>
                <Typography component='div' >
                <Box textAlign='center' m={4} fontWeight='fontWeightLight'
                    fontSize={30} >
                    <b>Oops...</b><br/>
                    Something went wrong
                </Box>
                </Typography>

            </div>
        );
    }
}

export default NoWebsocket;