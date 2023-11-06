import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from'@angular/common/http';
import{finalize}from 'rxjs/operators';
import{Storage} from '@google-cloud/storage';
import { initializeApp } from "firebase/app";
import { URLSearchParams } from 'url';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'uiTesting';
  API_KEY: any;
  failedClaims: any;
  failedClaimsName: any=[];

constructor(private http: HttpClient,
  private route:ActivatedRoute) {
    /*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {'client_id': 'YOUR_CLIENT_ID',
                'redirect_uri': 'YOUR_REDIRECT_URI',
                'response_type': 'token',
                'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
                'include_granted_scopes': 'true',
                'state': 'pass-through value'};

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}
var va=window.location.hash.substr(1);

this.route.queryParams.subscribe(fragment=>{
  const access_token =fragment['access_token']
  console.log('access',access_token)
  })
  this.oauthSignIn()

}

ob:any;


oauthSignIn(): void {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/token'; // Replace with the OAuth 2.0 endpoint URL

    const params = {
    client_id: '767673406818-baojhpltm8ivd3namurvb0ppo96l65tj.apps.googleusercontent.com',
    redirect_uri: 'https://developers.google.com/oauthplayground',
    // response_type: 'code',
    scope: 'https://www.googleapis.com/auth/devstorage.full_control',
    // access_type:'offline',
    refresh_token:'1//043hMg5vBiZ1OCgYIARAAGAQSNwF-L9IrclPWVV6_Yb0-fi1rUzHnx1NnEvs3cXuz9Jn9u9M8yNquki9bpCIfBh-C59G3sqCzYVg',
    grant_type:'refresh_token',
    client_secret:'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'
    // include_granted_scopes: 'true',
    // state: 'pass-through value'
    };

    // const url = this.buildUrl(oauth2Endpoint, params);
    // this.openWindow(url);
    this.http.post(oauth2Endpoint,params).pipe(
        finalize(() => {
        // Handle file upload completion
        console.log('File uploaded successfully');
        })
        ).subscribe(
        (response) => {
          this.ob=response;
          this.API_KEY = this.ob.access_token
        // Handle successful upload response
        console.log(response);
        console.log('Upload response:', response);
        },
        (error) => {
        // Handle upload error
        console.error('Error uploading file:', error);
        }
        );

    }







ObjectName:String;
ObName:any;
name:String = "No file uploaded yet.";
// Upload file to Google Cloud Storage
uploadFile(event: any): void {

const file = event.target.files[0];
var ObjectName = file.name;
const metadata = {
name:ObjectName,
mimeType:file.type
};


  //  const API_KEY = "";
const headers =new HttpHeaders().set('Authorization', `Bearer ${this.API_KEY}`);
    // const url = 'https://storage.googleapis.com/gen-galaxy-input-insurance/'; // Replace with the appropriate URL for uploading files
    const url = 'https://storage.googleapis.com/upload/storage/v1/b/gen-galaxy-input-insurance/o';
    const formData = new FormData();
    formData.append('file', file);
this.http.post(url, formData,{params:metadata, headers}).pipe(
    finalize(() => {
    // Handle file upload completion
    console.log('File uploaded successfully');
    })
    ).subscribe(
    (response) => {
    // Handle successful upload response
    this.ObName = response;
    this.name = this.ObName.name;
    console.log('Upload response:', response);
    },
    (error) => {
    // Handle upload error
    console.error('Error uploading file:', error);
    }
    );
    this.listingbucket()
    }

listingbucket(){
  const headers =new HttpHeaders().set('Authorization', `Bearer ${this.API_KEY}`);
const getUrl = "https://storage.googleapis.com/storage/v1/b/gen-galaxy-pending-insurance/o"
  this.http.get(getUrl,{headers}).pipe(
    finalize(() => {
    // Handle file upload completion
    console.log('File uploaded successfully');
    })
    ).subscribe(
    (response) => {
    // Handle successful upload response
    this.failedClaims = response;
    if(this.failedClaims.items)
     for(var i = 0;i<this.failedClaims.items.length;i++){
      this.failedClaimsName.push(this.failedClaims.items[i].name);
     };
    console.log('download response:', this.failedClaimsName);
    },
    (error) => {
    // Handle upload error
    console.error('Error uploading file:', error);
    }
    );
}
}
