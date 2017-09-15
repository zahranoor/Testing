import React, { Component } from 'react';
// import Map from './Map';
import jquery from 'jquery';
import axios from 'axios';
import currency from 'currency-formatter';
import moment from 'moment';
// import _ from "lodash";
import ReactMap from './ReactMap';



class Results extends Component{
  constructor(props){
    super(props);
    this.state={
      results:'',
      display:'loading',
      selected_listings:'',
      dropdown:false,
      selected:'SORT BY TIME',
      popup:false,
      sorting_spec:'time',
      sort_order:'',
      markers: ''
    }
  }
  componentWillMount(){
    let results;
    let markers=[];
    let params = this.props.params;
    console.log('params: ',params);
    let stored_results = this.props.stored_results;
    let i = (stored_results) ? true: false;
    console.log('app has stored results: ',i, ', ',stored_results, ', and raw results: ',this.state.results);
    if(stored_results==false){
      axios.get('https://localhost:8080/info/open_houses').then(
      (response)=>{
        console.log('axios: ',response);
        response.data.results.forEach((listing)=>{
          markers.push(listing);
        });
        this.props.storeResults(markers,results);
        this.setState({
          results,
          markers,
          display:'map'
        });
      }).catch((err)=>{
        console.log('error -',err);
      });
}else{
  console.log('setting previous markers');
  this.setState({
    results:this.props.raw_stored_results,
    markers:stored_results,
    display:'list'
  });
  setTimeout(()=>{jquery('.list-view').addClass('list-btn-pressed');},50);
}
}
  componentDidUpdate(){
    if(this.state.display === 'map'){
      jquery('.map-view').addClass('map-btn-pressed');
    }
    if(this.state.display ==='list'){
      jquery('.list-view').addClass('list-btn-pressed');
    }
  }
  arrowToggle(e){
    this.pressed_toggle(e);
  }
  removeClass(){
    // jquery('.btn-3d').removeClass('btn-pressed');
    jquery('.btn-3d').removeClass('list-btn-pressed');
    jquery('.btn-3d').removeClass('map-btn-pressed');
    // jquery('.btn-3d').removeClass('down-btn-pressed');
  }
  pressed_toggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('a');
    if($item.hasClass('btn-pressed')){
      $item.removeClass('btn-pressed');
    }else{
      // this.removeClass();
      $item.addClass('btn-pressed');
    }
  }
  listToggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('a');
    if($item.hasClass('list-btn-pressed')){
      $item.removeClass('list-btn-pressed');
    }else{
      this.removeClass();
      $item.addClass('list-btn-pressed');
    }
    this.setState({
      display:'list'
    });
  }
  mapBtnToggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('a');
    if($item.hasClass('map-btn-pressed')){
      $item.removeClass('map-btn-pressed');
    }else{
      this.removeClass();
      $item.addClass('map-btn-pressed');
    }
    this.setState({
      display:'map'
    });
  }
  downBtnToggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('a');
    if($item.hasClass('down-btn-pressed')){
      $item.removeClass('down-btn-pressed');
    }else{
      // this.removeClass();
      $item.addClass('down-btn-pressed');
    }
    this.setState({
      dropdown: !this.state.dropdown
    });
  }
  highlight(e){
    let item = e.target;
    let index = '#'+e.target.id;
    jquery(index).addClass('highlighted');
  }
  highlight_off(e){
    let item = e.target;
    let index = '#'+e.target.id;
    jquery(index).removeClass('highlighted');
  }
  viewTabListing(e){
    e.preventDefault();
    let id = e.target.id;
    console.log('tab listing: ',id);
    if(id=='pause'){
      let new_id=e.target.parentElement.id;
      console.log('tab listing: ',new_id);
      return;
    }
    this.viewListing(id);
  }
  viewListing(listing){
    let view = this.state.markers.filter((val)=>{
      // console.log('marker: ',val.id, 'listing: ',listing);
      let list = parseInt(listing);
      return val.id == list;
    });
    console.log('viewing the listing: ',view);
    this.props.viewListing(view);
  }
  select(e){
    e.preventDefault();
    let item = e.target;
    console.log('selecting');
  }
  selectAll(e){
  }
  sortTime(e){
    let $item = jquery('#down');
    $item.removeClass('down-btn-pressed');
    this.setState({
      dropdown: false
    });
    let order = this.state.sort_order;
    console.log('sorting by time: ',order,' ',this.state.markers);
    let listings = this.state.markers;
    let sortObjects = [];
    let sortedObjects = [];
    let results = [];
    listings.forEach((listing)=>{
      let result = {
        id:listing.id,
        time:listing.open_house_events[0].event_start
      }
      sortObjects.push(result);
    });
    console.log('sort objects: ',sortObjects);
    //////////////
    // var times = document.getElementsByClassName("test-moment");

    var unsorted_times = new Array();
    console.log("Converting");
    for(var i = 0; i < sortObjects.length; i++) {
      var moment_date = moment(sortObjects[i].time);
      var unsorted_time = new Object();
      unsorted_time.time = sortObjects[i].time;
      unsorted_time.id = sortObjects[i].id;
      unsorted_time.milli = moment_date.valueOf();
      unsorted_times.push(unsorted_time);
    }

    // Sort the times:
    unsorted_times.sort(compareMilli);
    console.log('sorted times: ',unsorted_times);
    unsorted_times.forEach((time)=>{
      sortObjects.forEach((val)=>{
        if(val.id===time.id){
          sortedObjects.push(time);
        }
      });
    });
    console.log('sorted objects: ',sortedObjects);
    sortedObjects.forEach((time)=>{
      listings.forEach((val)=>{
        if(val.id===time.id){
          results.push(val);
        }
      });
    });
    if(this.state.sort_order==='ascending'){
      results.reverse();
    }
    this.setState({
      markers:results,
      sorting_spec:'time'
    });

    // Compare dates to sort
    function compareMilli(a,b) {
    	if(a.milli < b.milli) return -1;
    	if(a.milli > b.milli) return 1;
    	return 0;
    }
    ///////////////
  }
  sortPrice(e){
    e.preventDefault();
    let $item = jquery('.results-option');

    $item.removeClass('down-btn-pressed');
    jquery('.list-view').addClass('list-btn-pressed');
    this.setState({
      dropdown: false,
      display:'loading'
    });

    let id = e.target.id;
    console.log('searching price: ',id);
    axios.get('https://localhost:8080/info/price/'+id).then((res)=>{
      console.log('priced results: ',res);
      this.setState({
        markers:res.data.results,
        display:'list',
        sorting_spec:'price',
        loading:'false'
      });
    }).catch((err)=>{
      console.log('err - ',err);
    });
    if(this.state.markers){
      this.orderByPrice();
    }
  }
  orderByPrice(){
    let $item = jquery('#down');
    $item.removeClass('down-btn-pressed');
    jquery('.map-view').removeClass('map-btn-pressed');
    this.setState({
      dropdown: false,
      sorting_spec:'price'
    });
    let listings = this.state.markers;
    listings.sort((a,b)=>{
      return a.list_price - b.list_price
    })
    listings.forEach((val)=>{
      console.log(val.list_price);
    });
    console.log('price results: ',listings);
    if(this.state.sort_order=="ascending"){
      listings.reverse();
    }
    this.setState({
      markers:listings
    });
  }
  sortAsc(e){
    if(this.state.display==='list'){
      if(this.state.sort_order==='descending' || this.state.sort_order==''){
        this.setState({
          sort_order:'ascending'
        });
        if(this.state.sorting_spec === 'time'){
          this.sortTime();
        }
        if(this.state.sorting_spec === 'price'){
          this.orderByPrice();
        }
      }
    }
  }
  sortDesc(e){
    if(this.state.display==='list'){
      if(this.state.sort_order==='ascending' || this.state.sort_order==''){
        this.setState({
          sort_order:'descending'
        });
        if(this.state.sorting_spec === 'time'){
          this.sortTime();
        }
        if(this.state.sorting_spec === 'price'){
          this.orderByPrice();
        }
      }
    }
  }

  render(){
    let results = this.state.markers;
    let selected = this.state.selected;
    let sort = this.state.sorting_spec;
    console.log('sort order: ',this.state.sort_order);


//===================LOADING MAIN LISTING INFORMATION, TAKING IN PREVIOUSLY LOADED INFO=============//
    let markers=[];
    let params = this.props.params;
    console.log('params: ',params);
    let stored_results = this.props.stored_results;
    let i = (stored_results) ? true: false;
    console.log('app has stored results: ',i, ', ',stored_results, ', and raw results: ',this.state.results);
    results = (results) ? results.map((listing)=>{
      // console.log('listing in render: ',listing);
      let price = currency.format(listing.list_price,{ code: 'USD', decimalDigits: 0 });
      price = price.slice(0,price.length-3);
      //get day of the week:
      let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      let date = (listing.open_house_events[0]) ? moment(listing.open_house_events[0].event_start) : '';
      let dow = (date) ? date.day() : '';
      let time = (date) ? date.format('h:mmA') : '';
      let dowUC = (date) ? days[dow] : '';
      dow = (date) ? days[dow] : '';
      dow = (date) ? dow.toLowerCase() : '';

      //FILTER NEIGHBORHOOD:

      if(params.neighborhood){
        console.log('filtering by day and neighborhood :',params.day,' vs ',dow,', ','and ',params.neighborhood,' vs ',listing.subdivision);
        if( dow !==params.day || listing.subdivision !==params.neighborhood){
          console.log('no match');
          return;
        }
      }

      //FILTER DAY:

      if(params.day){
        if(dow !==params.day){
          return;
        }
      }

      //map coordinates
      let style1 = {
        backgroundImage:'url('+listing.image_urls.all_thumb[0]+')'
      }

      markers.push(
        listing
      );

      let style = {
        backgroundImage:'url('+listing.image_urls.all_thumb[0]+')',
        backgroundPosition:'center',
        backgroundSize:'cover',
        overlap:'hidden'
      };
      return(
        <div id={listing.id} onClick={this.viewTabListing.bind(this)} className="results-item row">
          <div id={listing.id} style={style} className="results-div col-xs-4 results-item-pic">
            <div id='pause' className="results-item-selector">
            </div>
            {/* <img src="./images/download-2.jpg" alt="listing image" /> */}
          </div>
          <div id={listing.id} className="results-div col-xs-4 results-item-info">
            <div id={listing.id}>
              { listing.street_number } { listing.street_name } ({dowUC})<br/>
              { price } <br/>
            </div>
          </div>
          <div  id={listing.id} className="results-div col-xs-4 results-item-time">
            <div id={listing.id} className="results-item-time-box">
              <div id={listing.id}>{ time }</div>
            </div>
          </div>
        </div>
      );
    }) : '';

///////////////////


    let display;
    let divstyle = {
      left:this.state.x,
      top:this.state.y
    }
    let map = (
      <ReactMap viewListing={this.viewListing.bind(this)} neighborhood={this.props.params.neighborhood} markers={markers}/>
      // <Map markers={this.state.markers} />
    );

    let spinner = (<div className="no-results-msg">Searching for {this.props.params.neighborhood} listings on {this.props.params.day}. Thanks for your patience.<br/><img src={require("../images/loading.gif")} alt="please wait"/></div>);
    results = (results) ? results.filter((val)=>{
      if(val){
        return val;
      }
    }) : '';
    console.log('the results in results render: ',results);
    switch(this.state.display){
      case 'list':
      display=(results.length) ? results : (<div className="no-results-msg">We're sorry - your search for {this.props.params.neighborhood} listings on {this.props.params.day} didn't return any results - try entering another price.</div>);
      break;
      case 'map':
      display=map;
      break;
      case 'loading':
      display=spinner;
      break;
      default:
      display=results;
    }
    let btn_style = 'day-btn btn-3d btn-3d-blue';
    let drop = {
      onMouseEnter:this.highlight.bind(this),
      onMouseLeave:this.highlight_off.bind(this)
    }
    let dropdown = (this.state.dropdown) ? (
      <div>
        <div className="sort-dropdown-list">
        <div className="sort-dropdown-opacity">

        </div>
        </div>
        <div className="sort-text">
          <div id='time' {...drop} onClick={this.sortTime.bind(this)} className="sort-values subdivision">
            SORT BY TIME
          </div>
          <div id='price' {...drop} onClick={this.orderByPrice.bind(this)}  className="sort-values subdivision">
            SORT BY PRICE
          </div>
          <div className="sort-subvalues">
            <div onClick={this.sortPrice.bind(this)} className="subdivision" id='3' {...drop}>- $0-$500,000</div>
            <div onClick={this.sortPrice.bind(this)} className="subdivision" id='4' {...drop}>- $500,000-$1,000,000</div>
            <div onClick={this.sortPrice.bind(this)} className="subdivision" id='5' {...drop}>- $1,000,000-$3,000,000</div>
            <div onClick={this.sortPrice.bind(this)} className="subdivision" id='6' {...drop}>- $3,000,000+</div>
          </div>
        </div>
      </div>
    ): '';
    let spec = this.state.sorting_spec.toUpperCase();
    return(
      <div>
        <div className="results-search-options">

          <a onClick={this.arrowToggle.bind(this)} className="btn-3d results-option select-all btn-3d-blue-results" href="#"><div>SELECT ALL</div></a>
          <a onClick={this.listToggle.bind(this)} className="btn-3d results-option list-view  btn-3d-blue-results" href="#"><div>LIST VIEW</div></a>
          <a onClick={this.mapBtnToggle.bind(this)} className="btn-3d results-option map-view btn-3d-blue-results" href="#"><div>MAP VIEW</div></a>
          <a className="btn-3d results-option sort-by  btn-3d-blue-results" href="#">
            <div>SORT BY {spec}</div>
            { dropdown }
          </a>
          <a id='down' onClick={this.downBtnToggle.bind(this)} className="btn-3d results-option sort-by-arrow  btn-3d-blue-results" href="#"><span className="glyphicon glyphicon-triangle-bottom"></span></a>

        </div>
        <div>
        <div className="up-down-filter">
          <i onClick={this.sortAsc.bind(this)} className="glyphicon glyphicon-triangle-top"></i>
          <i onClick={this.sortDesc.bind(this)} className="glyphicon glyphicon-triangle-bottom"></i>
        </div>
      </div>
    <div className="results">
      { display }

    </div>
      </div>
    );
  }
}

export default Results;
