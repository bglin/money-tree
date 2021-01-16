from flask import Flask,jsonify, request
from sqlalchemy import text, bindparam
from sqlalchemy.sql import update
from db import db_session
from models import Student,Enrollment
from config import Config
import json


app = Flask(__name__)
app.config.from_object(Config)

@app.route('/')
def hello_world():
    return "hello world"

@app.route('/api/teacher_profile')
##hardcoded values for now
def get_profile():
    class_list='''select Teacher.username,Class.class_id,Class.class_name,Class.period_no,Class.duration
                    from Class
                    join Teacher
                    on Teacher.teacher_id=Class.teacher_id
                    where Class.teacher_id=1
                    order by class_id and period_no
    '''
    class_result=db_session.execute(class_list).fetchall()
    teacher_profile={"username":class_result[0][0]}
    class_result= [{"class_id":item[1],"class_name":item[2],"period_no":item[3],"duration":item[4]} for item in class_result]
    print(class_result)
    for count,list_item in enumerate(class_result):
        stmt = '''select Enrollment.enroll_id,Enrollment.student_id,Student.username
                from Enrollment
                join Student
                on Student.student_id=Enrollment.student_id
                where class_id='{0}' and period_no='{1}'
                '''.format(list_item["class_id"],list_item["period_no"])

        student_list=db_session.execute(stmt).fetchall()
        student_list = [dict(student) for student in student_list]
        class_result[count].update({"student_roster":student_list})

    teacher_profile.update({"class_list":class_result})
    return (jsonify(teacher_profile))


## update balance
@app.route('/api/update_balance', methods=['POST'])
def update_balance():

    incoming_data = json.loads(json.dumps(request.json))
    print(incoming_data)
    # db_session.query(Student).filter(Student.student_id.in_([100,101])).update({Student.gold:Student.gold + 50},synchronize_session=False)

    # item_list = [{'student_id':100,"gold":50},{'student_id':101,"gold":50}]
    params = [{'id':student.get("student_id"),'amount':student.get("gold")} for student in incoming_data]
    update_stmt = update(Student).where(Student.student_id == bindparam('id')).values({Student.gold:Student.gold + bindparam('amount')})
    try:
        db_session.execute(update_stmt,params)
        db_session.commit()
    except:
        db_session.rollback()

    for row in db_session.query(Student):
        print (row.username,row.gold)
    return(jsonify({"message": "Balance Updated"}))


##{'teacher_id':,
## 'teacher_name':'',
##  'class_list': [{'class_id':'','class_name': '','period_no':1,duration':50,student_roster:[{},{}]},
##                 'class_id':'','class_name': '','duration':'',student_roster:[{},{}]}]
##}
@app.route('/api/classes',methods = ['GET'])
def all_classes():
    result=db_session.execute("select * from Teacher").fetchall()
    formatted_result = [dict(item) for item in result]
    return (jsonify(formatted_result))

@app.route('/classes/<class_id>')
def get_class(class_id):
    result=db_session.execute('''select * from Enrollment where class_id="HM-001" ''').fetchall()
    formatted_result = [dict(item) for item in result]
    return (jsonify(formatted_result))

@app.teardown_appcontext
def teardown_db(resp_or_exc):
    print("session Removal intiating")
    db_session.remove()
