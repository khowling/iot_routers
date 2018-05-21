import React, { Component } from 'react'
import update from 'immutability-helper';
/*
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
*/
import {Alert} from './common.js'

// Imports components from Fluent Web https://fluentweb.com/building-blocks 
import { Header, ContentPlacement, TypographicIntro, Footer, Hyperlink, Select, TextField, Label, Checkbox, CallToAction, Divider } from '@ms-fw/fw-react/components';

// Imports layout features from Fluent Web https://fluentweb.com/prototyping/getting-started/grid-layout 
import { Page, Grid, Column } from '@ms-fw/fw-react/layouts';



const AttitionalInfo = ({user}) => 
            <div className="m-additional-information " style={{"boarderLeft": "0px solid rgba(0,0,0,.2)"}}>
                <div data-grid="col-12 stack-2">
                        <div data-grid="col-6">
                            <ul className="c-list f-bare f-lean">
                                <li>
                                    <strong>Router Model</strong>
                                </li>
                                <li>{user.install && user.install["router-model"]}</li>
                            </ul>
                            <ul className="c-list f-bare f-lean">
                                <li>
                                    <strong>Router Install Date</strong>
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
                        <div data-grid="col-6">
                            <div className="c-age-rating">
                                <img className="c-image" src="http://www.campandfurnace.com/website/wp-content/themes/campandfurnace/images/ui/button_m.png" alt="Placeholder with grey background"/>
                                <p className="c-label">Install Notes</p>
                                <p className="c-paragraph">Cable South Wall</p>
                                <div className="c-content-toggle">
                                    <ul className="c-list f-bare f-lean" id="learn-more" data-f-expanded="false">
                                        <li>Downstairs dining room</li>
                                    </ul>
                                    <button data-f-more="More" data-f-less="Less" data-f-show="0" aria-hidden="true">More</button>
                                </div>
                            </div>
                            <div className="c-content-toggle">
                                <p id="content-toggle-target" data-f-expanded="false">
                                    <strong>Permissions</strong>
                                    <br/>{user.install && user.install["permission"]}
                                </p>
                                <button data-f-more="Show more" data-f-less="Show less" data-f-show="3" aria-hidden="true">Show more</button>
                            </div>
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

export default class New extends Component {
    state = { count: 0, point_addresses: {}};

    componentWillReceiveProps(nextProps) {
        console.log (`routers will update :: current ${this.props.routers.length}, next: ${nextProps.routers.length}`)
        if (nextProps.routers.length > this.props.routers.length) {
           let newstate = this.state;
           for (let router of nextProps.routers) {
                if (!this.props.routers.find (x => x.id === router.id)) {
                    console.log ('plotting new pin')
                    //Add the pushpin to the map
                    let loc =  new  window.Microsoft.Maps.Location(router.latlong[0], router.latlong[1])
                    let pin = new window.Microsoft.Maps.Pushpin(loc, {})
                    pin.metadata = {
                        title: router.address,
                        description: router.id
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
                    })
                    this.map.entities.push(pin);

                    // updating table

                    newstate =
                        { count: newstate.count+1,
                          point_addresses: { 
                            ...newstate.point_addresses,  
                            [router.address]: typeof newstate.point_addresses[router.address] === "undefined" ? 1 : newstate.point_addresses[router.address]+1
                        }}
                }
            }
            this.sliderVal.value = newstate.count
            this.sliderOutVal.value = newstate.count
            this.setState(newstate)
        }
    }

    componentDidMount() {
        let mapint = setInterval(() => {
            console.log ('setting map - waiting for library to initialise')
            if ( window.Microsoft.Maps) {
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

    sliderChange(event) {
        console.log (`sliderChange ${event.target.value}`)
        this.sliderOutVal.value = event.target.value
    }
    updateServer() {
        
        fetch("/setActors", {
            method: "POST",
            body: JSON.stringify({"number": this.sliderOutVal.value})
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
        
            <Grid 
                columnCount={ 12 } 
                gutter={ 2 }
            >
                <Column span={[12]}>
                <TypographicIntro
                    backgroundColor={"accent"}
                    heading={{
                        "tag": "h1",
                        "text": "Save on Surface"
                      }}
                    subheading={{
                        "tag": "p",
                        "text": "Get up to $200 off select Surface Pro and Surface Laptop with Intel Core i5 processors"
                      }}
                />
                </Column>

                <Column span={[6]}>
                <Label  text="Order Ref"/>
                <TextField  name="Text field with placeholder" type="text"  placeholder="012345"/>

                    <Select id="select01" flex={true} label={{"id": "selectLabel01","text": "Choose Town"}}
                        options={[
                            {
                              "value": "Stoke-on-Trent, Staffordshire",
                              "text": "Stoke-on-Trent, Staffordshire"
                            },
                            {
                              "value": "Solihull, Birmingham",
                              "text": "Solihull, Birmingham"
                            },
                            {
                              "value": "Eastbourne, East Sussex",
                              "text": "Eastbourne, East Sussex"
                            },
                            {
                                "value": "Cardiff",
                                "text": "Cardiff"
                            },
                            {
                                "value": "Oxford, Oxfordshire",
                                "text": "Oxford, Oxfordshire"
                            },
                            {
                                "value": "London",
                                "text": "London"
                            },
                            {
                                "value": "Swindon",
                                "text": "Swindon"
                             },
                            {
                                "value": "Gravesend, Kent",
                                "text": "Gravesend, Kent"
                            },
                            {
                                "value": "Northampton, Northamptonshire",
                                "text": "Northampton, Northamptonshire"
                            },
                            {
                                "value": "Rugby, Warwickshire",
                                "text": "Rugby, Warwickshire"
                            },
                            {
                                "value": "Sutton Coldfield, West Midlands",
                                "text": "Sutton Coldfield, West Midlands"
                            },
                            {
                                "value": "Harlow, Essex",
                                "text": "Harlow, Essex"
                            },
                            {
                                "value": "Aberdeen, Aberdeen City",
                                "text": "Aberdeen, Aberdeen City"
                            },
                            {
                                "value": "Swansea, Swansea",
                                "text": "Swansea, Swansea"
                            },
                            {
                                "value": "Chesterfield, Derbyshire",
                                "text": "Chesterfield, Derbyshire"
                            }
                          ]} />

                    <Checkbox  items={[{ "id": "checkbox01", "name": "checkboxExample", "value": "checkboxExampleValue01", "text": "Accept T&C", "checked": false}]}/>
                    <Divider verticalSpace={{"bottom": 6, "top": 3}} />
                    <CallToAction  href="#"  text="Order now"/>   

                </Column>
                <Column span={[6]}>
                <Label  text="Order Status"/>
                <TextField   name="Text field with placeholder" type="text"  value="NEW ORDER" readOnly={true} />
                </Column>
            </Grid>
        )
    }
}
