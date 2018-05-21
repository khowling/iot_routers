import React, { Component } from 'react'
import update from 'immutability-helper';

/*
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
*/
import { FabricSlider, Hyperlink, Select, Label, Checkbox, CallToAction, Divider, Button, NumberField, Heading, Alert } from '@ms-fw/fw-react/components';
import { Page, Grid, Column } from '@ms-fw/fw-react/layouts';

import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { TextField } from 'office-ui-fabric-react/lib/TextField';


const AttitionalInfo = ({user = {install:{}}}) => 
    <div className="m-additional-information " style={{"boarderLeft": "0px solid rgba(0,0,0,.2)"}}>
        <div data-grid="col-12 stack-2">

            <div data-grid="col-6">
                <div className="c-age-rating">
                    <img className="c-image" src="http://www.campandfurnace.com/website/wp-content/themes/campandfurnace/images/ui/button_m.png" alt="Placeholder with grey background"/>
                    <p className="c-label">Install Location</p>
                    <p className="c-paragraph">{user.address}</p>
                    <div className="c-content-toggle">
                        { user.latlong &&
                            <ul className="c-list f-bare f-lean" id="learn-more" data-f-expanded="false">
                                    <li>lat: {user.latlong[0]}, lon: {user.latlong[1]}</li>
                                    <li>Downstairs dining room</li>
                            </ul>
                        }
                        <button data-f-more="More" data-f-less="Less" data-f-show="0" aria-hidden="true">More</button>
                    </div>
                </div>
                <div className="c-content-toggle">
                    <p id="content-toggle-target" data-f-expanded="false">
                        <strong>Id</strong>
                        <br/>{user.id}
                    </p>
                    <button data-f-more="Show more" data-f-less="Show less" data-f-show="3" aria-hidden="true">Show more</button>
                </div>
            </div>
            
            <div data-grid="col-6">
                <ul className="c-list f-bare f-lean">
                    <li>
                        <strong>Status</strong>
                    </li>
                    <li>{user.install && user.install["router-model"]}</li>
                </ul>
                <ul className="c-list f-bare f-lean">
                    <li>
                        <strong>Performance</strong>
                    </li>
                    <li>{user.install && user.install["install-date"]}</li>
                </ul>
                <ul className="c-list f-bare f-lean">
                    <li>
                        <strong>Firmware Version</strong>
                    </li>
                    <li><div className="pulseme">{user.install && user.install["firmware-version"]}</div></li>
                </ul>
            </div>
        </div>
    </div>


class Cases extends Component {
    state = {cases: []};

    componentDidMount() {
    }

