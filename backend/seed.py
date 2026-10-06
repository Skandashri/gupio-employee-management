from app.database import employees_collection

sample_employees = [
    {
        "name": "Rahul Kumar",
        "email": "rahul.kumar@gupio.com",
        "department": "Engineering",
        "designation": "Senior Software Engineer"
    },
    {
        "name": "Priya Sharma",
        "email": "priya.sharma@gupio.com",
        "department": "HR",
        "designation": "HR Manager"
    },
    {
        "name": "Amit Patel",
        "email": "amit.patel@gupio.com",
        "department": "Finance",
        "designation": "Financial Analyst"
    },
    {
        "name": "Sneha Reddy",
        "email": "sneha.reddy@gupio.com",
        "department": "Marketing",
        "designation": "Marketing Lead"
    },
    {
        "name": "Vikram Singh",
        "email": "vikram.singh@gupio.com",
        "department": "Sales",
        "designation": "Sales Executive"
    }
]

def seed():
    employees_collection.delete_many({})
    result = employees_collection.insert_many(sample_employees)
    print(f"Successfully seeded {len(result.inserted_ids)} employees into MongoDB.")

if __name__ == "__main__":
    seed()
