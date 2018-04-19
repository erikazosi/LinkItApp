import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import * as firebase from 'firebase/app'
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../model/user/user.service';
import {User} from '../../model/user/user.model';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {AngularFireStorage} from 'angularfire2/storage';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  title = 'app';
  selectedFiles: FileList;
  file: File;
  imgsrc;
  color: string = 'primary';
  mode: 'determinate';
  progressBarValue;
  selectedFile = null;
  fileUploaded: Boolean = false;
  modalRef: BsModalRef;
  user: User = new User();
  name: String;
  location: String;
  phone: String;
  email: String;
  photoUrl: String;
  id: String;
  uid: String;
  rating: String;
  proKey: String;
  currentUser = firebase.auth().currentUser;
  sub: any;
  comment: String;
  isLoggedIn: Boolean;
  message: String = '';
  items: any;
  check: any;
  description: any;
  msgTitle: String;
  allComments = [];
  loginStatus: String;
  loadSpinner: boolean = true;
  appointmentDate: Date;
  appointmentTime: any;
  note: any;
  'additionalFile': '';
  contactWay: String;
  single: any[];
  showAllRating: Boolean = false;
  view: any[] = [200, 150];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';
  xScaleMax = 100;
  barPadding = 3;
  address: any;
  rated: Boolean = false;
  colorScheme = {
    domain: ['#d5aa4f']
  };
  lati: number;
  longi: number;
  place: any;
  map: google.maps.Map;
  averageRating: number;

  public zoom: number;

  constructor(private route: ActivatedRoute, public router: Router,
              private modalService: BsModalService,
              private userSvc: UserService, private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService,
              private afStorage: AngularFireStorage) {

    this.loginStatus = this.storage.get('isLoggedIn');
    if (this.loginStatus == 'true') {
      this.isLoggedIn = true
    }


  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
    this.zoom = 8;

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getAllRatings(this.id);


    })
    this.fetchUserDataByKey(this.id);

    this.getAllComments(this.id);

    // this.getAverageRating(this.id);
  }

  fetchUserDataByKey(key) {
    var ref = this.userSvc.fetchUserDataByKey(key);
    ref.on('child_added', (function (snap) {
        var data = snap.val();
        if (key == snap.key) {
          this.user.firstName = data.firstName;
          this.user.lastName = data.lastName;
          this.lati = data.city.lati;
          this.longi = data.city.longi;
          this.address = data.city.fullAddress;

          this.user.photoUrl = data.photoUrl;
          this.user.phone = data.phone;
          this.proKey = snap.key;
          this.uid = data.uid;
          this.description = data.description
        }
        this.getRatingOfCurrentUser();

      }
    ).bind(this));
  }

  openModal(template: TemplateRef<any>) {
    if (this.currentUser) {
      this.modalRef = this.modalService.show(template);

    } else this.router.navigate(['login']);
  }

  closeModal() {
    this.modalRef.hide()
  }

  contactPro() {
    firebase.database().ref('/messages').limitToLast(5);
    const messageList = this.db.list('/messages');
    messageList.push({
      'title': this.msgTitle,
      'message': this.message,
      'sender': this.currentUser.uid,
      'receiver': this.proKey,
      'time': Date.now(),
      'status': 'unread'

    }).then(res => {
        this.closeModal();

      }
    );
  }


  startProject(template: TemplateRef<any>) {
    if (this.currentUser) {
      this.modalRef = this.modalService.show(template);

    } else this.router.navigate(['login']);
  }

  makeComment() {

    const makeComment = this.db.list('/comments');
    var commenterName: String;
    var currentUser = firebase.auth().currentUser.uid;

    makeComment.push({
      'comment': this.comment,
      'commentBy': currentUser,
      'commentFor': this.id,
      'date': Date.now()


    });

    this.comment = '';
    // location.reload();
  }

  getRatingOfCurrentUser() {
    var currentUser = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('rating/');
    ref.orderByChild('ratedBy').equalTo(currentUser).on('child_added', (function (res) {
      this.rating = res.val().rate;

    }).bind(this))
  }

  makeRating() {
    //https://github.com/MurhafSousli/ngx-bar-rating
    var currentUser = firebase.auth().currentUser.uid;

    var ref = firebase.database().ref('/rating');
    ref.orderByChild('ratedBy').equalTo(currentUser).on('child_added', (function (res) {
      if (res.exists()) {
        ref.child(res.key).update({
          'rate': this.rating
        })

      }
      this.rated = true;

    }).bind(this))
    if (!this.rated) {
      const rate = this.db.list('/rating');
      rate.push({
        'rate': this.rating,
        'ratedBy': currentUser,
        'rateFor': this.id,
        'date': Date.now()
      });
    }


  }

  getAllComments(id) {
    var fullName: any;
    var photoUrl: any;
    var ref = firebase.database().ref('comments').orderByChild('commentFor').equalTo(id);
    ref.on('child_added', (function (snap) {
      this.userSvc.getCurrentUserInfo(snap.val().commentBy).on('child_added', (function (snap) {
        fullName = snap.val().firstName + ' ' + snap.val().lastName;
        photoUrl = snap.val().photoUrl;
      }));

      this.allComments.push({fullName: fullName, photoUrl: photoUrl, ...snap.val()});
      if (snap.exists()) {
        this.loadSpinner = false;

      }

    }).bind(this));
    this.loadSpinner = false;


  }

  confirmAppointment() {

    var currentUser = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('user/' + this.id);
    var uid;
    var downloadUrl;
    if (this.fileUploaded) {
      var filename = this.selectedFile.name;
      var storage = firebase.storage().ref('/userFiles/' + filename);
      var uploadFile = storage.put(this.selectedFile);
      uploadFile.on('state_changed', function (snapshot) {

      }, function (error) {

      }, (function () {
        downloadUrl = uploadFile.snapshot.downloadURL;
        ref.on('value', (function (snap) {

          uid = snap.val().uid;
          console.log(uid);
          firebase.database().ref('projects/').push({
            'appointmentFor': uid,
            'appointmentBy': currentUser,
            'createdDate': Date.now(),
            'appointmentDate': this.appointmentDate,
            'note': this.note,
            'contactWay': this.contactWay,
            'additionalFile': downloadUrl,
            'notificationStatus': 'new',
            'status': 'pending'

          }).then((ref) => {
            this.closeModal()
          });
        }).bind(this));
        console.log(downloadUrl);
      }).bind(this));
    }
    else {
      ref.on('value', (function (snap) {

        uid = snap.val().uid;
        console.log(uid);
        firebase.database().ref('projects/').push({
          'appointmentFor': uid,
          'appointmentBy': currentUser,
          'createdDate': Date.now(),
          'appointmentDate': this.appointmentDate,
          'note': this.note,
          'contactWay': this.contactWay,
          'additionalFile': '',
          'notificationStatus': 'new',
          'status': 'pending'

        }).then((ref) => {
          this.closeModal()
        });
      }).bind(this));

    }


  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    this.fileUploaded = true;
  }

  // getAverageRating(id) {
  //   var rates = 0;
  //
  //   var ref = firebase.database().ref('rating').orderByChild('rateFor').equalTo(id).on('child_added', (function (res) {
  //     this.allRatings.push(res.val().rate);
  //     res.forEach(function (snapShot) {
  //       rates += snapShot.val().rate;
  //     })
  //     this.averageRating = rates / this.allRatings.length;
  //
  //   }).bind(this))
  //
  // }


