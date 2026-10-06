"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Employee, EmployeeInput } from "./types/employee";
import { employeeService } from "./services/employeeService";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeModal from "./components/EmployeeModal";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
];

export default function EmployeeManagementDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [viewEmployeeId, setViewEmployeeId] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Feedback notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch employees with backend search and filtering
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees(
        searchTerm,
        selectedDepartment === "All Departments" ? undefined : selectedDepartment
      );
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || "Unable to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDepartment]);

  // Load when search or department changes
  useEffect(() => {
    // Add debounce for search input
    const timer = setTimeout(() => {
      loadEmployees();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadEmployees]);

  // Handle Create
  const handleAddEmployee = async (input: EmployeeInput) => {
    await employeeService.createEmployee(input);
    showToast("Employee created successfully!", "success");
    await loadEmployees();
  };

  // Handle Update
  const handleUpdateEmployee = async (input: EmployeeInput) => {
    if (!editingEmployee) return;
    const empId = editingEmployee.id || editingEmployee._id;
    if (!empId) return;

    await employeeService.updateEmployee(empId, input);
    showToast("Employee updated successfully!", "success");
    await loadEmployees();
  };

  // Handle Delete
  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;
    const empId = deletingEmployee.id || deletingEmployee._id;
    if (!empId) return;

    await employeeService.deleteEmployee(empId);
    showToast("Employee deleted successfully!", "success");
    await loadEmployees();
  };

  // Triggers
  const handleView = (emp: Employee) => {
    const empId = emp.id || emp._id;
    if (empId) {
      setViewEmployeeId(empId);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleDelete = (emp: Employee) => {
    setDeletingEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 border ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Employee Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your organization's employees
            </p>
          </div>
          <div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add Employee</span>
            </button>
          </div>
        </div>

        {/* Controls Card (Search + Department Filter) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Box */}
            <div className="sm:col-span-8 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Department Dropdown */}
            <div className="sm:col-span-4 relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none bg-white pr-9 text-slate-700 font-medium"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Table / List */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          error={error}
          onRetry={loadEmployees}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Employee Modal */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEmployee}
      />

      {/* Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEditModalOpen}
        mode="edit"
        initialData={editingEmployee}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleUpdateEmployee}
      />

      {/* View Employee Details Modal */}
      <EmployeeDetailsModal
        isOpen={isViewModalOpen}
        employeeId={viewEmployeeId}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewEmployeeId(null);
        }}
        onEdit={(emp) => {
          setIsViewModalOpen(false);
          handleEdit(emp);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        employee={deletingEmployee}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingEmployee(null);
        }}
        onConfirm={handleDeleteEmployee}
      />
    </div>
  );
}
