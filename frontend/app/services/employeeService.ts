import { Employee, EmployeeInput } from "../types/employee";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMessage = data.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ");
      } else if (data.message) {
        errorMessage = data.message;
      }
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export const employeeService = {
  async getEmployees(search?: string, department?: string): Promise<Employee[]> {
    const params = new URLSearchParams();
    if (search && search.trim()) {
      params.append("search", search.trim());
    }
    if (department && department.trim() && department.trim().toLowerCase() !== "all departments" && department.trim().toLowerCase() !== "all") {
      params.append("department", department.trim());
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/employees${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    return handleResponse<Employee[]>(res);
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const res = await fetch(`${API_BASE_URL}/employees/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    return handleResponse<Employee>(res);
  },

  async createEmployee(data: EmployeeInput): Promise<Employee> {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Employee>(res);
  },

  async updateEmployee(id: string, data: EmployeeInput): Promise<Employee> {
    const res = await fetch(`${API_BASE_URL}/employees/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Employee>(res);
  },

  async deleteEmployee(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/employees/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
    });

    return handleResponse<{ message: string }>(res);
  },
};
