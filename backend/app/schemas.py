from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional


class EmployeeBase(BaseModel):
    name: str = Field(..., description="Employee full name")
    email: EmailStr = Field(..., description="Employee email address")
    department: str = Field(..., description="Department name")
    designation: str = Field(..., description="Employee designation")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Name is required and cannot be empty or whitespace only")
        stripped = v.strip()
        if len(stripped) < 2:
            raise ValueError("Name must be at least 2 characters")
        return stripped

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Department is required and cannot be empty or whitespace only")
        return v.strip()

    @field_validator("designation")
    @classmethod
    def validate_designation(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Designation is required and cannot be empty or whitespace only")
        return v.strip()


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(EmployeeBase):
    pass


class EmployeeResponse(EmployeeBase):
    id: str
    mongo_id: Optional[str] = Field(default=None, alias="_id", serialization_alias="_id")

    model_config = {
        "populate_by_name": True,
        "serialize_by_alias": True
    }
