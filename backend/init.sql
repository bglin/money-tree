drop database  if exists portal;
create database portal;

use portal;

set foreign_key_checks=0;

--  create schema tables --
create table Teacher (
teacher_id int auto_increment primary key,
username varchar(64),
userpassword varchar(64),
email_address varchar(64)
);

--
create table Class (
class_id varchar(64),
teacher_id int,
class_name varchar (64),
period_no int,
duration int,
primary key (class_id, period_no,teacher_id),
foreign key (teacher_id) 
	references Teacher(teacher_id)
    on delete cascade
);

create table Student (
student_id int primary key,
email_address varchar(64),
username varchar(64),
studentpass varchar (64),
gold float (12)
);

create table Enrollment (
enroll_id varchar(64),
student_id int,
class_id varchar(64),
period_no int,
primary key (enroll_id,class_id, student_id,period_no),
foreign key (class_id,period_no) 
	references Class(class_id,period_no)
    on delete cascade,
foreign key (student_id) 
	references Student(student_id)
    on delete cascade
);

create table ItemType (
item_id varchar(64) primary key,
item_name varchar(64),
price decimal(12)
);

create table StudentInventory (
inventory_id int,
student_id int,
item_id varchar(64),
primary key (inventory_id,student_id,item_id),
foreign key (student_id) 
	references Student(student_id)
    on delete cascade,
foreign key(item_id) 
	references ItemType(item_id)
    on delete cascade
);

-- insert test data --
insert into Teacher (username,email_address,userpassword) 
values ( 'becky_barton', 'bbarton@test.com', 'testpass');

insert into Class(class_id,teacher_id,class_name,duration,period_no)
values ('HM-001',1,'Ancient Civilization',50,1);

insert into Class(class_id,teacher_id,class_name,duration,period_no)
values ('HM-001',1,'Ancient Civilization',50,2);

insert into Student(student_id,email_address,username, studentpass, gold)
values (100,'bruno@test.com','bglin','testgamepass',0);

insert into Student(student_id,email_address,username, studentpass, gold)
values (101,'milo@test.com','miblob','testgamepass1',0);

insert into Student(student_id,email_address,username, studentpass, gold)
values (102,'naruto@test.com','namaki','testgamepass1',0);

insert into Student(student_id,email_address,username, studentpass, gold)
values (103,'sasuske@test.com','uchiha','testgamepass1',0);

insert into Enrollment( enroll_id, student_id, class_id,period_no)
values ('HM-XX-001',100,'HM-001',1);

insert into Enrollment( enroll_id, student_id, class_id,period_no)
values ('HM-XX-002',101,'HM-001',1);

insert into Enrollment( enroll_id, student_id, class_id,period_no)
values ('HM-XX-003',102,'HM-001',2);

insert into Enrollment( enroll_id, student_id, class_id,period_no)
values ('HM-XX-004',103,'HM-001',2);

insert into ItemType(item_id,item_name,price)
values('IT-01', 'Plasma Screen TV', 500);

insert into StudentInventory(inventory_id,item_id, student_id)
values (1200,'IT-01',100);


select StudentInventory.item_id, Student.username 
from Student
join StudentInventory
on student.student_id=StudentInventory.student_id;


select Enrollment.enroll_id,Enrollment.student_id,Enrollment.class_id,Enrollment.period_no, Class.class_name,Teacher.username
from Enrollment
join Class
on Enrollment.class_id=Class.class_id
join Teacher
on Class.teacher_id=Teacher.teacher_id
where Teacher.teacher_id=1
order by class_id;

select Teacher.username,Enrollment.class_id,Enrollment.period_no,Class.class_name,Enrollment.enroll_id,Enrollment.student_id,Student.username,Student.gold
from Student
join Enrollment
on Student.student_id=Enrollment.student_id
join Class
on Enrollment.class_id=Class.class_id
join Teacher
on Class.teacher_id=Teacher.teacher_id
where Teacher.teacher_id=1
order by class_id;


select Teacher.username,Class.class_id,Class.class_name,Enrollment.enroll_id,Enrollment.student_id,Student.username,Student.gold
from Teacher
join Class
on Class.teacher_id=Teacher.teacher_id
join Enrollment
on Class.class_id=Enrollment.class_id
join Student
on Enrollment.student_id=Student.student_id
where Teacher.teacher_id=1;

select * from Enrollment
order by class_id and period_no;

select * 
from Class
Join Teacher
on teacher.teacher_id=Class.teacher_id
where Teacher.teacher_id=1
order by class_id and period_no;

select * from StudentInventory;
