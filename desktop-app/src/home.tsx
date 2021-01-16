import React, {useState,useEffect} from 'react';
import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col,Button,Card} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navigation from './header';
const { ipcRenderer } = window.require('electron');


interface ITeacher {
  username: string
  class_list:Array<{ class_name: string, class_id: string,period_no:number,student_roster:Array<object> }>
}

function HomePage() {

  const [teacherProfile,setProfile] = useState<ITeacher>({"username": "","class_list":[]});

  const handleResponse = (_event: any, response: ITeacher) => {
    setProfile(response);
  };
  useEffect(() => {
    console.log('use effect invoked index');
    ipcRenderer.on('teacher_profile_resp', handleResponse);
    ipcRenderer.send('teacher_profile', 'teacher_id');


    return () => ipcRenderer.removeListener('teacher_profile_resp', handleResponse);
  },[]);

  return (

    <div className="App">
      <Navigation />
      <br />
      <h1> {teacherProfile.username}</h1>
    <div className="Content">
      <Container>
      <Row style={{ marginBottom: '10px' }}>
      {teacherProfile.class_list.map((item,idx) => (
        <Col  key={idx}>
        <Link
        to={{
          pathname:'/roster',
          state: { class_profile: item }
        }}>
          {/*<Button variant="light">*/}
          <Card
          style={{ width: '18rem', marginBottom: '10px' }}
          border="light"
          text='dark'
          >
            <Card.Body>
              <Card.Title>{item.class_name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted"> Period {item.period_no}</Card.Subtitle>
            </Card.Body>
          </Card>
          {/*</Button>*/}
        </Link>
        </Col>
      ))}
      </Row>
      </Container>
    </div>
    </div>

);
};


export default HomePage;
