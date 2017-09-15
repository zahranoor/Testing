import React, { Component } from 'react';
import jquery from 'jquery';
import axios from 'axios';
import currency from 'currency-formatter';
import { hashHistory } from 'react-router';
import moment from 'moment';
let app_status = process.env.REACT_APP_STATUS;
console.log('listingjs env: ',app_status);
// let apiKey = (process.env.REACT_APP_STATUS === 'development') ? "https://localhost:8080" : "https://vast-shore-14133.herokuapp.com";

let apiKey="https://vast-shore-14133.herokuapp.com";

// let apiKey = "https://localhost:8080";

class Featured extends Component{
  constructor(props){
    super(props);
    this.state = {
      featured:[],
      results:[]
    }
  }
  componentWillMount(){
    this.getChosenListings();
  }
  getChosenListings(){
    let url=apiKey+"/info/getfeaturedlistings";
    axios.get(url).then((response)=>{
//REVERT TO TOP PRICED LISTINGS IF LESS THAN 3 OPEN HOUSES STORED:
      let len = response.data.results.length;
      if(len<3){
        this.getTopListings();
        return;
      }
      this.plotListings(response);
    }).catch((err)=>{
      console.log('err - ',err);
    });
  }
  getTopListings(){
    let featured = [];
    console.log('getting top listings');
    axios.get(apiKey + '/info/featured').then(
      (response)=>{
        console.log('featured response: ',response);
        this.plotListings(response);
      }
    ).catch((err)=>{
      console.log('error -',err);
    });
  }
  plotListings(response){
    let featured = [];
    console.log('axios: ',response);
    let results = response.data.results;
    featured = response.data.results.slice(0,3).map((listing)=>{
      let price = currency.format(listing.list_price,{ code: 'USD', decimalDigits: 0 });
      price = price.slice(0,price.length-3);
      //get day of the week:
      let event_start = (listing.open_house_events[0]) ? listing.open_house_events[0].event_start : '';
      let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      let date = moment(event_start);
      let new_date = moment(event_start).calendar();
      new_date = (new_date !== "Invalid date") ? ' - '+new_date : '';
      console.log('moment: ', date);
      let dow = date.day();
      dow = days[dow];
      let dir;
      switch(listing.street_pre_direction){
        case 'Northwest':
        dir = 'NW';
        break;
        case 'Southwest':
        dir = 'SW';
        break;
        case 'Souteast':
        dir = 'SE';
        break;
        case 'Northeast':
        dir = 'NE';
        break;
        default:
        dir = '';
      };
      console.log('direction: ',dir);
      console.log('open house is on: ',dow);
      let style = {
        backgroundImage:'url('+listing.image_urls.all_thumb[0]+')',
        backgroundPosition:'center',
        backgroundSize:'cover',
        overlap:'hidden'
      };
      return(
        <div id={listing.mls_number} onClick={this.viewListing.bind(this)} className="featured-item col-sm-4">
          <div id={listing.mls_number} className="pic-holder" style={style}>
            <div id={listing.mls_number} className="listing-info-opacity">
            </div>
            <div id={listing.mls_number} className="listing-info">
              {listing.street_number} {listing.street_name} {listing.street_post_dir} {dir}<br/>
              {price} {new_date}
            </div>
          </div>
        </div>
      );
    });
    this.setState({
      featured,
      results:results
    })
  }
  viewListing(e){
    let listing = e.target.id;
    console.log('listingid: ',listing);
    let day = (this.props.day) ? this.props.day : 'none';
    let neighborhood = (this.props.neighborhood) ? this.props.neighborhood : 'none';
    neighborhood = neighborhood.toLowerCase();
    hashHistory.push('/listing/'+listing+'/'+day+'/'+neighborhood);

  }
  featuredReturn(){
    this.props.setLastPlace(this.props.last_place);
  }
  render(){
    let featured = this.state.featured;
    return(
      <div className="featured">
        <div className="featured-title row">FEATURED</div>
        <div className="featured-results row">
          { featured }

        </div>
      </div>
    );
  }
}

export default Featured;
