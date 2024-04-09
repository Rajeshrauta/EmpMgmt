import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../utilities/employee.model';
import { Router } from '@angular/router';
import { AddEmpComponent } from '../add-emp/add-emp.component';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { EditEmpComponent } from '../edit-emp/edit-emp.component';


@Component({
  selector: 'app-emp-info',
  templateUrl: './emp-info.component.html',
  styleUrl: './emp-info.component.scss'
})
export class EmpInfoComponent implements OnInit {
  employees: Employee[] = [];
  bsModalRef!: BsModalRef;
  @ViewChild(AddEmpComponent) AddEmpComponent!: AddEmpComponent;
  @ViewChild(EditEmpComponent) EditEmpComponent!: EditEmpComponent;

  constructor(private router: Router, private employeeService: EmployeeService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadEmployees();

    this.employeeService.employeeAdded.subscribe(() => {
      this.loadEmployees(); // Reload employees after adding a new employee
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().then(employees => {
      this.employees = employees;
    }).catch(error => {
      console.error('Error loading employees', error);
    });
  }

  editEmployee(employee: Employee): void {
    this.EditEmpComponent.showModal(employee);
    console.log(employee);
    // const initialState = {
    //   employee: { ...employee }
    // };
    // this.bsModalRef = this.modalService.show(EditEmpComponent, { initialState });
    // this.bsModalRef.content.closeModal.subscribe(() => {
    //   this.loadEmployees();
    // });
  }

  deleteEmployee(id?: number): void {
    if (id !== undefined) {
      this.employeeService.deleteEmployee(id).then(() => {
        console.log(`Employee with ID ${id} deleted.`);
        // Refresh employee list after deletion
        this.loadEmployees();
      }).catch(error => {
        console.error(`Error deleting employee with ID ${id}`, error);
      });
    } else {
      console.error(`Something went wrong!`);
    }
    
  }

  openAddEmployeeModal(): void {
    this.AddEmpComponent.showModal();
  }
}