"use client";

import React, { useEffect, useState } from "react";
import { Employee } from "../types/employee";
import { employeeService } from "../services/employeeService";

interface EmployeeDetailsModalProps {
  employeeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (emp: Employee) => void;
}

export default function EmployeeDetailsModal({
  employeeId,
  isOpen,
  onClose,
  onEdit,
}: EmployeeDetailsModalProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && employeeId) {
      setLoading(true);
      setError(null);
      employeeService
        .getEmployeeById(employeeId)
        .then((data) => {
          setEmployee(data);
        })
        .catch((err) => {
          setError(err.message || "Failed to load employee details");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setEmployee(null);
    }
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Employee Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <p className="text-sm text-slate-500">Fetching employee details...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <p className="font-medium">Error loading employee</p>
              <p className="mt-1 text-xs text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && employee && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl uppercase">
                  {employee.name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{employee.name}</h4>
                  <p className="text-sm text-blue-600 font-medium">{employee.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 py-2 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Email Address
                  </span>
                  <span className="text-slate-800 font-medium break-all">{employee.email}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Department
                  </span>
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {employee.department}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Designation
                  </span>
                  <span className="text-slate-800 font-medium">{employee.designation}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Employee ID
                  </span>
                  <span className="text-slate-500 font-mono text-xs">{employee.id || employee._id}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          {employee && onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
            >
              Edit Employee
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 transition-colors border border-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
