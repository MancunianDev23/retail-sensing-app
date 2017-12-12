import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MainPage } from '../pages/main/main';
import { ReportingPage } from '../pages/reporting/reporting';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ReportsService } from '../providers/reports-service';
import { AppSettings } from '../providers/app-settings';

@NgModule({
  declarations: [
    MyApp,
    MainPage,
    ReportingPage,
    HomePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainPage,
    ReportingPage,
    HomePage,
    TabsPage
  ],
  providers: [ReportsService, AppSettings, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}