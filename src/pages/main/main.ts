import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ReportingPage } from '../reporting/reporting';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  reportPage: any = ReportingPage;
  tabBarElement: any;
  categs = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
	this.categs = [
	  {
        'category': 'roads and pavements',
		'problems': ["road marking defect", "pavement defect", "missing manhole cover", "road or pavement obstruction", "empty or damaged grit bin"],
      },
      {
        'category': 'public transport',
		'problems': ["bus shelter damage", "damaged timetable case or display", "anti-social behaviour", "crime", "health and safety issue"],
      },
      {
        'category': 'street furniture',
		'problems': ["faulty sign", "faulty or broken streetlight", "faulty signal" , "damaged guard rail, bollard or bench", "damaged litter bin"],
      },
      {
		'category': 'environmental',
		'problems': ["pest", "graffiti", "dog fouling", "dead animal", "fly tipping"],
      }
    ]
  }
  
   openReportingPage(categ) {
    this.navCtrl.push(ReportingPage, { categ: categ });
  }
  
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

}
