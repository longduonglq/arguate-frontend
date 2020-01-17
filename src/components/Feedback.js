import React, { Component, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import GWebsocket from "../websocket";
import GConfig from "../GConfig";

function isEmptyOrSpaces(str){
    return str === null || str.match(/^\s*$/) !== null;
}

class Feedback extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          open: false,
          email: '',
          feedback: ''
      };
  }

  handleClickOpen = () =>{
      this.setState({open: true});
  };
  handleClose = () => {
      this.setState({open: false, email: '', feedback: ''});
  };
  emailChange = (e) => {
      this.setState({email: e.target.value});
  };
  fbChange = (e) => {
      this.setState({feedback: e.target.value});
  };

  handleSend = () => {
      if (isEmptyOrSpaces(this.state.email) && isEmptyOrSpaces(this.state.feedback)) return;
      GWebsocket.send_feedback(this.state.email, this.state.feedback);
      this.handleClose();
  };

  render() {
      return (
    <div style={{...this.props.style, marginTop: 10}}>
      <Button variant="contained" color='primary' onClick={this.handleClickOpen}
            style={{background: GConfig.Global.feedbackBtnColor}}>
        Feedback
      </Button>
      <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please describe the problem or give a suggestion. Your email is necessary for us
              to be able get back to you.
          </DialogContentText>
          <TextField
            autoFocus
            value={this.state.email}
            onChange={this.emailChange}
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
          <TextField
              value={this.state.feedback}
              onChange={this.fbChange}
            margin="dense"
            id="fback"
            label='Enter problem or suggestion here'
            type="text"
            multiline={true}
            rows={6}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={this.handleSend} color='primary'>
             Send Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  }

}
export default Feedback;