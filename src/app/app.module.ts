import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmpInfoComponent } from './emp-info/emp-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from './services/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { AddEmpComponent } from './add-emp/add-emp.component';
import NgxBootstrapModule from "ngx-bootstrap";
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from "@angular/common";
import { EditEmpComponent } from './edit-emp/edit-emp.component';
@NgModule({
    declarations: [
        AppComponent,
        EmpInfoComponent,
        AddEmpComponent,
        EditEmpComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', component: EmpInfoComponent },
            { path: 'add', component: AddEmpComponent },
        ]),
        HttpClientModule,
        ModalModule.forRoot(),
        FormsModule

    ],
    providers: [EmployeeService],
    bootstrap: [AppComponent]
})
export class AppModule { }