import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MainPage } from '../main/main';
import { ReportingPage } from '../reporting/reporting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MainPage;
  tab3Root: any = ReportingPage;

  constructor() {

  }
}
