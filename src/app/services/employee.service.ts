// employee.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { Employee } from '../utilities/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private readonly dbName = 'employeeDatabase';
    private readonly storeName = 'employees';
    private db: IDBDatabase | null = null;
    private dbPromise: Promise<IDBDatabase> | null = null;
    employeeAdded: EventEmitter<void> = new EventEmitter<void>();
    constructor() {
        this.dbPromise = this.openDatabase();
    }

    private openDatabase(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = (event: any) => {
                console.error('Failed to open indexedDB:', event.target?.errorCode);
                reject(event.target?.errorCode);
            };

            request.onsuccess = (event: any) => {
                console.log('IndexedDB opened successfully');
                this.db = event.target?.result;
                resolve(event.target?.result);
            };

            request.onupgradeneeded = (event: any) => {
                console.log('Creating object store');
                this.db = event.target?.result;
                const objectStore = this.db?.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });

                // Add default employee data
                if (objectStore) {
                    const defaultEmployees = [
                        { name: 'Chris Hemsworth', age: 40 },
                        { name: 'Tony Stark', age: 35 },
                        { name: 'Steve Rogers', age: 105 }
                    ];

                    defaultEmployees.forEach(employee => {
                        objectStore.add(employee);
                    });
                }
            };
        });
    }

    async addEmployee(employee: Employee): Promise<void> {
        try {
            await this.dbPromise;
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(employee);

            request.onerror = (event: any) => {
                console.error('Failed to add employee:', event.target?.error);
                throw new Error(event.target?.error);
            };

            request.onsuccess = (event: any) => {
                console.log('Employee added successfully');
                this.employeeAdded.emit();
            };
        } catch (error) {
            console.error('Error adding employee', error);
            throw error; // Propagate the error to the caller
        }
    }

    getEmployees(): Promise<Employee[]> {
        return this.dbPromise!.then(db => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            return new Promise<Employee[]>((resolve, reject) => {
                request.onerror = (event: any) => {
                    console.error('Failed to get employees:', event.target?.error);
                    reject(event.target?.error);
                };

                request.onsuccess = (event: any) => {
                    console.log('Employees retrieved successfully');
                    resolve(event.target?.result);
                };
            });
        });
    }

    updateEmployee(employee: Employee): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.db) {
                reject('Database not initialized');
                return;
            }
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(employee);

            request.onerror = (event: any) => {
                console.error('Failed to update employee:', event.target?.error);
                reject(event.target?.error);
            };

            request.onsuccess = (event: any) => {
                console.log('Employee updated successfully');
                resolve();
            };
        });
    }

    deleteEmployee(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.db) {
                reject('Database not initialized');
                return;
            }
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onerror = (event: any) => {
                console.error('Failed to delete employee:', event.target?.error);
                reject(event.target?.error);
            };

            request.onsuccess = (event: any) => {
                console.log('Employee deleted successfully');
                resolve();
            };
        });
    }
}