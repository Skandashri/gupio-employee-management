from typing import Optional
from pydantic import BaseModel, EmailStr


class EmployeeModel(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    department: str
    designation: str
