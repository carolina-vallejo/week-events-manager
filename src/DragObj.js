import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'

const boxSource = {
	beginDrag(props) {
		return {
			id: props.id,
		}
	},

	endDrag(props, monitor) {
		const item = monitor.getItem()
		const dropResult = monitor.getDropResult()

		if (dropResult) {

    var str = item.id.replace('dragobj-','');
    var dayId = parseInt(str.split('-')[0], 10);
    var evtId = parseInt(str.split('-')[1], 10);

			props.moveToTarget({
				evtId: evtId,
				dayId: dayId,
				targetDayId: dropResult.name
			});

			//console.log(`You dropped ${item.id} into ${dropResult.name}!`)
		}
	},
}
/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
	connectDragSource: connect.dragSource(),
	
	};
}

class Box extends Component {

	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		children: PropTypes.node.isRequired,
		id: PropTypes.string.isRequired,
	}

	render() {
		const { connectDragSource } = this.props
		const { children } = this.props

		return connectDragSource(
			<div>{children}</div>
		)
	}
}

export default DragSource(ItemTypes.BOX, boxSource, collect)(Box);