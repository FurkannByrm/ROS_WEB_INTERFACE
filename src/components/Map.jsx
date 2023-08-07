import React, { Component } from "react";
import Config from "../scripts/config";



class Map extends Component {
    state = {
        ros: null,
    };

    constructor() {
        super();
        this.view_map = this.view_map.bind(this);
    }

    init_connection() {
        //this.setState({ ros: new ROSLIB.Ros() });
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros); 
        try {
            this.state.ros.connect( "ws://" + Config.ROSBRIDGE_SERVER_IP + ":" + Config.ROSBRIDGE_SERVER_PORT
            );
            //this.setState({ ros }, this.view_map); // view_map'i setState callback olarak çağırın
        } catch (error) {
            console.log(
                "ws://" + Config.ROSBRIDGE_SERVER_IP + ":" + Config.ROSBRIDGE_SERVER_PORT
            );
            console.log("Robot WS'ye bağlanılamıyor. 1 saniye sonra tekrar deneyin");
        }
    }

    componentDidMount() {
        this.init_connection();
        //this.view_map();
    }

    view_map() {
       
            var viewer = new window.ROS2D.Viewer({
                divID: "nav_div",
                width: 640,
                height: 480,
            });

           // eslint-disable-next-line no-unused-vars
            var navClient = new window.NAV2D.OccupancyGridClientNav({
                ros: this.state.ros,
                rootObject: viewer.scene,
                viewer: viewer,
                serverName: "/move_base",
                withOrientation: true,
            });

    }

    render() {
        return (
            <div>
                <div id="nav_div">Viewer</div>
            </div>
        );
    }
}

export default Map;
