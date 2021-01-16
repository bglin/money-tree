
from db import Base
# mapped classes are now created with names by default
# matching that of the table name.
Teacher = Base.classes.Teacher
Classroom = Base.classes.Class
Student = Base.classes.Student
Enrollment = Base.classes.Enrollment
Itemtype = Base.classes.ItemType
Studentinventory = Base.classes.StudentInventory

# for item in Base.classes:
#     print (item)
#
# print(Base.classes.keys())
