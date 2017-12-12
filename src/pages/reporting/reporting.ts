import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { MainPage } from '../main/main';
import { Camera, Geolocation } from 'ionic-native';
//import { Paho } from 'ng2-mqtt/mqttws31';
import { ReportsService } from '../../providers/reports-service';

declare var cordova: any;

@Component({
  selector: 'page-reporting',
  templateUrl: 'reporting.html'
})

export class ReportingPage{
  mainPage: any = MainPage;
  tabBarElement: any;
  lastImage: string = null;
  loading: Loading;
  categ;
  currentDate = new Date();
  date = this.currentDate.toLocaleDateString() + " " + this.currentDate.toLocaleTimeString();

//  private _client: Paho.MQTT.Client;
  imageURL;
    
  constructor(public navCtrl: NavController, public navParams: NavParams, public reportsService: ReportsService, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public alertCtrl: AlertController)
  {
	this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
	this.categ = navParams.data.categ;
	  
	Geolocation.getCurrentPosition().then((resp) => {
        this.report.latitude = resp.coords.latitude;
		this.report.longitude = resp.coords.longitude;
	},
	err => console.error("Error getting location", err));
  }	
  
  // Onclick function that retrieves the current location from a Cordova Geolocation plugin and  
  //
  geolocation(){
	Geolocation.getCurrentPosition().then((resp) => {
         this.report.latitude = resp.coords.latitude;
		 this.report.longitude = resp.coords.longitude;
	},
	err => console.error("Error getting location", err));
  }
  
  report = {
	date: new Date().toISOString(),
	type: '',
	latitude: null,
	longitude: null,
	photo: '',
	comments: ''
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
  
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
		  icon: !this.platform.is('ios') ? 'images' : null,
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
		  icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
		  icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel'
        }
      ]
    });
     actionSheet.present();
   }
  
    public takePicture(sourceType) {
		  // Create options for the Camera Dialog
		  var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			encodingType: Camera.EncodingType.JPEG,
			sourceType: sourceType,
			saveToPhotoAlbum: false,
			correctOrientation: true,
			allowEdit: false
		  };
		 
		  // Take a photo
		  Camera.getPicture(options).then((data) => {
				this.report.photo = "data:image/jpeg;base64," + data;
				this.imageURL = "data:image/jpeg;base64," + data;
			}, (err) => {
			this.presentToast('Error while selecting image.');
			});
	}
	
	private presentToast(text) {
	  let toast = this.toastCtrl.create({
		message: text,
		duration: 3000,
		position: 'top'
	  });
	  toast.present();
	}
	
  // Onclick function that displays a popup with a message and sends the reporting data to a MongoDB remote database
  // Once the data is successfully submitted, the popup message disappears and the user is redirected back to the home page
  reportInfo(){
		this.report.date = this.date;
		let loading = this.loadingCtrl.create({
            content: "Sending a report..."
        });
		loading.present();
		
		this.reportsService.addReport(this.report).subscribe(data => {
            loading.dismiss();
            this.navCtrl.popToRoot();
        }, (err) => {
            loading.dismiss();
			let alert = this.alertCtrl.create({
					title: 'Submission Error',
					subTitle: 'Looks like the report could not be submitted',
					buttons: ['Close']
				});
				
				alert.present();
        });
	}

	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////// MQTT Code /////////////////////////////////////////////////////////////////
	// Connect to the MQTT broker:185.34.81.81 port:1883
	// Websockets server broker:m21.cloudmqtt.com port:80 username:VT pass:windmill
	// new instance of Python-based Paho class(parameters provided are: host, port, clientId)
	// Web Broker (for testing) "broker.mqttdashboard.com", 8000, "clientId-BoltonUni"
	
	//this._client = new Paho.MQTT.Client("185.34.81.81", 1883, "DogWalkerApp");
	// inside the connect (userName: "VT", password: "windmill",)
    //this._client.connect({ onSuccess: this.onConnected.bind(this) });
	//this._client.onConnectionLost = (responseObject: Object) => {
    //  console.log('Connection lost.');
	//};
	//this._client.onMessageDelivered = this.onMessageDelivered;
  
    //private onConnected() {
		//console.log('Connected to broker.');
		
		//turn the report object variable to a JSON string
		//var jsonMessage = JSON.stringify(this.report);
	
		//instantiate a new Paho mqtt message object
		//var message = new Paho.MQTT.Message(jsonMessage);
	
		//message topic to subscribe to (and publish the message to)
		//message.destinationName = "/VTLOG/reports";
	
		//output the JSON string to the console (for testing purposes)
		//console.log(jsonMessage);
	
		//send the message to the broker
		//this._client.send(message);
	//}
  
  //private onMessageDelivered(): void {
	//console.log("Report submitted successfully");
  //}
}
