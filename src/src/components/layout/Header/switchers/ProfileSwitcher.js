import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Label, ListBox, ListBoxItem, Popover, Select } from 'react-aria-components'
import { Icon } from '$core-components'
import { useClickOutside } from '$themehooks'
import { t } from '$themelocalization'
import themeContext from '$ustoreinternal/services/themeContext'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { redirectToLegacy } from '$ustoreinternal/services/redirect'
import { CookiesManager, storefrontCookies } from '$ustoreinternal/services/cookies'
import { CART_MODE, getCartMode } from '$themeservices'
import { UStoreProvider } from '@ustore/core'
import SignIn from '../SignIn'
import SignOut from '../SignOut'
import { Slot } from '$core-components'
import './ProfileSwitcher.scss'

export const ProfileSwitcher = ({ currentUser, userOrdersSummary }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useClickOutside(containerRef, () => setIsOpen(false))

  useEffect(() => {
    if (isOpen) {
      containerRef.current.style.position = 'fixed'
      document.documentElement.style.overflow = ''
      document.documentElement.style.paddingRight = ''
    }
  }, [isOpen])

  const pendingApprovalOrderCount = (userOrdersSummary) ? userOrdersSummary.PendingApprovalOrderCount : null
  const items = getItemList({ userOrdersSummary, currentUser, pendingApprovalOrderCount })

  const onSelectionChange = (key) => {
    if (key === 'user_menu_top_slot' || key === 'user_menu_bottom_slot') {
      return
    }
    const { IsAnonymous, loginPage, pageTitle, additional } = items.find(item => item.id === key)
    if (IsAnonymous) {
      CookiesManager.deleteCookie(storefrontCookies.token)
      redirectToLegacy(createLink(IsAnonymous, loginPage, pageTitle, additional))
      return
    }
    navigate(createLink(IsAnonymous, loginPage, pageTitle, additional))
  }

  const topSlot = window.xmpie_uStore_widgets.instances.find(widget => widget.location === 'user_menu_top' )
  const bottomSlot = window.xmpie_uStore_widgets.instances.find(widget => widget.location === 'user_menu_bottom' )
  if (topSlot) {
    items.unshift({ id: 'user_menu_top_slot', value: 'user_menu_top_slot' })
  }
  if (bottomSlot) {
    items.push({ id: 'user_menu_bottom_slot', value: 'user_menu_bottom_slot' })
  }

  return (
    <Select className="profile-switcher" onSelectionChange={onSelectionChange} isOpen={isOpen} onOpenChange={setIsOpen}
            onBlur={(e) => e.target.parentNode.parentNode.querySelector('.button-secondary')?.focus()}>
      <Label>{t('ProfileDropDownMenuLabel')}</Label>
      <Button>
        <Icon name="user.svg" width="20px" height="20px" className="profile-icon"/>
        {
          pendingApprovalOrderCount > 0 &&
          <div className="pending-approval-notification-icon">
            <Icon name="profile-notification.svg" width="20px" height="20px" className="profile-icon"/>
          </div>
        }
      </Button>
      <Popover className="profile-switcher-popup" shouldCloseOnInteractOutside={() => false} ref={containerRef}>
        {
          currentUser.IsAnonymous
            ? <SignIn/>
            : <SignOut currentUser={currentUser}/>
        }
        <ListBox selectionMode="single" items={items}>
          {(item) => <ListBoxItem key={item.id} value={item.value}>
            {['user_menu_top_slot','user_menu_bottom_slot'].includes(item.id) ? <Slot name={item.id.replace(/_slot$/i,'')} /> : item.pageName}
          </ListBoxItem>}
        </ListBox>
      </Popover>
    </Select>
  )
}

function createLink (anonymous, loginURL, pageTitle, additional) {
  const { languageCode } = themeContext.get()
  const pageURL = urlGenerator.get({ page: pageTitle })

  if (anonymous) {
    return `${loginURL}&returnNGURL=/${encodeURIComponent(pageURL.slice(pageURL.indexOf(languageCode)))}${additional ? '?' + additional : ''}`
  }

  return `${pageURL}${additional ? '?' + additional : ''}`
}

function getItemList ({ userOrdersSummary, currentUser, pendingApprovalOrderCount }) {
  const { userID, storeID, securityToken, storeFriendlyID, languageCode } = themeContext.get()
  const { currentStore } = UStoreProvider.state.get()
  const tempUserId = userID && currentUser.ID === userID ? userID : currentUser.ID
  const isSingleList = getCartMode(currentStore) === CART_MODE.SingleList
  const rejectedOrderCount = userOrdersSummary?.RejectedOrderCount || 0
  const loginPage = `/logout.aspx?tempUserId=${tempUserId}&SecurityToken=${securityToken}&StoreGuid=${storeID}&storeid=${storeFriendlyID}&NgLanguageCode=${languageCode}&forceLogin=true&ShowRibbon=false&SignIn=true`
  const isUStoreConnectEnterprise = currentStore.Attributes.find(attr => attr.Name === 'HomepageToCart')?.Value === 'True'

  const baseItem = {
    IsAnonymous: currentUser.IsAnonymous,
    loginPage
  }

  return [
    !isSingleList && {
      id: 'my-orders',
      pageName: t('Profile.My_orders'),
      pageTitle: 'order-history',
      additional: 'filter=0',
      ...baseItem,
    },
    userOrdersSummary && currentUser.Roles.Shopper && {
      id: 'rejected-orders',
      pageName: t('Profile.Rejected_orders', { rejectedOrderCount }),
      pageTitle: 'order-history',
      additional: 'filter=2',
      ...baseItem,
    },
    userOrdersSummary && currentUser.Roles.Approver && {
      id: 'orders-to-approve',
      pageName: t('Profile.Orders_to_approve', { pendingApprovalOrderCount }),
      pageTitle: 'order-approval-list',
      ...baseItem,
    },
    {
      id: 'draft-orders',
      pageName: t('Profile.Draft_orders'),
      pageTitle: 'drafts',
      ...baseItem,
    },
    {
      id: 'recipient-list',
      pageName: t('Profile.Recipient_lists'),
      pageTitle: 'my-recipient-lists',
      ...baseItem,
    },
    !isUStoreConnectEnterprise && {
      id: 'addresses',
      pageName: t('Profile.Addresses'),
      pageTitle: 'addresses',
      ...baseItem,
    },
    !isUStoreConnectEnterprise && {
      id: 'personal-information',
      pageName: t('Profile.Personal_information'),
      pageTitle: 'personal-information',
      ...baseItem,
    }
  ].filter(Boolean).map(item => ({ ...item, value: item.id }))
}
