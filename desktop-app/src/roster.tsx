
import React, { useState,useEffect,useReducer,useRef } from 'react';
import {useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './header';
import {Container,Figure,Row,Col,Button,Modal,Form,Card} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import useTimer from './hooks/useTimer';
// import alien from './images/Alien_IDLE_1.png';
// import alienchill from './images/alien_chill.gif';
// import aliendead from './images/Alien_DEAD.png';
import staridle from './images/star_idle.png';
import stardead from './images/star_dead.png';
import clownidle from './images/clown_idle.png';
import clowndead from './images/clown_dead.png';
import crabidle from './images/crab_idle.png';
import crabdead from './images/crab_dead.png';
import toothidle from './images/tooth_idle.png';
import toothdead from './images/tooth_dead.png';

const idle_array = [staridle, clownidle,toothidle,crabidle];
const dead_array = [stardead,clowndead,toothdead,crabdead];

const { ipcRenderer } = window.require('electron');


function reducer(state:any, action:any) {
switch (action.type) {
  case 'runTimer':
  return {...state,timer:state.timer+1}

  case 'endTimer':
  return {...state,timer:0};

  case 'resetBalance':
  return {...state,student_roster: state.student_roster.map((item:any) => {
        item.gold=0;
        return item;})};

  case 'incrementGold':
  return {...state,student_roster: state.student_roster.map((item:any) => {
        if (!item.punishFlag) {
        item.gold+=.0016;
        };
        return item;})};

  case 'rewardStudent':
  return {...state,student_roster: state.student_roster.map((item:any) => {
        // console.log(action.payload)
        if (item.student_id===action.payload) {
         item.gold+=1;
        }
        return item;})};


  case 'punishStudent':
  return {...state,student_roster: state.student_roster.map((item:any) => {
        console.log(action.payload)
        if (item.student_id===action.payload) {
         item.punishFlag=true;
        }
        return item;})};

  case 'punishEnd':
  return {...state,student_roster: state.student_roster.map((item:any) => {
        if (item.student_id===action.payload) {
         item.punishFlag=false;
        }
        return item;})};



  case 'timeout':
  return state;

  default:
    throw new Error();
}};

function RosterPage() {
  let location : any = useLocation()

  const countRef = useRef<any>(null);
  const EndClassRef = useRef<any>(null);
  // const punishRef = useRef<any>(null);
  const PauseRef = useRef<boolean>(false);

  const initialState = {timer:0, student_roster:location.state.class_profile.student_roster.map((item:any) => ({...item,gold:0,punishFlag:false}))}
  const [state, dispatch] = useReducer(reducer, initialState);



  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [duration, setDuration] =useState(0);
  const [isActive, setActive] = useState(false);
  // const { timer, isActive, handleStart, handleReset,handleStop } = useTimer({start:0,duration:50000});

  const handleResponse = (_event: any, response: any) => {
    console.log(response);
  }

  useEffect(() => {
  console.log('invoked 2')
  ipcRenderer.on('student_balance_resp', handleResponse);


  return () => {ipcRenderer.removeListener('student_balance_resp', handleResponse);clearInterval(countRef.current)};
},[]);
// ,[timer,isActive,classProfile]

  const runTimer = () => {
    dispatch({type:'resetBalance'})
    countRef.current = setInterval(() => {
      dispatch({type: 'runTimer'});
      if (PauseRef.current===true) {
      dispatch({type:'timeout'})
      }
      else {
      dispatch({type:'incrementGold'})
      }
    }, 1000)
    setActive(true)
  }
  const handlePunishment = (student_id:any) => {
    dispatch({type:'punishStudent',payload:student_id});
    setTimeout(() => {
    dispatch({type:'punishEnd',payload:student_id})
  },120000)
  }
  const handlePause = () => {
    console.log(state.student_roster)
    PauseRef.current=true;
    setTimeout(() => {
      PauseRef.current=false
    },120000)
  };

  const handleReset = () => {
    clearInterval(countRef.current);
    dispatch({type: 'endTimer'});
    setActive(false);
    clearTimeout(EndClassRef.current);
    PauseRef.current=false;
  }
  const initStop = () => {
    console.log("bye")
    EndClassRef.current = setTimeout(() => {
      console.log("timeout execeuted")
      clearInterval(countRef.current)
      dispatch({type: 'endTimer'})
      updateBalance(state.student_roster);
      setActive(false)
    },3000000)
  }
  const updateBalance = (props:any) => {
    ipcRenderer.send('student_balance', props);
  }

  const formatTime = (timer:any) => {
   const getSeconds = `0${(timer % 60)}`.slice(-2)
   const minutes:any = `${Math.floor(timer / 60)}`
   const getMinutes = `0${minutes % 60}`.slice(-2)
   const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

   return `${getHours} : ${getMinutes} : ${getSeconds}`
  }

  const formatGold = (gold:any) => {
  return Math.round(gold*100) /100;
  }

  return (
    <div className="App">
      <Navigation />
      <div className="Content">
      <h1> Ancient Civilization, Period {location.state.class_profile.period_no}</h1>
      {/*<h2> {formatTime(timer)}</h2>*/}
      {/*<h2>{duration}</h2>*/}
      <Container>
        <Row className="justify-content-md-center">
          <Card text='dark' body>
          <h2>{formatTime(state.timer)}</h2>
          </Card>
        </Row>
        <br />
        <Row className="justify-content-md-center">
        <Button onClick={() => {runTimer();initStop();}}>Start Class</Button>
        { (PauseRef.current || !isActive )?
        <Button variant="danger" onClick={handlePause} disabled>Time Out</Button> :
        <Button variant="danger" onClick={handlePause}>Time Out</Button>
        }
        <Button variant="secondary" onClick={handleShow}><FontAwesomeIcon icon="cog" /></Button>
        <Button onClick={handleReset}>Reset</Button>

        </Row>

        {/*
        <Button onClick={() => {handleStart();handleStop()}}>Start</Button>
        <Button onClick={handleReset} disabled={!isActive}>Reset</Button>
        <Button variant="secondary" onClick={handleShow}><FontAwesomeIcon icon="cog" /></Button>
        */}
      </Container>
      <br />
      <Container>
      <Row>
          {state.student_roster.map((item :any,idx : any) => (
            <Col
            key = {idx}
            >
            {PauseRef.current || state.student_roster.find((student:any) => { return student.student_id===item.student_id}).punishFlag ?
              <Figure key={item.student_id}>
                <Figure.Image
                  width={128}
                  height={128}
                  alt="img"
                  src={dead_array[idx]}
                  rounded />
                <Figure.Caption>
                  <h4>
                    {item.username}
                  </h4>
                  <h2>${formatGold(item.gold)}</h2>
                </Figure.Caption>
              </Figure> :
                <Figure key={item.student_id}>
                  <Figure.Image
                    width={128}
                    height={128}
                    alt="img"
                    src={idle_array[idx]}
                    rounded />
                  <Figure.Caption>
                    <h4>
                      {item.username}
                    </h4>
                    <h2>${formatGold(item.gold)}</h2>
                  </Figure.Caption>
                </Figure>
              }
                <Row className="justify-content-md-center">
                { (!isActive || PauseRef.current || state.student_roster.find((student:any) => { return student.student_id===item.student_id}).punishFlag) ?
                <>
                <Button disabled><FontAwesomeIcon icon="coins" /></Button>
                <Button variant='danger' disabled><FontAwesomeIcon icon="thumbs-down" /></Button>
                </>
                :
                <>
                <Button onClick={() => (dispatch({type:"rewardStudent",payload:item.student_id}))}><FontAwesomeIcon icon="coins" /></Button>
                <Button variant='danger' onClick={()=> handlePunishment(item.student_id)}><FontAwesomeIcon icon="thumbs-down" /></Button>
                </>
              }
                </Row>
            </Col>
          ))}
      </Row>
      </Container>

      <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Class Options
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Container>
              <Row>

                <Col>
                <h4>Reward Rate</h4>
                </Col>

                <Col>
                <Form.Control as="select" size="lg" value={duration} onChange={(event:any) => {setDuration(event.target.value)}} custom>
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                </Form.Control>
                </Col>
              </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleClose}>Close</Button>
            </Modal.Footer>
       </Modal>
    </div>
    </div>
  )
};


export default RosterPage;
