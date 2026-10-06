import re
from typing import List, Optional
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query, status

from app.database import employees_collection
from app.schemas import EmployeeCreate, EmployeeResponse, EmployeeUpdate

router = APIRouter(prefix="/employees", tags=["Employees"])


def serialize_employee(emp: dict) -> dict:
    emp_id = str(emp.get("_id"))
    return {
        "id": emp_id,
        "_id": emp_id,
        "name": emp.get("name"),
        "email": emp.get("email"),
        "department": emp.get("department"),
        "designation": emp.get("designation"),
    }


def get_employee_or_404(employee_id: str) -> dict:
    query_conditions = []
    if ObjectId.is_valid(employee_id):
        query_conditions.append({"_id": ObjectId(employee_id)})
    query_conditions.append({"_id": employee_id})
    query_conditions.append({"id": employee_id})
    try:
        query_conditions.append({"id": int(employee_id)})
    except ValueError:
        pass

    emp = employees_collection.find_one({"$or": query_conditions})
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return emp


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate):
    # Check for duplicate email
    existing_employee = employees_collection.find_one({
        "email": {"$regex": f"^{re.escape(employee.email)}$", "$options": "i"}
    })
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An employee with this email already exists"
        )

    doc = {
        "name": employee.name,
        "email": employee.email,
        "department": employee.department,
        "designation": employee.designation,
    }
    result = employees_collection.insert_one(doc)
    created_doc = employees_collection.find_one({"_id": result.inserted_id})
    return serialize_employee(created_doc)


@router.get("", response_model=List[EmployeeResponse])
@router.get("/", response_model=List[EmployeeResponse])
def get_employees(
    search: Optional[str] = Query(None, description="Search by name or email"),
    department: Optional[str] = Query(None, description="Filter by department")
):
    query = {}
    conditions = []

    # Search by name or email (case-insensitive)
    if search and search.strip():
        s = search.strip()
        escaped_search = re.escape(s)
        conditions.append({
            "$or": [
                {"name": {"$regex": escaped_search, "$options": "i"}},
                {"email": {"$regex": escaped_search, "$options": "i"}}
            ]
        })

    # Filter by department (case-insensitive)
    if department and department.strip() and department.strip().lower() not in ["all", "all departments"]:
        dept = department.strip()
        conditions.append({
            "department": {"$regex": f"^{re.escape(dept)}$", "$options": "i"}
        })

    if len(conditions) == 1:
        query = conditions[0]
    elif len(conditions) > 1:
        query = {"$and": conditions}

    employees_cursor = employees_collection.find(query).sort("_id", -1)
    return [serialize_employee(emp) for emp in employees_cursor]


@router.get("/{id}", response_model=EmployeeResponse)
def get_employee(id: str):
    emp = get_employee_or_404(id)
    return serialize_employee(emp)


@router.put("/{id}", response_model=EmployeeResponse)
def update_employee(id: str, employee_update: EmployeeUpdate):
    emp = get_employee_or_404(id)

    # Check if updated email is already taken by a different employee
    existing_with_email = employees_collection.find_one({
        "email": {"$regex": f"^{re.escape(employee_update.email)}$", "$options": "i"},
        "_id": {"$ne": emp["_id"]}
    })
    if existing_with_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An employee with this email already exists"
        )

    employees_collection.update_one(
        {"_id": emp["_id"]},
        {
            "$set": {
                "name": employee_update.name,
                "email": employee_update.email,
                "department": employee_update.department,
                "designation": employee_update.designation,
            }
        }
    )

    updated_doc = employees_collection.find_one({"_id": emp["_id"]})
    return serialize_employee(updated_doc)


@router.delete("/{id}")
def delete_employee(id: str):
    emp = get_employee_or_404(id)
    employees_collection.delete_one({"_id": emp["_id"]})
    return {"message": "Employee deleted successfully", "id": str(emp["_id"])}