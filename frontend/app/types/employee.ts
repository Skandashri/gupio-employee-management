export interface Employee {
  id: string;
  _id?: string;
  name: string;
  email: string;
  department: string;
  designation: string;
}

export interface EmployeeInput {
  name: string;
  email: string;
  department: string;
  designation: string;
}
