import React, { Component } from "react";
import { Joystick } from 'react-joystick-component';
import Config from '../scripts/config';

class Teleoperation extends Component {
  state = { ros: null};

  constructor() {
    super();
    this.init_connection();
    this.handleMove = this.handleMove.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }
  init_connection(){
    this.state.ros = new window.ROSLIB.Ros();
    console.log(this.state.ros);

    this.state.ros.on("connection",() => {
        console.log("connection established in Teleoperation Componenet!");
        console.log(this.state.ros);
        this.setState({ connected: true });
    
    });
    this.state.ros.on("close", () => {
        console.log("connection closed!");
        this.setState({ connected: false });
        //try to reconnect every 3 seconds
        setTimeout(() => {
            try {
                this.state.ros.connect(
                    "ws://" + 
                    Config.ROSBRIDGE_SERVER_IP + 
                    ":"+
                    Config.ROSBRIDGE_SERVER_PORT +
                    ""
                    );
            }catch(error) {
                console.log("connection problem");
            }

        }, Config.RECONNECTION_TIMER);
});

try {
    this.state.ros.connect("ws://" + 
    Config.ROSBRIDGE_SERVER_IP + 
    ":"+
    Config.ROSBRIDGE_SERVER_PORT +
    "");
} catch(error) {
    console.log(
    "ws://" + 
    Config.ROSBRIDGE_SERVER_IP + 
    ":" +
    Config.ROSBRIDGE_SERVER_PORT +
    "")
    console.log("connection problem");
}
    
}

  handleMove = (event) => {
    console.log("handle move");
    //we need to create a Ros publisher on the topic cmd_vel
    var cmd_vel = new window.ROSLIB.Topic({
        ros: this.state.ros,
        name: Config.CMD_VEL_TOPIC,
        messageType: "geometry_msgs/Twist",
    
    });
    //we need to create a twist message to be to published to rosbridge
    var twist = new window.ROSLIB.Message({
        linear: {
            x: event.y,
            y: 0,
            z: 0,
        },
        angular: {
            x: 0,
            y: 0,
            z: -event.x,
        },
    });
    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
  }

  handleStop = (event) => {
    console.log("handle stop");
    var cmd_vel = new window.ROSLIB.Topic({
        ros: this.state.ros,
        name: Config.CMD_VEL_TOPIC,
        messageType: "geometry_msgs/Twist",
    
    });
    //we need to create a twist message to be to published to rosbridge
    var twist = new window.ROSLIB.Message({
        linear: {
            x: 0,
            y: 0,
            z: 0,
        },
        angular: {
            x: 0,
            y: 0,
            z: 0,
        },
    });
    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
  }

  render() {
    return (
      <div>
        <TeleoperationJoystick
          move={this.handleMove}
          stop={this.handleStop}
        />
      </div>
    );
  }
}

const TeleoperationJoystick = (props) => (
  <Joystick
    size={100}
    baseColor="red"
    stickColor="black"
    move={props.move}
    stop={props.stop}
  />
);

export default Teleoperation;
