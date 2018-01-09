import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
//  Link
} from 'react-router-dom'

import Bot from './components/bot.js'

const RichHeading = () => 
  <div className="m-rich-heading  f-image">
    <picture className="c-image">
        <img srcSet="https://media.licdn.com/mpr/mpr/shrinknp_800_800/p/1/005/0ac/3fe/06aaca7.jpg" src="https://media.licdn.com/mpr/mpr/shrinknp_800_800/p/1/005/0ac/3fe/06aaca7.jpg" alt="Placeholder with dark grey background"/>
    </picture>
    <section  data-grid="container">
        <div data-grid="col-12">
            <h3 className="c-heading">TopTelco - Subscriber Portal</h3>
            <p className="c-paragraph-3">You can now personalize your Connectivity with over 8 million possible options. You design it. We provide it.</p>
        </div>
    </section>
  </div>


class App extends Component {
  state = { connection: {status: "Not Connected"}, routers: [], caseupdates: [], user:{} };

  _wsSendJoin(keepalive) {
    console.log(`ws: on open : ${keepalive}`);
    this.setState ({connection: {status:  "connected"}})
  }

  _wsMessageEvent(event) {
    console.log(`ws: on message : ${event.data}`);
    let msg = JSON.parse(event.data)
    if (msg.type === "router") {
        this.setState({routers: this.state.routers.concat(msg.value)})
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
      }, 5000);
  }


  componentDidMount() {
    this._wsConnect()
    /*
    // elegant APIs around XHR, available now in Firefox and Chrome Canary
    fetch ('/api/query/subscriber/CUST001?ex_cols=install,email', {
        headers: new Headers({
            'Content-Type': 'text/plain'
        })
    }).then(response => {
        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText));
        } else {
            // this returns a Promise to the chained method
            return response.json()
        }
    }).then(u => this.setState ({user: u[0]}), err => console.log(`failed to get cases : ${err}`))
    */
  }

  render() {
    return (
      <Router>
            <main id="mainContent">
                <RichHeading/>
                <div data-grid="container">
                    <Route exact path="/" render={(props) => (<Bot connection={this.state.connection} routers={this.state.routers} />)}/>
                </div>
            </main>
        </Router>
    )
  }
}

export default App;
