import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Import ReactiveFormsModule and necessary validators
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../utilities/employee.model';
@Component({
  selector: 'app-add-emp',
  templateUrl: './add-emp.component.html',
  styleUrl: './add-emp.component.scss'
})
export class AddEmpComponent {
  addEmployeeForm!: FormGroup;
  submitted = false;
  employee: Employee = {
    name: '',
    age: 0
  };

  @ViewChild('addEmployee') addEmployee: any;

  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder, private employeeService: EmployeeService) {
    
  }

  ngOnInit(): void {
    this.addEmployeeForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(200)]], 
      age: [null, [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

  get f() { return this.addEmployeeForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.addEmployeeForm.invalid) {
      return;
    }
    this.employee.name = this.addEmployeeForm.value.name;
    this.employee.age = this.addEmployeeForm.value.age;

    console.log(this.employee);

    this.employeeService.addEmployee(this.employee).then(() => {
      console.log('Employee added successfully');
      this.bsModalRef.hide();
    }).catch(error => {
      console.error('Error adding employee', error);
    });
    this.addEmployee.hide();
  }

  closeModal(): void {
    this.addEmployee.hide();
  }

  showModal() {
    this.addEmployee.show();
  }

  public numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}