import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import classNames from 'classnames';

const boxTarget = {
	drop(props) {
		return { 
			name: props.name 
		}
	},
}
function collect(connect, monitor) {
	return{
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),		
	}
}

class Target extends Component {
	static propTypes = {
		connectDropTarget: PropTypes.func.isRequired,
		children: PropTypes.node.isRequired,
		isOver: PropTypes.bool.isRequired,
		canDrop: PropTypes.bool.isRequired
	}

	render() {
		const { canDrop, isOver, connectDropTarget } = this.props
		const { children } = this.props

		const isActive = canDrop && isOver

		return connectDropTarget(
			<div 
			className={
				classNames(
					'cal__target', 
					{cal__target_candrop: isActive})
			}>
				{children}
			</div>,
		)
	}
}

export default DropTarget(ItemTypes.BOX, boxTarget, collect)(Target);
