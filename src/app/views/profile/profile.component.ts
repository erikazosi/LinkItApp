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
  email: String
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
  msgTitle: String;
  allComments = [];
  loginStatus: String;
  loadSpinner: boolean = true;
  appointmentDate: Date;
  appointmentTime: any;
  note: any;
  'additionalFile': '';
  contactWay: String;
  scheduleTime: String;

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

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchUserDataByKey(this.id);
      this.getAllComments(this.id);
      this.getBusinessTime();

    })


  }

  fetchUserDataByKey(key) {
    var ref = this.userSvc.fetchUserDataByKey(key);
    ref.on('child_added', (function (snap) {
        var data = snap.val();

        if (key == snap.key) {
          this.user.firstName = data.firstName;
          this.user.lastName = data.lastName;
          this.user.city = data.city;
          this.user.photoUrl = data.photoUrl;
          this.user.phoneNumber = data.phoneNumber;
          this.proKey = snap.key;
          this.uid = data.uid;
        }
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

  makeRating(value) {
    console.log(this.rating);
    const rate = this.db.list('/rating');
    var currentUser = firebase.auth().currentUser.uid;
    rate.push({
      'rate': value,
      'ratedBy': currentUser,
      'rateFor': this.id,
      'date': Date.now()
    });
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
            'appointmentTime': this.appointmentTime,
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
          'appointmentTime': this.appointmentTime,
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

  private getBusinessTime() {
    firebase.database().ref('schedule/').orderByValue().once('child_added', (function (res) {

      if (res != null) {
        if (res.key == this.uid) {
          this.scheduleTime.push(res.val());
        }
      }


    }).bind(this));

  }
}
