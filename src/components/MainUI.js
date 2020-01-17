import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from "@material-ui/core/Typography";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {connect} from 'react-redux';

import GConfig from "../GConfig";
import * as tabAction from '../store/actions/Tabs';
import Control from "./MainControl";
import WelcomeMsg from "./WelcomeMsg";
import Container from "@material-ui/core/Container";
import Feedback from "./Feedback";
import ChatUI from "./ChatUI";
import Logo from '../logo192.png';

import '../styles/MainUI_style.css';

class TabPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                hidden={this.props.value !== this.props.index}
                id={`full-width-tabpanel-${this.props.index}`}
                style={this.props.style}
                className={this.props.ClassName}
                >
                {this.props.value === this.props.index &&
                    <div style={this.props.style} className={this.props.ClassName}>
                        {this.props.children}
                    </div>}
            </div>
        );
    }
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
  };
}

class MainUI extends React.Component{
    constructor(props) {
        super(props);
    }

    handleTabChange = (event, newValue) => {
        if (this.props.topics.length === 0 && newValue !== 0) return;
        this.props.setCurrentTab(newValue);
    };

    render() {
        return (
            <div style={{height: '100%'}}>
            <AppBar style={{backgroundColor: GConfig.Global.appBarColor}} position='static'>
                <Grid container spacing={3} className='appBarGrid'>
                    <Grid item xs={12} sm={3}>
                    <Toolbar>
                        <img src={Logo} width={64} height={64}/>
                        <Typography variant='h3'>
                            <Box textAlign='center' fontWeight={130}>
                                Arguate
                            </Box>
                        </Typography>
                    </Toolbar>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Tabs value={this.props.curTab} onChange={this.handleTabChange}
                                style={{height: '100%'}} centered>
                            <Tab label='Home' {...a11yProps(0)} style={{fontSize: 20}}/>
                            <Tab label='Chat' {...a11yProps(1)} style={{fontSize: 20}}/>
                        </Tabs>
                    </Grid>
                </Grid>
            </AppBar>
            
            <TabPanel value={this.props.curTab} index={0}
                      style={{background: GConfig.Global.welcomeBackground,
                            height: '100%'}}>
                <div >
                    <Typography component='div'>
                        <Box textAlign='center' fontWeight={90}
                            fontSize={60} style={{paddingTop: 30, paddingBottom: 20}}>
                            Arguate
                        </Box>
                    </Typography>

                     <Control/>
                     <WelcomeMsg/>
                     <div align='center' >
                         <Feedback/>
                     </div>
                     <div style={{height: 30, background:'transparent'}}></div>
                </div>
            </TabPanel>

            <TabPanel value={this.props.curTab} index={1} ClassName='chatui'>
                <ChatUI/>
            </TabPanel>
            </div>    
        );
    }
}

const mapStateToProps = state => {
    return {
        curTab: state.tab.tab,
        topics: state.topic.topics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentTab: (tab) => dispatch(tabAction.setActiveTab(tab))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainUI);