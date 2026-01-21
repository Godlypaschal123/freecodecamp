# student_management.py

students = []

def add_student(name, age):
    students.append({"name": name, "age": age})
    print(f"Student {name} added successfully!")

def view_students():
    for s in students:
        print(f"Name: {s['name']}, Age: {s['age']}")

def delete_student(name):
    global students
    students = [s for s in students if s['name'] != name]
    print(f"Student {name} deleted successfully!")

# Example usage
add_student("Alice", 20)
add_student("Bob", 22)
view_students()
delete_student("Alice")
view_students()