    render () {

        return (
            <div className="c-table f-divided"  style={{"width": "95%"}} data-f-loc-ascending="Sorted by {0} - ascending" data-f-loc-descending="Sorted by {0} - descending">
                <table data-f-sort="true">
                    <thead>
                        <tr>
                            <th scope="col" className="f-sortable" colSpan="1" aria-sort="none">
                                <button aria-label="Sort by Item">Name</button>
                            </th>
                            <th scope="col" className="f-sortable f-numerical" colSpan="1" aria-sort="none">
                                <button aria-label="Sort by Width">Count</button>
                            </th>
                            <th scope="col" className="f-sortable f-numerical" colSpan="1" aria-sort="none">
                                <button aria-label="Sort by Price">Status</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { Object.entries(this.props.point_addresses).map(([k,v]) => 
                            <tr key={k}>
                                <td>{k}</td>
                                <td className="f-numerical f-sub-categorical">{v}</td>
                                <td className="f-numerical f-sub-categorical"><strong>active</strong></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default class Simulation extends Component {
    state = { count: 0, point_addresses: {}};

    state = { connection: {status: "Not Connected"}, plotted: [], point_addresses: {}, desiredChange: 0, diff: 0 };

    _wsSendJoin(keepalive) {
      console.log(`ws: on open : ${keepalive}`);
      this.setState ({connection: {status:  "connected"}})
    }
  
    _wsMessageEvent(event) {
      console.log(`ws: on message : ${event.data}`);
      let msg = JSON.parse(event.data)
      if (msg.type === "router") {
          this.plotNewrouters(msg.value)
      } else if (msg.type === "subscriber") {
          this.setState({user: msg})
      }
    }
  
    _wsCloseEvent(event) {
      console.log(`ws: on close : ${event.data}`) 
      if (this.ws) {
          this.ws.removeEventListener('open', this._wsSendJoin.bind(this));
          this.ws.removeEventListener('message', this._wsMessageEvent.bind(this));
          this.ws.removeEventListener('close', this._wsCloseEvent.bind(this));
          this.ws = null;
      }
      this.setState ({connection: {status: "Not Connected"}})
    }
  
    _wsConnect() {
        setInterval(() => {
          if (this.state.connection.status !== "connected") {
              console.log(`ws: trying to establish connection`) 
              this.ws = new WebSocket(`ws://${window.location.hostname}:5000/ws`)
              this.ws.addEventListener('open', this._wsSendJoin.bind(this, false))
              this.ws.addEventListener('message', this._wsMessageEvent.bind(this))
              this.ws.addEventListener('close', this._wsCloseEvent.bind(this))
          }
        }, 3000);
    }

    plotNewrouters(newroutes) {
        console.log (`routers will update :: next: ${newroutes.length}`)
        //if (nextProps.routers.length > this.props.routers.length) {
        let newplotted = [...this.state.plotted];
        for (let router of newroutes) {
            if (!this.state.plotted.find (x => x.id === router.id)) {
                console.log ('plotting new pin')
                //Add the pushpin to the map
                let loc =  new  window.Microsoft.Maps.Location(router.latlong[0], router.latlong[1])
                let pin = new window.Microsoft.Maps.Pushpin(loc, {})
                pin.metadata = {
                    title: router.address,
                    description: "SuperFast 5000",  
                    id: router.id
                };

                
                let pininfo = new window.Microsoft.Maps.Infobox(loc, { visible: false });
                pininfo.setMap(this.map);
                window.Microsoft.Maps.Events.addHandler(pin, 'click', (e) => {
                    //Make sure the infobox has metadata to display.
                    if (e.target.metadata) {
                        //Set the infobox options with the metadata of the pushpin.
                        pininfo.setOptions({
                            location: e.target.getLocation(),
                            title: e.target.metadata.title,
                            description: e.target.metadata.description,
                            visible: true
                        })
                    }
                    fetch(`/getActor?id=${e.target.metadata.id}`,).then(response => {
                        if (response.status !== 200) {
                            return Promise.reject(new Error(response.statusText));
                        } else {
                            // this returns a Promise to the chained method
                            return response.json()
                        }
                    }).then(json => this.setState({selectedRouter: json}), err => console.log(`failed to get cases : ${err}`))
                })
                this.map.entities.push(pin);
                newplotted.push(router)
                // updating table
/*
                newstate =
                    { count: newstate.count+1,
                        point_addresses: { 
                        ...newstate.point_addresses,  
                        [router.address]: typeof newstate.point_addresses[router.address] === "undefined" ? 1 : newstate.point_addresses[router.address]+1
                    }}
*/
            }
        }
        //this.sliderVal.value = newplotted.count
        //this.sliderOutVal.value = newplotted.count
        this.setState({plotted: newplotted, sliderval: newplotted.length, desiredChange: newplotted.length  - newplotted.length})
        //}
    }

    componentDidMount() {
        this._wsConnect()
        let mapint = setInterval(() => {
            console.log ('setting map - waiting for library to initialise')
            if ( window.Microsoft && window.Microsoft.Maps) {
                window.clearInterval(mapint)
                console.log ('setting map - got it')
                this.map = new window.Microsoft.Maps.Map(this.mapdiv,  {
                    credentials: "Ahosdb4UWsiFn64w1Oo7ybVcyuTUg6tcgr0LLGdCw26gtMss1kcaLEsipazFLueH",
                    showMapTypeSelector: false,
                    center: new  window.Microsoft.Maps.Location(54.685524, -3.596159), 
                    zoom: 6
                })

                var center = this.map.getCenter();

            } else {
                console.log ('setting map - library not loaded')
            }
        }, 500)
    }

    componentWillUnmount() {
        if (this.ws) {
            this.ws.close();
        }
    }

    sliderChange(event) {
        console.log (`sliderChange ${event}`)
        this.setState({sliderval: event, desiredChange: event  - this.state.plotted.length})
    }

    requestNewActors() {
        fetch("/setActors", {
            method: "POST",
            body: JSON.stringify({"number": this.state.sliderval})
        }).then(response => {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            } else {
                // this returns a Promise to the chained method
                return response.json()
            }
        }).then(json => console.log(`success ${json}`), err => console.log(`failed to get cases : ${err}`))
    }

    render () {
        return (
            <Grid columnCount={12}  gutter={2}>
                <Column span={[6]}>
                    <section>
                        <Heading tag="h2" level={5} text="Device Simulation (Virtual Actors)"/>
                        <Divider verticalSpace={{"top": 1,"bottom": 6}}/>
                        <Grid columnCount={8}  gutter={2}>
                            <Column span={8}>
                            <Slider
                                label='Desired Actor count' min={0}   max={1000} step={5} showValue={true} value={this.state.sliderval}
                                disabled={this.state.connection.status !== "connected"} onChange={this.sliderChange.bind(this)} />
                            </Column>
                            <Column span={3}>   
                                <TextField label="Desired Change" value={this.state.desiredChange}  disabled={true} />
                            </Column>
                            <Column span={2}/>  
                            <Column span={3}>
                                <Button disabled={this.state.connection.status !== "connected"} text="> Set Desired Count" onClick={this.requestNewActors.bind(this)}/>
                            </Column>
                        </Grid>

                        <Heading tag="h2" level={5} verticalSpace={true} text="Select Virtual Router Connection"/>
                        <Divider verticalSpace={{"top": 1,"bottom": 6}}/>
                        <AttitionalInfo user={this.state.selectedRouter}/>

                        <Heading tag="h2" level={5} verticalSpace={true} text="Plotted"/>
                        <Divider verticalSpace={{"top": 1,"bottom": 6}}/>
                        <Cases point_addresses={this.state.point_addresses}/>

                    </section>
                </Column>
                <Column span={[6]}>
                    <section>
                        <Alert alertType="warning" message="Simulated devices." closeButton={{"text": "Try Microsoft Edge"}} icon={{"iconType": "info","iconAriaLabel": "Icon aria-label"}}/>
                        <div style={{"position": "relative", "height": "550px", "textAlign": "left"}}>
                            <div style={{"height": "700px"}} ref={(div) => { this.mapdiv = div; }}></div>
                        </div>
                    </section>
                </Column>
            </Grid>
        )
    }
}
