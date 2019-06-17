import React,{Component} from 'react';
import {Map,InfoWindow,Marker,GoogleApiWrapper} from 'google-maps-react';
import escapeRegExp from "escape-string-regexp"
import sortBy from 'sort-by'
import './App.css';
//import Maps from './map.js'
//import SideBar from './sidebar'

export class App extends Component {
  state ={
    locations:[
          {title: 'Los Angeles', location: {lat: 34.0208, lng: -118.6523}},
          {title: 'Silver Lake Reservoir', location: {lat: 34.1002, lng: -118.2882}},
          {title: 'Lake Hollywood Open Space', location: {lat: 34.1252, lng: -118.3272}},
          {title: 'Greystone Park', location: {lat: 34.09198, lng: -118.39924}},
          {title: 'Hollywood', location: {lat: 34.0932, lng: -118.3346}},
          {title: 'Griffith Observatory', location: {lat: 34.11821, lng: -118.29990}},
          {title: 'Dodger Stadium', location: {lat: 34.07363, lng: -118.23998}}
        ],
    query:""
  }
  updateQuery(value){
    this.setState({query:value.trim()})
  }

  render(){
    let filteredLocations
    if(this.state.query){
      const match = new RegExp(escapeRegExp(this.state.query),'i')
      filteredLocations = this.state.locations.filter((place)=>match.test(place.title))
    }else{
      filteredLocations = this.state.locations
    }
    filteredLocations.sort(sortBy('name'))

    return(
      <div className="app">

        <div className= "sidebar">
          <h3>Find Place</h3>
          <div>
            <input
              id="search-place"
              type="text"
              placeholder="enter place search"
              value = {this.props.query}
              onChange = {(event)=>this.updateQuery(event.target.value)}
            />
          </div>
          <ul>
            {filteredLocations.map((place)=>(
              <div>
                <li key={place.title}><p>{place.title}</p></li>
              </div>
            ))}
          </ul>
        </div>

        <div id="map">
          <Map
            google={this.props.google}
            initialCenter={{
              lat: 34.07363,
              lng: -118.23998
            }}
            zoom={10}
            >
            {filteredLocations.map((place)=>(
              <Marker
                    name={place.title}
                    position={place.location} />
              ))
            }
            <InfoWindow onClose={this.onInfoWindowClose}>
                <div>
                  <h1>{}</h1>
                </div>
            </InfoWindow>
          </Map>
        </div>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey:("AIzaSyC6KpK0RBFA8yHtzTYBYhOhGWEnqCgS8oA")
})(App)
