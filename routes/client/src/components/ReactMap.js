import React, {Component} from "react";
import currency from 'currency-formatter';
import moment from 'moment';
import jquery from 'jquery';
import newN from './Neighborhoods';
import GoogleMap from "react-google-map"
import GoogleMapLoader from "react-google-maps-loader"
// let markers = this.props.markers;
const google = window.google;
let Neighborhoods = new newN;

// console.log('West End: ',Neighborhoods.adamsmorgan);

const MY_API_KEY = "82b44a7662b0abb55eebf365a61c50399b512935" // fake
let style={
  height:'60vh',
  width:'100%'
};
class FullMap extends Component{
  constructor(props){
    super(props);
    this.state={
      neighborhood:''
    }
  }
  viewListing(){
    console.log('viewing');
  }
  render(){
    let neighb = this.props.neighborhood;
    console.log('neigh: ',neighb);
    console.log('West End: ',Neighborhoods[neighb]);
    let neighborhood_polygon = Neighborhoods[neighb];
    let map_center = (neighb) ? (Neighborhoods[neighb][0]) : {lat:0,lng:0};
    console.log('map center: ',Neighborhoods[neighb]);
    console.log('neighborhood params: ',this.props.neighborhood);
    return(
      // GoogleMap component has a 100% height style.
      // You have to set the DOM parent height.
      // So you can perfectly handle responsive with differents heights.
      <div style={style}>
        <GoogleMap
          googleMaps={this.props.googleMaps}

          center={
            map_center
          }
          zoom={13}

          //HANDLE ALL GOOGLE MAPS INFO HERE:

          onLoaded={(googleMaps, map) => {
            // map.setMapTypeId(googleMaps.MapTypeId.STREET)
            var marker = new google.maps.Marker({
              position: {lat: 39.00702, lng: -77.13851},
              title:"Hello World!"
            });
            let viewListing = this.props.viewListing;

            //FILTER BY NEIGHBORHOOD:
            var neighborhoodPolygon = new google.maps.Polygon({
              paths: neighborhood_polygon,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35
            });
            neighborhoodPolygon.setMap(map);

            var bounds = new google.maps.LatLngBounds();
            let num_markers = 0;
            this.props.markers.forEach((val)=>{
              let price = currency.format(val.list_price,{ code: 'USD', decimalDigits: 0 });
              price = price.slice(0,price.length-3);
              //get day of the week:
              let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
              let date = (val.open_house_events) ? moment(val.open_house_events[0].event_start) : '';
              let dow = (date) ? date.day() : '';
              let time = (date) ? date.format('h:mmA') : '';
              let dowUC = (date) ? days[dow] : '';
              dow = (date) ? days[dow] : '';
              dow = (date) ? dow.toLowerCase() : '';
              let lat = parseFloat(val.latitude);
              let lng = parseFloat(val.longitude);
              let marker = new google.maps.Marker(
                {
                  title:val.street_name,
                  position: {
                    lat: parseFloat(val.latitude),
                    lng: parseFloat(val.longitude),
                  },
                }
              );


              marker.setAnimation(googleMaps.Animation.DROP);
              let position = new google.maps.LatLng(lat,lng);
              // console.log('gmap position: ',position);
              if(google.maps.geometry.poly.containsLocation(position, neighborhoodPolygon)){
                //place marker
                console.log('plotting marker!');
                marker.setMap(map);
                let boundary = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                bounds.extend(boundary);
                num_markers++;
              }else{
                //ignore marker
                console.log('not plotting marker');
                //setting grey colored marker:
                let greymarker = require('../images/map-marker-hi.png');
                var image = {
                  url: greymarker,
                  // This marker is 20 pixels wide by 32 pixels high.
                  size: new google.maps.Size(20, 32)
                };
                marker.setMap(map);
                let boundary = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                bounds.extend(boundary);
                num_markers++;
              }
            //CREATE PROPERTY INFOWINDOW
            // let mls = val.mls_number.toString();
            // console.log('listing id: ',val.id);
            let mls = val.id.toString();
            var contentString = (
              '<div id='+mls+' class="listing-popup" style='+
                'backgroundImage:url('+val.image_urls.all_thumb[1]+')'+
                '>'+
                '<div class="listing-popup-opacity"></div>'+
                '<div class="listing-popup-text">'+
                 val.street_number + ' ' + val.street_name + ' ('+dowUC+')<br/>'+
                 price +' <br/>'+
                '</div>'+
              '</div>'
            );

            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            marker.addListener('click', function() {
              infowindow.open(map, marker);
              let index = '#'+mls;
              let style = 'url('+val.image_urls.all_thumb[0]+')'
              jquery(index).css('background-image',style);
            });
            google.maps.event.addListener(infowindow, 'domready', function() {
              let index = '#'+mls;
              jquery(index).on("click", function() {
                viewListing(mls);
              });
            });
            if(num_markers>=0){
              map.fitBounds(bounds);
              // map.panToBounds(bounds);
              var listener = google.maps.event.addListener(map, "idle", function() {
                if (map.getZoom() > 16) map.setZoom(16);
                google.maps.event.removeListener(listener);
              });
            }
          });
          }}

        />
      </div>
    )
  }
}
// const Map = ({markers, googleMaps}) => (
//   // GoogleMap component has a 100% height style.
//   // You have to set the DOM parent height.
//   // So you can perfectly handle responsive with differents heights.
//   <div style={style}>
//     <GoogleMap
//       googleMaps={googleMaps}
//       // You can add and remove coordinates on the fly.
//       // The map will rerender new markers and remove the old ones.
//       coordinates={[
//         {
//           title: "Washington DC",
//           position: {
//             lat: 38.904373, lng: -77.053513
//           },
//           onLoaded: (googleMaps, map, markers) => {
//             // Set Marker animation
//             markers.setAnimation(googleMaps.Animation.BOUNCE)
//
//             // Define Marker InfoWindow
//             const infoWindow = new googleMaps.InfoWindow({
//               content: `
//                 <div>
//                   <h3>Toulouse<h3>
//                   <div>
//                     Toulouse is the capital city of the southwestern
//                     French department of Haute-Garonne,
//                     as well as of the Occitanie region.
//                   </div>
//                 </div>
//               `,
//             })
//
//             // Open InfoWindow when Marker will be clicked
//             // googleMaps.event.addListener(marker, "click", () => {
//             //   infoWindow.open(map, marker)
//             // })
//             //
//             // // Change icon when Marker will be hovered
//             // googleMaps.event.addListener(marker, "mouseover", () => {
//             //   marker.setIcon(iconMarkerHover)
//             // })
//             //
//             // googleMaps.event.addListener(marker, "mouseout", () => {
//             //   marker.setIcon(iconMarker)
//             // })
//
//             // Open InfoWindow directly
//             // infoWindow.open(map, marker)
//           },
//         }
//       ]}
//       center={
//         { lat: 38.904373, lng: -77.053513 }
//       }
//       zoom={8}
//       onLoaded={(googleMaps, map) => {
//         map.setMapTypeId(googleMaps.MapTypeId.SATELLITE)
//       }}
//     />
//   </div>
// )

// Map.propTypes = {
//   googleMaps: PropTypes.object.isRequired,
// }

export default GoogleMapLoader(FullMap, {
  libraries: ["places"],
  key: MY_API_KEY,
})
