import { useRef } from 'react'
import './Tooltip.scss'

const Tooltip = (props) => {
  const { text, className, placement, arrow, maxLine, forceTooltip } = props
  const elementRef = useRef()
  const titleRef = useRef()

  const isTargetElement = elementRef.current && (titleRef.current.offsetHeight < titleRef.current.scrollHeight)

  return (
    <div
      ref={elementRef}
      className={`defaultStylesTooltip ${className} placement-${placement}`}
    >
      <div className={`tooltip-title lines-${maxLine}`} ref={titleRef} dangerouslySetInnerHTML={ { __html: text } }/>
      {(isTargetElement || forceTooltip) && <div className='tooltip-text' ref={elementRef}>
        <span className={`arrow-${arrow}`}/>
        <span dangerouslySetInnerHTML={{ __html: text}}/>
      </div>}
    </div>
  )
}

Tooltip.defaultProps = {
  text: '',
  className: '',
  placement: 'top',
  arrow: true,
  maxLine: 2
}

export default Tooltip
