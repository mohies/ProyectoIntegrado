import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventosComponent } from './eventos/eventos.component';
import { LoginComponent } from './login/login.component';
import { ContactoComponent } from './contacto/contacto.component';
import { CompraComponent } from './compra/compra.component';
import { RegistroComponent } from './registro/registro.component';
import { ElegirRolComponent } from './elegir-rol/elegir-rol.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AdminComponent } from './admin/admin.component';
import { CrearEventoComponent } from './crear-evento/crear-evento.component';
import { EventoDetalleComponent } from './evento-detalle/evento-detalle.component';
import { AuthGuard } from './guards/auth.guard';
import { CarritoGuard } from './guards/carrito.guard';
import { CarritoComponent } from './carrito/carrito.component';
import { UsuariosAdminComponent } from './admin/usuarios/usuarios.component';
import { EventosAdminComponent } from './admin/eventos/eventos.component';
import { ResenasAdminComponent } from './admin/resenas/resenas.component';
import { PayoutsComponent } from './admin/payouts/payouts.component';
import { MisreservasComponent } from './misreservas/misreservas.component';
import { ReembolsoComponent } from './admin/reembolso/reembolso.component';
import { MisEventosComponent } from './organizador/mis-eventos/mis-eventos.component';
import { VerReservasComponent } from './organizador/ver-reservas/ver-reservas.component';
import { ResumenOrganizadorComponent } from './organizador/resumen-organizador/resumen-organizador.component';
import { MisPayoutsComponent } from './organizador/mis-payouts/mis-payouts.component';
import { CalendarioEventosComponent } from './calendarioeventos/calendarioeventos.component';
import { RecuperarPasswordComponent } from './login/recuperar-password.component';
import { ResetearPasswordComponent } from './login/resetear-password.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'compra', component: CompraComponent, canActivate: [AuthGuard, CarritoGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: 'elegir-rol', component: ElegirRolComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'crear-evento', component: CrearEventoComponent },
  { path: 'evento/:id', component: EventoDetalleComponent },
  { path: 'admin/usuarios', component: UsuariosAdminComponent },
  { path: 'admin/eventos', component: EventosAdminComponent },
  { path: 'admin/resenas', component: ResenasAdminComponent },
  { path: 'admin/payouts', component: PayoutsComponent },
  { path: 'admin/reembolsos', component: ReembolsoComponent },
  { path: 'mis-reservas', component: MisreservasComponent },
  { path: 'organizador/mis-eventos', component: MisEventosComponent },
  { path: 'organizador/reservas/:id', component: VerReservasComponent },
  { path: 'organizador/resumen', component: ResumenOrganizadorComponent },
  { path: 'organizador/pagos', component: MisPayoutsComponent },
  { path: 'calendario', component: CalendarioEventosComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'resetear-password', component: ResetearPasswordComponent },

  { path: '**', redirectTo: '' },

];

