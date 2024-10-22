import { useCallback, useEffect, useRef, useState } from 'react'
import ImageLoader from './ImageLoader'
import { ReactComponent as LeftArrow } from '$assets/icons/dark_left_arrow.svg'
import { ReactComponent as RightArrow } from '$assets/icons/dark_right_arrow.svg'
import './MultiItemsCarousel.scss'

const INITIAL_ITEMS = 7

const getItemsPerSlide = (responsive) => {
  const { innerWidth } = window
  const breakpoints = Object
    .keys(responsive)
    .filter(width => width < innerWidth)
    .sort((a, b) => b - a)

  return breakpoints && breakpoints.length > 0 ? responsive[breakpoints[0]].items : INITIAL_ITEMS
}


const MultiItemsCarousel = (props) => {
  const {
    leftArrow = {
      width: 20, height: 40
    },
    rightArrow = {
      width: 20, height: 40
    },
    hideDisabledArrows = true,
    itemWidth = 64,
    itemHeight = 64,
    borderWidth = 6,
    marginBetween = 9,
    responsive = {
      1919: { items: 7 },
      1199: { items: 4 }
    },
    images = [],
    items = [],
    onItemHovered,
    onItemClicked,
    activeImage = -1,
    styles
  } = props

  const [carouselWidth, setCarouselWidth] = useState('0')
  const [activeIndex, setActiveIndex] = useState(0)
  const [children, setChildren] = useState([])
  const [leftPos, setLeftPos] = useState(borderWidth)
  const calculateLeftPos = useCallback(() => {
    if (activeIndex === 0) {
      setLeftPos(borderWidth)
    } else {
      const left = (itemWidth + marginBetween) * activeIndex - borderWidth
      setLeftPos(`-${left}`)
    }
  }, [activeIndex, borderWidth, itemWidth, marginBetween])

  useEffect(() => {
    const itemsPerSlide = getItemsPerSlide(responsive)
    const dif = activeImage - activeIndex

    if (dif === itemsPerSlide) {
      setActiveIndex(activeImage - itemsPerSlide + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImage, responsive])

  useEffect(() => {
    setActiveIndex(0)
  }, [children.length])

  useEffect(() => {
    setChildren(images && images.length ? images : items)
  }, [images, items])

  useEffect(() => {
    calculateLeftPos()
  }, [activeIndex, calculateLeftPos])

  const getHideArrows = () => {
    return (images && images.length <= getItemsPerSlide(responsive)) && (items && items.length <= getItemsPerSlide(responsive))
  }

  const calculateLeftPosCallbackRef = useRef(calculateLeftPos)
  const getHideArrowsCallbackRef  = useRef(getHideArrows)
  useEffect(() => {
    calculateLeftPosCallbackRef.current = calculateLeftPos
    getHideArrowsCallbackRef.current = getHideArrows
  });

  useEffect(() => {
    const calculateLeftPosCallback = e => calculateLeftPosCallbackRef.current(e);
    const getHideArrowsCallback = e => getHideArrowsCallbackRef.current(e);

    const calculateCarouselWidth = () => {
      setCarouselWidth(getHideArrowsCallback() ? '100%' : '80%')// `${itemWidth * itemsPerSlide + marginBetween * (itemsPerSlide - 1) + borderWidth * 2}px`)
    }

    const onResize = () => {
      setActiveIndex(0)
      calculateCarouselWidth()
      calculateLeftPosCallback()
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const calculateSlideTo = (length) => {
    const itemsPerSlide = getItemsPerSlide(responsive)
    const itemsLeft = length - itemsPerSlide - activeIndex

    const next = itemsLeft >= itemsPerSlide ? activeIndex + itemsPerSlide : activeIndex + itemsLeft
    const prev = activeIndex < itemsPerSlide ? 0 : activeIndex - itemsPerSlide

    return { next, prev }
  }

  const itemsPerSlide = getItemsPerSlide(responsive)

  const rightArrowDisabled = activeIndex + itemsPerSlide >= children.length
  const leftArrowDisabled = activeIndex === 0

  const { next, prev } = calculateSlideTo(children.length)

  if ((!images || !images.length) && (!items || !items.length)) {
    return null
  }

  return (
    <div style={styles} className="multi-carousel-container">
      {!getHideArrows() && <div
        style={{ width: leftArrow.width }}
        className={`multi-carousel-arrow left-arrow${leftArrowDisabled ? ' disabled' : ''}`}
      >
        {hideDisabledArrows && leftArrowDisabled ? null
          : <LeftArrow
            onClick={() => !leftArrowDisabled && setActiveIndex(prev)}
            name={leftArrow.svg}
            width={`${leftArrow.width}px`}
            height={`${leftArrow.height}px`}
          />
        }
      </div>}
      <div
        style={{
          width: carouselWidth,
          height: `${itemHeight + borderWidth * 2}px`
        }}
        className="multi-carousel-wrapper"
      >
        <div
          style={{ left: `${leftPos}px` }}
          className="multi-carousel"
        >
          {items && items.length
            ? items.map((item, i) => (
              <div
                onMouseOver={() => onItemHovered && onItemHovered(i)}
                onMouseLeave={() => onItemHovered && onItemHovered(-1)}
                onClick={() => onItemClicked && onItemClicked(i)}
                style={{ width: `${itemWidth}px`, height: `${itemHeight}px`, marginRight: `${marginBetween}px` }}
                className="multi-carousel-item-wrapper"
                key={`item_${i}`}
              >
                {item}
              </div>
            ))
            : images.map((image, i) => (
              <div
                onMouseOver={() => onItemHovered && onItemHovered(i)}
                onMouseLeave={() => onItemHovered && onItemHovered(-1)}
                onClick={() => onItemClicked && onItemClicked(i)}
                style={{ width: `${itemWidth}px`, height: `${itemHeight}px`, marginRight: `${marginBetween}px` }}
                className={`multi-carousel-item-wrapper${i === activeImage ? ' highlight-border' : ''}`}
                key={`image_${i}`}
              >
                <ImageLoader className="multi-carousel-image" src={image} />
              </div>
            ))}
        </div>
      </div>
      {!getHideArrows() && <div
        style={{ width: rightArrow.width }}
        className={`multi-carousel-arrow right-arrow${rightArrowDisabled ? ' disabled' : ''}`}
      >
        {hideDisabledArrows && rightArrowDisabled ? null
          : <RightArrow
            onClick={() => !rightArrowDisabled && setActiveIndex(next)}
            width={`${rightArrow.width}px`}
            height={`${rightArrow.height}px`}
          />
        }
      </div>}
    </div>
  )
}

export default MultiItemsCarousel