//
// private getBusinessTime() {
//   firebase.database().ref('schedule/').orderByValue().once('child_added', (function (res) {
//
//     if (res != null) {
//       if (res.key == this.uid) {
//         this.scheduleTime.push(res.val());
//       }
//     }
//
//
//   }).bind(this));
//
// }
  private getAllRatings(id) {
    var oneStar = 0;
    var twoStar = 0;
    var threeStar = 0;
    var fourStar = 0;
    var fiveStar = 0;
    var ref = firebase.database().ref('rating').orderByChild('rateFor').equalTo(id).on('value', (function (res) {
      res.forEach(function (snapShot) {
        if (snapShot.val().rate == 1) {
          oneStar++;
        } else if (snapShot.val().rate == 2) {
          twoStar++;
        } else if (snapShot.val().rate == 3) {
          threeStar++;
        } else if (snapShot.val().rate == 4) {
          fourStar++;
        } else if (snapShot.val().rate == 5) {
          fiveStar++;
        }
      })
      this.single = [
        {
          'name': '5 Star',
          'value': fiveStar
        },
        {
          'name': '4 Star',
          'value': fourStar
        },
        {
          'name': '3 Star',
          'value': threeStar
        },
        {
          'name': '2 Star',
          'value': twoStar
        },
        {
          'name': '1 Star',
          'value': oneStar
        }
      ];
      this.averageRating = (oneStar + twoStar + threeStar + fourStar + fiveStar) / 5;
    }).bind(this))
  }


}
