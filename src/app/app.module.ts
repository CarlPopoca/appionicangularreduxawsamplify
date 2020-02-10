import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {ContactsReducer} from './reducers/contacts.reducer';
import { AmplifyAngularModule, AmplifyIonicModule, AmplifyService } from 'aws-amplify-angular';
import {ContactsEffects} from './effects/contacts.effects';
import {GenderEffects} from './effects/gender.effects';
import { AuthGuardService} from './services/auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import {GenderReducer} from './reducers/gender.reducer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule,
    IonicModule.forRoot(),  
    FormsModule,
    AppRoutingModule, 
    AmplifyAngularModule,
    AmplifyIonicModule,
    EffectsModule.forRoot([ContactsEffects, GenderEffects]), 
    StoreModule.forRoot({ contacts: ContactsReducer, gender: GenderReducer }),
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AmplifyService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})  
export class AppModule {
 
}
