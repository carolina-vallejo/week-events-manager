import React, { Component } from 'react';
import './css/App.css';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import classNames from 'classnames';
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Target from './DropTarget'
import DragObj from './DragObj'

const moment=extendMoment(Moment);

class Button extends Component{
  render(){
    return(
      <button
        id={this.props.id}
        className='cal__remove-btn'
        onClick={this.props.onClick}>
        {'×'}
      </button>

    )
  }
}
class ValueInput extends Component{
  render(){
    return(
      <div 
        id={this.props.id}
        onClick={this.props.onClick}
        className={this.props.className}>
        {this.props.value}
      </div>  
    )
  }
}
class InputText extends Component{
  handleClick=(e)=> { 
     e.stopPropagation();
  }
  render(){
    return(
      <div 
        className='cal__input-wrap'>
        <span
          className='cal__tag'>
          {this.props.value}
        </span>
        <input 
          id={this.props.id}
          className={this.props.className}
          placeholder={this.props.placeholder}
          type='text' 
          onClick={this.handleClick}
          onKeyPress={this.props.onKeyPress}
        />
     
      </div>
    )
  }
}

class Event extends Component {
  handleClick=(e)=> { 
     e.stopPropagation();
  }  
  render(){
    return (
      <div
        id={this.props.id}
        className='cal__evt'
        onClick={this.handleClick}>
        {this.props.children}
      </div>
    );    
  }
} 
class Cell extends Component {
  render(){
    return (
        <div 
          onClick={this.props.onClick}
          className='cal__day'>
          <div
          className='cal__label'>
            {this.props.label}
          </div>
          {this.props.value}
        </div>
    );    
  }
} 

class App extends Component {
  constructor(props) {
    super(props)

    this.state={ 
      eventsByDay: Array(7).fill([]),
      actualDayEvt: {}
    };

    this.dateRange=moment.range(moment().startOf('week'), moment().endOf('week'));
    this.rangeArr=Array.from(this.dateRange.by('day'));
    this.counterEvts=0;
  }

  /*--- CREATE EVENT ---*/
  createEvt=(i)=> (e)=> {

    const days=this.state.eventsByDay.slice();
    const evts=days[i].slice();

    this.counterEvts++;

    evts.push({
      id: this.counterEvts,
      date:  this.rangeArr[i].format('YYYY-MM-DD'),
      hideInputName: false,
      hideStartTime: false,
      hideEndTime: false,

    })

    days[i]=evts;

    this.setState({
      eventsByDay: days,
    }); 

  } 

  handleKeyPress=(e)=> {

    if (e.key==='Enter') {

      const type=e.target.id.split('-')[1];
      const dayId=parseInt(e.target.id.split('-')[2],10);
      const evtId=parseInt(e.target.id.split('-')[3],10); 

      const days=this.state.eventsByDay.slice();
      const evt=days[dayId][evtId];

      if(type==='name'){
        evt.name=e.target.value;
        evt.hideInputName=true;
       
      }else if(type==='stime'){
        evt.startTime=e.target.value;
        evt.hideStartTime=true;

      }else {
        evt.endTime=e.target.value;
        evt.hideEndTime=true;
      }

      days[dayId][evtId]=evt;

      this.setState({
        eventsByDay: days,
      }); 
    
    }
  }  

  removeEvt=(e)=> {

    const str=e.target.id.replace('btn-','');
    const dayId=str.split('-')[0];
    const evtId=str.split('-')[1];

    const days=this.state.eventsByDay.slice();
    days[dayId].splice(evtId, 1);

    this.setState({
      eventsByDay: days,
    });

  }     
  editEvt=(e)=> {
   
    const type=e.target.id.split('-')[1];
    const dayId=parseInt(e.target.id.split('-')[2],10);
    const evtId=parseInt(e.target.id.split('-')[3],10);     
    
    const days=this.state.eventsByDay.slice();
    const evt=days[dayId][evtId];

    if(type==='name'){
      evt.name='';
      evt.hideInputName=false;
     
    }else if(type==='stime'){
      evt.startTime='';
      evt.hideStartTime=false;

    }else {
      evt.endTime='';
      evt.hideEndTime=false;
    }

    days[dayId][evtId]=evt;

    this.setState({
      eventsByDay: days,
    });
  }    

