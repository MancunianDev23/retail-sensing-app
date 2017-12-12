import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from './app-settings';
import 'rxjs/add/operator/map';

@Injectable()
export class ReportsService {
	apiUrl = this.appSettings.getApiUrl();

  constructor(public http: Http, public appSettings: AppSettings) {
  }
  
  public getReports() {
    return this.http.get(this.apiUrl + 'reports')
      .map(response => response.json().result);
  }
 
  public addReport(newReport) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.apiUrl + 'reports', JSON.stringify(newReport), {headers: headers}).map(response => response.json());
  }
 
  public deleteReport(reportId) {
    return this.http.delete(this.apiUrl + 'reports/' + reportId)
      .map(response => response.json());
  }
 
}