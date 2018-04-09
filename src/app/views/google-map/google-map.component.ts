import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {} from '@types/googlemaps';
import {MapsAPILoader} from '@agm/core';
import {FormControl} from '@angular/forms';
import GeocoderRequest = google.maps.GeocoderRequest;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  lati: number;
  longi: number;
  place: any;
  map: google.maps.Map;

  public zoom: number;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    this.zoom = 4;
    this.lati = 0;
    this.longi= 0;

    //set current position


    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: this.place}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        this.map.setCenter(results[0].geometry.location);

        this.map.setZoom(17);
      }
    })
  }

  // private setCurrentPosition() {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.lati = position.coords.latitude;
  //       this.longi = position.coords.longitude;
  //       this.zoom = 12;
  //     });
  //   }
  // }
  }



  // private getUserLocation() {
  //
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(pos => {
  //       this.lati = pos.coords.lati;
  //       this.longi = pos.coords.longi;
  //
  //       console.log(this.lati);
  //       console.log(this.longi);
  //     })
  //   }
  // }
  //
  // geocodeAddress() {
  //   var geocoder = new google.maps.LatLng(18.5793, 73.8143)
  //   var address = this.place;
  //   geocoder.geocode({'address': address}, function (results, status) {
  //     if (status === 'OK') {
  //       var marker = new google.maps.Marker({
  //         position: results[0].geometry.location
  //       });
  //     } else {
  //       alert('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // }
  //
  // private getAddressName(place) {
  //   this.geocoder = new google.maps.Geocoder();
  //   this.geocoder.getLatLng(place, function (point) {
  //     if (!point) {
  //       alert(place + ' not found');
  //     } else {
  //       var info = '' + place + 'Latitude: ' + point.y + '  Longitude:' + point.x;
  //       var marker = new google.maps.Marker(point);
  //       this.map.addOverlay(marker);
  //       marker.openInfoWindowHtml(info);
  //     }
  //   });
  // }

