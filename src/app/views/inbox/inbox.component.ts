import {Component, OnInit, TemplateRef} from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {UserService} from '../../model/user/user.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  userKey: String;
  modalRef: BsModalRef;
  reply: String;
  senderName: String;
  loadSpinner: boolean = true;
  currentUser: any;

  constructor(private db: AngularFireDatabase, private modalService: BsModalService,
              private userSvc: UserService) {
  }

  msgList = [];

  ngOnInit() {
    this.currentUser = firebase.auth().currentUser;
    this.getUserKey(this.currentUser.uid);

  }

  getAllMessages(userKey) {
    firebase.database().ref('messages').orderByChild('receiver').equalTo(userKey).on('child_added', (function (snap) {

      this.msgList.push({_key: snap.key, ...snap.val()});
      // this.getSenderName(snap.val().sender);

      this.loadSpinner = false;

    }).bind(this))
    if (this.msgList.length = 0) {
      this.loadSpinner = false;
    }
  }

  private getUserKey(uid) {
    this.userSvc.getCurrentUserInfo(uid).on('child_added', (function (snap) {

      this.getAllMessages(snap.key);
    }).bind(this));

  }

  private changeReadStatus(msgKey) {
    this.db.list('/messages').update(msgKey, {
      status: 'read'
    });

  }

  openModal(template: TemplateRef<any>,msgKey,sender) {
    this.modalRef = this.modalService.show(template);
    this.changeReadStatus(msgKey);
    this.getSenderName(sender);
  }

  closeModal() {
    this.modalRef.hide()
  }


  getSenderName(uid){
    this.userSvc.getCurrentUserInfo(uid).on('child_added',(function(snap){
      this.senderName = snap.val().firstName +' '+ snap.val().lastName;
    }).bind(this));
  }

  replyMsg(msg){
    this.userSvc.getCurrentUserInfo(msg.sender).on('child_added', (function (snap) {

      const messageList = this.db.list('/messages');
      messageList.push({
        'title': 'Reply to:' +msg.title,
        'message': this.reply,
        'sender': this.currentUser.uid,
        'receiver': snap.key,
        'time': Date.now(),
        'status': 'unread'

      }).then(res => {
          this.closeModal();

        }
      );
      console.log(messageList);
    }).bind(this));


  }
}