  moveToTarget=(opt)=>{    
    const allDays=this.state.eventsByDay.slice();

    const evtDay=allDays[opt.dayId].slice();
    const dragObj=evtDay.splice(opt.evtId, 1);
    
    dragObj[0].date=this.rangeArr[opt.targetDayId].format('YYYY-MM-DD');
    allDays[opt.dayId]=evtDay;
    
    const evtTargetDay=allDays[opt.targetDayId].slice();
    evtTargetDay.push(dragObj[0]);

   
    allDays[opt.targetDayId]=evtTargetDay;

    this.setState({
      eventsByDay: allDays,
    });      


  }

  renderEvent(opt){
    var evt=this.state.eventsByDay[opt.dayId][opt.evtId];
    return (

      <DragObj
        id={`dragobj-${opt.dayId}-${opt.evtId}`} 
        key={`evt-${opt.dayId}-${opt.evtId}`} 
        moveToTarget={this.moveToTarget}
        children={
          <Event
            children={
              <div className='cal__input-group'>
                <Button
                  id={`btn-${opt.dayId}-${opt.evtId}`} 
                  onClick={this.removeEvt}
                />          
                <div className='cal__datelabel'>{evt.date}</div>
                <InputText 
                  id={`input-name-${opt.dayId}-${opt.evtId}`} 
                  placeholder='Enter name'
                  value='Event'
                  className={
                    classNames('cal__input', {hide: evt.hideInputName})
                  }
                  onKeyPress={this.handleKeyPress}
                />
                <ValueInput
                  id={`value-name-${opt.dayId}-${opt.evtId}`} 
                  className={classNames('cal__input-label', 'cal__input-label_name')}
                  onClick={this.editEvt}
                  value={evt.name}
                />
                <InputText 
                  id={`input-stime-${opt.dayId}-${opt.evtId}`} 
                  placeholder='Enter time'
                  value='Start Time'
                  className={
                    classNames('cal__input', {hide: evt.hideStartTime})
                  }              
                  onKeyPress={this.handleKeyPress}
                  />
                <ValueInput
                  id={`value-stime-${opt.dayId}-${opt.evtId}`} 
                  className='cal__input-label'
                  onClick={this.editEvt}
                  value={evt.startTime}
                />
                <InputText 
                  id={`input-etime-${opt.dayId}-${opt.evtId}`} 
                  placeholder='Enter time'
                  value='End Time'
                  className={
                    classNames('cal__input', {hide: evt.hideEndTime})
                  }              
                  onKeyPress={this.handleKeyPress}
                  /> 
                <ValueInput
                  id={`value-etime-${opt.dayId}-${opt.evtId}`} 
                  className='cal__input-label'
                  onClick={this.editEvt}
                  value={evt.endTime}
                />                           
              </div>
            }
          />
        }
      />
    );    
  }

  renderCell(opt){
    return (
      <Cell 
        onClick={this.createEvt(opt.dayId)}
        key={'cell' + opt.dayId.toString()}  
        label={this.rangeArr[opt.dayId].format('dddd DD')}     
        value={
          <Target
            name={opt.dayId} 
            children={
              opt.item.map((item, i)=>{
                return(
                  this.renderEvent({
                    dayId: opt.dayId,
                    evtId: i
                  })
                )
              })
            }
          />          
        }     
      />        
    );    
  }

  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className='cal'>
          <h1 className='cal__title'> weekly event calendar</h1>
          <div className='cal__wrapper'>
            {
            this.state.eventsByDay.map((item, i)=>{
              return (
                this.renderCell({
                    dayId: i,
                    item: item
                  })
                )
              })
            }
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default App;

