import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpInfoComponent } from './emp-info/emp-info.component';

const routes: Routes = [
    { path: '', component: EmpInfoComponent },
    { path: '**', component: EmpInfoComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
