import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';

// Imports components from Fluent Web https://fluentweb.com/building-blocks 
import { Header, ContentPlacement, TypographicIntro, Footer, Hyperlink } from '@ms-fw/fw-react/components';

// Imports layout features from Fluent Web https://fluentweb.com/prototyping/getting-started/grid-layout 
import { Page, Grid, Column } from '@ms-fw/fw-react/layouts';

import {
  BrowserRouter as Router,
  Route,
//  Link
} from 'react-router-dom'

import Simulation from './components/simulation.js'
import New from './components/new.js'

const styles = require('@ms-fw/fw-react/assets/css/fw-default-west-european.css');



class App extends Component {

  render() {
    return (
      <Router>
          <div>
            <Header
                globalNavigation={{
                    "theme": "",
                    "logo": {"href": "/","image": {  "src": "https://fluentweb.com/images/microsoft-gray.svg", "alt": "Microsoft"},"text": "Microsoft"},
                    "items": [
                        {"text": "Simulator", "href": "/sim"},
                        {"text": "Surface", "href": "#"},
                        {"text": "Admin", "href": "#"},
                        {
                            "buttonText": "More",
                            "id": "moreButton",
                            "items": [
                              {"text": "Business", "href": "https://www.microsoft.com/en-us/store/b/business?icid=TopNavBusinessStore"}
                            ]
                        }
                    ]
                }}
                mobileToggle={{ "glyph": "global-nav-button", "glyphOnly": true, "text": "Menu" }}
                mobilePrevious={{ "glyph": "chevron-left", "glyphOnly": true, "text": "Previous"}}
                mobileNext={{ "glyph": "chevron-right", "glyphOnly": true,"text": "Next"}}
                actions={[
                    { "glyph": "waffle","glyphOnly": true,"text": "Menu" },
                    { "glyph": "search", "glyphOnly": true, "text": "Search" },
                    { "glyph": "shop-brand", "glyphOnly": true, "href": "#","text": "Bag" }
            ]}/>
            <div style={{"margin": "10px"}}/>
            <Page>
                
                <Route exact path="/" render={(props) => (<New />)}/>
                <Route exact path="/sim" render={(props) => (<Simulation />)}/>
            </Page>
        </div>
      </Router>
        
    )
  }
}

export default App;
