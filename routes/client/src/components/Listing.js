import React, { Component } from 'react';
import ListingMap from './ListingMap';
import axios from 'axios';
import GoogleMap from "react-google-map";
import GoogleMapLoader from "react-google-maps-loader";
import currency from 'currency-formatter';
import jquery from 'jquery';
const google = window.google;

class Listing extends Component{
  constructor(props){
    super(props);
    this.state={
      listing:'',
      showing:'',
      thumb_photos:[],
      big_photos:[],
      showing_index:0
    }
  }
  componentWillMount(){
    // axios.get('https://localhost:8080/info/open_houses').then(
    //   (response)=>{
        console.log('axios: ',this.props.listing);
        let listing = this.props.listing
        let showing = (listing) ? listing.image_urls.all_big[0] : '';
        let showing_index = 0;
        let style = {
          backgroundImage:'url('+showing+')',
          backgroundPosition:'left',
          backgroundSize:'cover',
          overlap:'hidden'
        }

        showing = (
          <div style={style} className="photo-container"></div>
        )
        let index=-1;
        let thumb_photos = (listing) ? listing.image_urls.all_thumb.map((pic)=>{
          // console.log('thumb pic: ',pic);
          let style = {
            backgroundImage:'url('+pic+')',
            backgroundPosition:'center',
            backgroundSize:'cover',
            overlap:'hidden',
            borderRight:'4px solid #000'
          }
          index++;
          return(
            <div onClick={this.showPic.bind(this)} id={index} style={style} className="thumb-photo-container">

            </div>
          );
        }) : '';
        let big_photos = (listing) ? listing.image_urls.all_big : '';

        this.setState({
          showing,
          showing_index,
          thumb_photos,
          big_photos,
          listing
        });
      // }).catch((err)=>{
      //   console.log('error -',err);
      // });
    }
  componentDidMount(){
    let id2='#'+this.state.showing_index;
    jquery(id2).addClass('thumb-viewing');
  }
  goRight(e){
    e.preventDefault();
    let index = this.state.showing_index;
    let newIndex=index;
    console.log('now on: ',newIndex);
    if(index!==this.state.thumb_photos.length-1){
      newIndex = this.state.showing_index+1;
      console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#'+(newIndex-1);
      jquery(id).addClass('thumb-viewing');
      jquery(id2).removeClass('thumb-viewing');
    }
    // let width=jquery('#1').width();
    // let scroll_width=(index+2)*width;
    // console.log('width: ',scroll_width);
    // let container_width=jquery('.scroller').width();
    // console.log('container: ',container_width);
    // if(scroll_width>container_width){
    //   let left = (-(scroll_width-container_width));
    //   console.log('past bounds! adjusting: ');
    //   jquery('.photo-carousel-interior').css('left',left);
    // }
    this.setState({
      showing_index:newIndex
    });
  }
  goLeft(e){
    e.preventDefault();
    let index = this.state.showing_index;
    let newIndex=index;
    console.log('now on: ',newIndex);
    if(index!==0){
      newIndex = this.state.showing_index-1;
      console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#'+(newIndex+1);
      jquery(id).addClass('thumb-viewing');
      jquery(id2).removeClass('thumb-viewing');
    }
    this.setState({
      showing_index:newIndex
    });
  }
  showPic(e){
    e.preventDefault();
    console.log("showing: ",e.target.id);
    let newIndex = e.target.id
    let id='#'+newIndex;
    let id2='#'+this.state.showing_index;
    jquery(id).addClass('thumb-viewing');
    jquery(id2).removeClass('thumb-viewing');

    this.setState({
      showing_index:parseInt(e.target.id)
    });
  }
  submitForm(e){
    e.preventDefault();
    let first = this.refs.first_name.value;
    let last = this.refs.last_name.value;
    let email = this.refs.email.value;
    let phone = this.refs.phone.value;
    let textarea = this.refs.textarea.value;
    console.log('submitting: ',first,last,email,textarea);
    //FILTER FOR SCRIPTING ATTACKS:
    //CODE HERE
    if(this.refs.hidden.val !==undefined){
      console.log('bot');
      return;
    }
    let data = {
      first,
      last,
      email,
      phone,
      textarea
    }
    axios.post('https://localhost:8080/info/submitform',data).then((response)=>{
      console.log('successfully submitted',response);
    }).catch((err)=>{
      console.log('err - ',err);
    });
  }
  navigateBack(){
    this.props.goBack();
  }
  render(){
    let showing=this.state.showing;
    let listing=this.state.listing;
    console.log('listing to display: ',listing);
    let subdivision=(listing) ? listing.subdivision : '';
    let price = (listing) ? listing.list_price : '';
    subdivision=subdivision.toLowerCase();
    subdivision = subdivision.replace(/\b\w/g, l => l.toUpperCase());
    let showing_index = this.state.showing_index;
    let thumb_photos=this.state.thumb_photos;
    let big_photos=this.state.big_photos;

    let style = {
      backgroundImage:'url('+big_photos[showing_index]+')',
      backgroundPosition:'left',
      backgroundSize:'cover',
      overlap:'hidden'
    }

    showing = (
      <div style={style} className="photo-container"></div>
    )
    let comments = (listing) ? listing.open_house_events[0].open_house_comments : '';
    let listing_bedrooms = (listing) ? listing.num_bedrooms : '';
    //LISTING SPECS:
    let bed_img = (listing) ? (
      <div className="listing-beds">
        <div>{listing_bedrooms}</div>
        <img className="listing-emoji" src={require('../images/bed.svg')} alt="bed" />
      </div>
    ) : '';
    let bath_img = (listing) ? (
      <div className="listing-baths">
        <div>{listing.full_baths}/{listing.half_baths}</div>
        <img className="listing-emoji" src={require('../images/bath.svg')} alt="bath" />
      </div>
    ) : '';
    // let beds = ();
    // let baths = ();
    let sq_ft = (listing) ? (<span className="sqFt">{listing.square_feet}&nbsp;sq ft</span>): '';
    price = (listing) ? currency.format(listing.list_price,{ code: 'USD', decimalDigits: 0 }): '';
    price = (listing) ? price.slice(0,price.length-3): '';
    price = (listing) ? (<span className="listing-price-emoji">{price}</span>) : '';
    let stories = (listing) ? (<div>{listing.stories}&nbsp;story</div>) : '';
    let built = (listing) ? ( <div>Built:&nbsp;{listing.year_built}</div> ): '';
    let subd = ( <div>Subdivision:&nbsp;{ subdivision }</div> );
    let dom = (listing) ? ( <div>{listing.cdom}&nbsp;days on the market</div> ): '';

    let st_address = (listing) ? (<div>{listing.street_number}&nbsp;{listing.street_name}</div>) : '';
    let st_address_string = (listing) ? listing.street_number+listing.street_name : '';
    let lng = (listing) ? parseFloat(listing.longitude) : '';
    let lat = (listing) ? parseFloat(listing.latitude) : '';
    let floor_type = (listing) ? listing.floor : '';
    let flooring = (floor_type !=='') ? (<div>Flooring:&nbsp;{ floor_type }</div>) : '';
    let marker = {
      title:'listing',
      position: {lat: lat, lng: lng}
    };
    let center = {lat:lat,lng:lng};
    let map = (listing) ? (
      <ListingMap center={center} listing_marker={marker}/>
    ) : '';
    let mls = (listing) ? (
      <div>MLS #:&nbsp;{(listing) ? listing.mls_number : ''}</div>
    ) : '';
    let parking = (listing) ? (<div>Parking spaces:&nbsp;{(listing) ? listing.parking_spaces || listing.garage_spaces : ''}</div>) : '';
    return(
      <div className="wrapper listing-page">
        <div className="listing-header row">
          <div className="listing-address">
            { st_address }
            <div>{(listing) ? listing.city : ''},&nbsp;{(listing) ? listing.state : ''}&nbsp;{(listing) ? listing.zip : ''}</div>
          </div>
          <div className="listing-header-specs">
            { price }  { bed_img }  { bath_img }  {sq_ft}
          </div>
          <div onClick={this.navigateBack.bind(this)} className="back-button">
            Back
          </div>
        </div>
        <div className="listing-section">
          <div className="row">
            <div className="listing-column col-sm-6">
              <div className="photos-map-column">
                <div className="listing-photos">
                  <div className="photo-viewer">
                    {/* <img src={this.state.showing} alt="listing photo" /> */}
                    {showing}
                    <div onClick={this.goLeft.bind(this)}className="arrow arrow-left fa fa-arrow-left"></div>
                    <div onClick={this.goRight.bind(this)}className="arrow arrow-right fa fa-arrow-right"></div>
                  </div>
                  <div className="scroller">
                    <div className="photo-carousel">
                      <div className="photo-carousel-interior">
                        {thumb_photos}
                      </div>
                    </div>
                  </div>

                </div>
                <div className="listing-description">
                  <div className="listing-comments">{ comments }</div>
                  <div className="office">Listing courtesy of:&nbsp;{(listing) ? listing.listing_office_name : ''}</div>
                </div>
                <div className="listing-map">{map}</div>
              </div>
            </div>
            <div className="listing-column col-sm-6">
              <div className="specs-form-column">
                <div className="listing-specs">


                  <div className="specs-2">
                    <div className="specs-text">{ subd }</div>
                    <div className="specs-text">{ flooring }</div>
                    <div className="specs-text">{ dom }</div>
                    <div className="specs-text">{ mls }</div>
                  </div>
                  <div className="specs-1">
                    <div className="specs-text">{ stories }</div>
                    <div className="specs-text">{ (listing) ? listing.property_type : '' }&nbsp;{ (listing) ? listing.property_sub_type : '' }</div>
                    <div className="specs-text">{ built }</div>
                    <div className="specs-text">{parking}</div>
                  </div>
                </div>
                <div className="listing-form-column">
                  <div className="listing-form">
                    <div className="listing-form-header">
                      Ask a Question
                      <div className="listing-form-header-quote">"We'll respond quickly!"</div>
                    </div>
                    <form onSubmit={this.submitForm.bind(this)}>
                      <div className="form-column">
                        <input ref="first_name" placeholder="First Name"/>
                        <input ref="last_name" placeholder="Last Name"/>
                      </div>
                      <div className="form-column">
                        <input ref="email" placeholder="E-mail"/>
                        <input ref="phone" placeholder="Phone"/>
                      </div>
                      <textarea ref="textarea" placeholder = "What can we do for you?"/>
                      <input ref="hidden" className="hidden" />
                      <input type="submit" value="Submit"/>
                    </form>
                  </div>
                  <div className="listing-agent-photo">
                    <img src={require('../images/Justin_Levitch.jpg')} className="image-responsive" alt="Agent Image" />
                    <h3>Justin Levitch</h3>
                    <div>Real Estate Professional</div>
                    <div>4600 North Park Avenue, Suite 100</div>
                    <div>Chevy Chase, MD 20815</div>
                    <div>Phone: 301-652-0643</div>
                    <div>Email: <a href="info@rlahre.com" alt='email'>info@rlahre.com</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Listing;
