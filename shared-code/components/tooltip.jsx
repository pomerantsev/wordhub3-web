import React from 'react';

export default class Tooltip extends React.Component {

  constructor () {
    super();

    this.state = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      tooltipHover: false
    };

    this.toggleRef = this.toggleRef.bind(this);
    this.tooltipRef = this.tooltipRef.bind(this);
    this.onToggleMouseEnter = this.onToggleMouseEnter.bind(this);
    this.onToggleMouseLeave = this.onToggleMouseLeave.bind(this);
    this.onToggleClick = this.onToggleClick.bind(this);
    this.onTooltipClick = this.onTooltipClick.bind(this);
    this.onBodyClick = this.onBodyClick.bind(this);
  }

  componentDidMount () {
    this.toggle.addEventListener('mouseenter', this.onToggleMouseEnter);
    this.toggle.addEventListener('mouseleave', this.onToggleMouseLeave);
    this.toggle.addEventListener('click', this.onToggleClick);
    this.tooltip.addEventListener('click', this.onTooltipClick);
    document.body.addEventListener('click', this.onBodyClick);
  }

  componentWillUnmount () {
    this.toggle.removeEventListener('mouseenter', this.onToggleMouseEnter);
    this.toggle.removeEventListener('mouseleave', this.onToggleMouseLeave);
    this.toggle.removeEventListener('click', this.onToggleClick);
    this.tooltip.removeEventListener('click', this.onTooltipClick);
    document.body.removeEventListener('click', this.onBodyClick);
  }

  toggleRef (element) {
    this.toggle = element;
  }

  tooltipRef (element) {
    this.tooltip = element;
  }

  onToggleMouseEnter () {
    this.setHintPosition();
    this.setState({
      tooltipHover: true
    });
  }

  onToggleMouseLeave () {
    this.setState({
      tooltipHover: false
    });
  }

  onToggleClick (event) {
    event.stopPropagation();
    this.setState({
      tooltipClicked: true
    });
  }

  onTooltipClick (event) {
    event.stopPropagation();
  }

  onBodyClick () {
    this.setState({
      tooltipClicked: false
    });
  }

  setHintPosition () {
    this.setState({
      left: this.toggle.offsetLeft,
      top: this.toggle.offsetTop,
      width: this.toggle.offsetWidth,
      height: this.toggle.offsetHeight
    });
  }

  render () {
    const {
      className,
      style
    } = this.props;
    return (
      <span>
        <span
            ref={this.toggleRef}
            className={className}
            style={style}>
          {this.props.children}
        </span>
        <div
            ref={this.tooltipRef}
            className="tooltip__tooltip"
            style={{
              display: this.state.tooltipHover || this.state.tooltipClicked ? 'block' : 'none',
              top: this.state.top + this.state.height,
              left: this.state.left + this.state.width / 2
            }}>
          <div
              className="tooltip__tooltip-arrow"
          />
          <div
              className="tooltip__tooltip-text">
            {this.props.text}
          </div>
        </div>
      </span>
    );
  }

}
