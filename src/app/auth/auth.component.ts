import { Component } from '@angular/core';
import { RouterOutlet } from '../../../node_modules/@angular/router/types/_router_module-chunk';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AuthComponent {}
