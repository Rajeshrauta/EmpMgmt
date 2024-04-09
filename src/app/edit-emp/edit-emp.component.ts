import { Component, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../utilities/employee.model';

@Component({
  selector: 'app-edit-emp',
  templateUrl: './edit-emp.component.html',
  styleUrl: './edit-emp.component.scss'
})
export class EditEmpComponent {
  editEmployeeForm!: FormGroup;
  submitted = false;
  employee: Employee = {
    id: 0,
    name: '',
    age: 0
  };

  @ViewChild('editEmployeeModal') editEmployeeModal: any;

  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder, private employeeService: EmployeeService) {

  }

  ngOnInit(): void {
    this.editEmployeeForm = this.formBuilder.group({
      id: [{ value: null, disabled: true }, Validators.required],
      name: ["", [Validators.required, Validators.maxLength(200)]],
      age: [null, [Validators.required,Validators.pattern("^[0-9]*$")]]
    });
  }

  get f() { return this.editEmployeeForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.editEmployeeForm.invalid) {
      console.log(this.editEmployeeForm);
      return;
    }

    this.employee.name = this.editEmployeeForm.value.name;
    this.employee.age = this.editEmployeeForm.value.age;

    this.employeeService.updateEmployee(this.employee).then(() => {
      console.log('Employee updated successfully');
      this.editEmployeeModal.hide();
    }).catch(error => {
      console.error('Error updating employee', error);
    });
  }

  closeModal(): void {
    this.editEmployeeModal.hide();
  }

  showModal(employee: Employee) {
    this.editEmployeeModal.show();
    this.employee = employee;
    this.editEmployeeForm.patchValue({
      id: this.employee.id,
      name: this.employee.name,
      age: this.employee.age
    });
  }

  public numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
