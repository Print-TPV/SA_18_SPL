import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Popover, PopoverBody } from 'reactstrap'
import NavigationMenu from './NavigationMenu'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { decodeStringForURL } from '$ustoreinternal/services/utils'
import { t } from '$themelocalization'
import './CategoriesNavbar.scss'

const CategoriesNavbar = ({ categoriesTree }) => {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (!(categoriesTree && categoriesTree.length > 0)) {
    return null
  }

  const onMouseEnter = (category, target) => {
    queueMicrotask(() => {
      setSelectedCategory(category)
      setHoveredItem(document.getElementById(`id-${category}`))
    })
  }

  const onMouseLeave = () => {
    setSelectedCategory(null)
    setHoveredItem(null)
  }

  return (<div className="categories-navbar">
    <div className="category-title-wrapper view-show-all" onMouseEnter={(e) => onMouseEnter(0, e.target)} onMouseLeave={onMouseLeave}>
          <span className={`category-title ${selectedCategory === 0 ? 'highlight' : ''}`} id="id-0">
            {t('Header.All_Categories')}
          </span>
      <span className="category-spacer"></span>
      {
        hoveredItem && selectedCategory === 0 &&
        <Popover className="" fade={false} isOpen={true} placement="bottom-start"
                 target={hoveredItem} container={hoveredItem} popperClassName="categories-navbar-popper">
          <PopoverBody>
            <NavigationMenu categoriesTree={categoriesTree} viewShowAll={true} selectedCategory={null}/>
          </PopoverBody>
        </Popover>
      }
    </div>
    {
      categoriesTree.map(({ Category, SubCategories }, i) => {
        const { FriendlyID, Name } = Category
        return <Link className="category-title-wrapper"
                     onMouseEnter={(e) => onMouseEnter(FriendlyID)}
                     onMouseLeave={onMouseLeave}
                     key={i}
                     to={urlGenerator.get({ page: 'category', id: FriendlyID, name: decodeStringForURL(Name) })}>
                <span className={`category-title ${selectedCategory === FriendlyID ? 'highlight' : ''}`}
                      key={i} id={`id-${FriendlyID}`}>
                  <span className="link" key={i} dangerouslySetInnerHTML={{ __html: Name }}/>
                </span>
          {
            hoveredItem && selectedCategory === FriendlyID && SubCategories?.length > 0 &&
            <Popover fade={false} isOpen={true} placement="bottom-start"
                     target={hoveredItem} container={document.body} popperClassName="categories-navbar-popper">
              <PopoverBody>
                <NavigationMenu categoriesTree={categoriesTree} viewShowAll={false} selectedCategory={Category}/>
              </PopoverBody>
            </Popover>
          }
        </Link>
      })
    }
  </div>)
}

export default CategoriesNavbar
