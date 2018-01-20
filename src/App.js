import React, { Component } from 'react';
import './css/App.css';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const moment=extendMoment(Moment);

class Button extends Component{
  render(){
    return(
      <button
        onClick={(e) => this.props.onClick(e)}
        className={this.props.className}>
        {this.props.value}
      </button>

    )
  }
}
class ValueInput extends Component{
  render(){
    return(
      <div 
        onClick={(e) => this.props.onClick(e)}
        className={this.props.className}>
        {this.props.value}
      </div>  
    )
  }
}
class InputText extends Component{
  handleClick=(e) => { 
     e.stopPropagation();
  }
  render(){
    return(
      <div className='cal__input-wrap'>
        <span
          className='cal__tag'>
          {this.props.value}
        </span>
        <input 
          className={this.props.className}
          placeholder={this.props.placeholder}
          type="text" 
          onClick={this.handleClick}
          onKeyPress={(e) => this.props.onKeyPress(e)}
        />
     
      </div>
    )
  }
}

class Event extends Component {
  handleClick=(e) => { 
     e.stopPropagation();
  }  
  render(){
    return (
      <div 
        className="cal__evt"
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
          onClick={ (e) => this.props.onClick(e) }
          className="cal__day">
          <div
          className="cal__label">
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
      eventsByDay: Array(7).fill([])
    };
    //this.handleChange=this.handleChange.bind(this);

    this.dateRange=moment.range(moment().startOf('week'), moment().endOf('week'));
    this.rangeArr=Array.from(this.dateRange.by('day'));
    
  }

  createEvt=(i) => (e) => {

    const days=this.state.eventsByDay.slice();
    const evts=days[i].slice();

    evts.push({
      date:  this.rangeArr[i].format('YYYY-MM-DD'),
      hideInputName: false,
      hideStartTime: false,
      hideEndTime: false
    })

    days[i]=evts;

    this.setState({
      eventsByDay: days,
    }); 

  } 


  handleKeyPress=(opt) => (e) => {
    if (e.key === 'Enter') {

      const days=this.state.eventsByDay.slice();
      var evt=days[opt.dayId][opt.evtId];

      if(opt.type ==='name'){
        evt.name=e.target.value;
        evt.hideInputName=true;
       
      }else if(opt.type === 'startTime'){
        evt.startTime=e.target.value;
        evt.hideStartTime=true;

      }else {
        evt.endTime=e.target.value;
        evt.hideEndTime=true;
      }

      days[opt.dayId][opt.evtId]= evt;

      this.setState({
        eventsByDay: days,
      }); 
    
    }
  }  

  removeEvt=(opt) => (e) => {

    const days=this.state.eventsByDay.slice();
    days[opt.dayId].splice(opt.dayEvt, 1);

    this.setState({
      eventsByDay: days,
    });

  }     
  editEvt=(opt) => (e) => {

    const days=this.state.eventsByDay.slice();
    var evt=days[opt.dayId][opt.evtId];

    if(opt.type ==='name'){
      evt.name='';
      evt.hideInputName=false;
     
    }else if(opt.type === 'startTime'){
      evt.startTime='';
      evt.hideStartTime=false;

    }else {
      evt.endTime='';
      evt.hideEndTime=false;
    }

    days[opt.dayId][opt.evtId]= evt;

    this.setState({
      eventsByDay: days,
    });
  }    

  renderEvent(opt){
    var evt=this.state.eventsByDay[opt.dayId][opt.evtId];

    return (
      <Event
        key={'evt' + opt.evtId.toString()}  
        children={
          <div className='cal__input-group'>
            <Button
              value="×"
              className='cal__remove-btn'
              onClick={this.removeEvt({
                dayId: opt.dayId, 
                evtId: opt.evtId
              })}
            />          
            
            <div className='cal__datelabel'>{evt.date}</div>

            <InputText 
              placeholder="Enter name"
              value="Event"
              className={
                classNames('cal__input', {hide: evt.hideInputName})
              }
              onKeyPress={this.handleKeyPress({
                dayId: opt.dayId, 
                evtId: opt.evtId,
                type: 'name'
              })}
            />
            
            <ValueInput
              className={classNames('cal__inputLabel', 'cal__inputLabel_name')}
              onClick={this.editEvt({
                dayId: opt.dayId, 
                evtId: opt.evtId,
                type: 'name'
              })}
              value={evt.name}
            />


            <InputText 
              placeholder="Enter time"
              value="Start Time"
              classLabel='cal__inputLabel'
              className={
                classNames('cal__input', {hide: evt.hideStartTime})
              }              
              onKeyPress={this.handleKeyPress({
                dayId : opt.dayId, 
                evtId: opt.evtId,
                type: 'startTime'
              })}
              />

            <ValueInput
              className='cal__inputLabel'
              onClick={this.editEvt({
                dayId: opt.dayId, 
                evtId: opt.evtId,
                type: 'startTime'
              })}
              value={evt.startTime}
            />

            <InputText 
              placeholder="Enter time"
              value="End Time"
              className={
                classNames('cal__input', {hide: evt.hideEndTime})
              }              
              onKeyPress={this.handleKeyPress({
                dayId : opt.dayId, 
                evtId: opt.evtId,
                type: 'endTime'
              })}
              /> 
            <ValueInput
              className='cal__inputLabel'
              onClick={this.editEvt({
                dayId: opt.dayId, 
                evtId: opt.evtId,
                type: 'endTime'
              })}
              value={evt.endTime}
            />                           
          </div>
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
    );    
  }

  render() {
    return (
      <div>
        <div className="cal">
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
    );
  }
}

export default App;
