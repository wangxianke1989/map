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
          {title: 'Los Angeles', location: {lat: 34.0448411, lng: -118.3053454}},
          {title: 'Silver Lake Reservoir', location: {lat: 34.1002, lng: -118.2882}},
          {title: 'Lake Hollywood Open Space', location: {lat: 34.1252, lng: -118.3272}},
          {title: 'Greystone Park', location: {lat: 34.09198, lng: -118.39924}},
          {title: 'Hollywood', location: {lat: 34.0932, lng: -118.3346}},
          {title: 'Griffith Observatory', location: {lat: 34.11821, lng: -118.29990}},
          {title: 'Dodger Stadium', location: {lat: 34.07363, lng: -118.23998}}
        ],
    query:"",
    showingInfoWindow:false,
    activeMarker:{},
    selectedPlace:{},
    activePosition:{}
  }
  updateQuery(value){
    this.setState({query:value.trim()})
  }
  //通过查询词获取维基百科词条信息
  fetchWiki(place){
    let baseUrl='https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&&list=search&srsearch='
    let request = baseUrl+ place.title
    fetch(request,
      {
        method: "GET",
        headers: {"Api-User-Agent": "Example/1.0"}
      }
    )
    .then((response)=> {
      if(response.ok){
        return response.json();
      }
      throw new Error("Network response was not ok: " + response.statusText);
    })
    .then((data)=>{
      place.wiki = data.query.search[0].snippet;
      this.setState((state)=>({
        locations:state.locations.filter(l=>l.title!==place.title).concat(place)
      }))
    })
  }
  //加载页面的维基百科词条
  componentDidMount(){
    this.state.locations.map((place)=>{
      if(place.wiki){
        return
      }else{
        this.fetchWiki(place);
      }
    })
  }
  //点击地图标记后获取该地点信息
  clickMarker=(props)=>{
    if(props.place.wiki){
      this.setState({
        selectedPlace:props.place,
        activePosition:props.position,
        showingInfoWindow:true
      })
    }else{
      this.fetchWiki(props.place)
      this.setState({
          selectedPlace:props.place,
          activePosition:props.position,
          showingInfoWindow:true
      });
    }
  }
  //点击菜单中地点列表在相应地点位置弹出维基百科信息
  clickMenu=(place)=>{
    // 如果已经获取过了维基百科信息，则不需要再次获取
    if(place.wiki){
      this.setState({
        selectedPlace:place,
        activePosition:place.location,
        showingInfoWindow:true
      });
    }else{
      this.fetchWiki(place);
      this.setState({
        selectedPlace:place,
        activePosition:place.location,
        showingInfoWindow:true
      });
    }
  }



  render(){
    let filteredLocations
    //通过用户的输入信息过滤显示的地点
    if(this.state.query){
      const match = new RegExp(escapeRegExp(this.state.query),'i')
      filteredLocations = this.state.locations.filter((location)=>match.test(location.title))
    }else{
      filteredLocations = this.state.locations
    }
    filteredLocations.sort(sortBy('name'))

    let Markers = filteredLocations.map((place)=>(
              <Marker
                    place={place}
                    name={place.title}
                    position={place.location}
                    onClick = {this.clickMarker} />
              ))

    return(
      <div className="app">

        <div className= "sidebar">
          <h3>Find Place</h3>
          <div className="search-box">
            <input
              className="input-place"
              type="text"
              placeholder="enter place search"
              value = {this.props.query}
              onChange = {(event)=>this.updateQuery(event.target.value)}
            />
            <button className="filter-button">Filter</button>
          </div>
          <ul>
            {filteredLocations.map((place)=>(
              <div className="list">
                <li key={place.title} onClick={()=>this.clickMenu(place)}><p>{place.title}</p></li>
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
            {Markers}

            <InfoWindow
              position = {this.state.activePosition}
              visible ={this.state.showingInfoWindow}>
                <div>
                  <h3>{this.state.selectedPlace.title}</h3>
                  <h4>source:wikipedia</h4>
                  <div dangerouslySetInnerHTML={{ __html: this.state.selectedPlace.wiki}}></div>
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
