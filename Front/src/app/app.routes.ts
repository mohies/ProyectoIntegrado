import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventosComponent } from './eventos/eventos.component';
import { LoginComponent } from './login/login.component';
import { ContactoComponent } from './contacto/contacto.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CompraComponent } from './compra/compra.component';
import { RegistroComponent } from './registro/registro.component';
import { ElegirRolComponent } from './elegir-rol/elegir-rol.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AdminComponent } from './admin/admin.component';
import { CrearEventoComponent } from './crear-evento/crear-evento.component';
import { EventoDetalleComponent } from './evento-detalle/evento-detalle.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'compra', component: CompraComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'elegir-rol', component: ElegirRolComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'crear-evento', component: CrearEventoComponent },
  { path: 'evento/:id', component: EventoDetalleComponent },
  { path: '**', redirectTo: '' }
];
