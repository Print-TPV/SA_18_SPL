import React from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, ModalBody } from 'reactstrap'
import { t,mt } from '$themelocalization'
import { LoadingDots, Icon } from '$core-components'
import './DuplicateProgressDialog.scss'
import {activityMonitor, ActivityStatus, ActivityType } from '$themeservices'

const CLOSE_DIALOG_TIMEOUT = 2000

const DuplicateProgressDialog = ({ model }) => {

  let showDuplicateDialog = false
  let hasFailed = false
  let hasPartialFailed = false
  let hasSuccess = false
  let selectedActivity = null

  const closeDialog = (activityId) => {
    activityMonitor.clearActivities()
    model.reloadAfterDuplicate(activityId)
  }

  for (const activity in model?.activities) {
    selectedActivity = model.activities[activity].activity
    showDuplicateDialog = !!selectedActivity?.Status

    hasPartialFailed = selectedActivity?.Status === ActivityStatus.PartiallyFailed
    hasFailed = selectedActivity?.Status === ActivityStatus.Failed || hasPartialFailed
    hasSuccess = selectedActivity?.Status === ActivityStatus.Success

    if (hasSuccess) {
      break
    }
  }

  if (hasSuccess) {
    setTimeout(() => closeDialog(selectedActivity?.ActivityID), CLOSE_DIALOG_TIMEOUT)
  }

  return (
    <Modal isOpen={showDuplicateDialog} className="cart-ng-duplicate-progress-dialog"
           modalClassName="duplicate-progress-dialog-container" backdropClassName="duplicate-progress-modal-backdrop"
           wrapClassName="cart-ng-duplicate-progress-dialog-wrapper">
      {hasFailed &&
        <button className="cart-ng-duplicate-process-close" onClick={() => closeDialog(selectedActivity?.ActivityID)}>
          <Icon name="close_black.svg" width="14px" height="14px"/>
        </button>
      }
      <ModalBody className="dialog-content">
       <Progress selectedActivity={selectedActivity}/>
        <Success selectedActivity={selectedActivity}/>
        <Failed selectedActivity={selectedActivity}/>
      </ModalBody>
    </Modal>
  )
}

export default observer(DuplicateProgressDialog)

function Progress ({ selectedActivity }) {
  if (selectedActivity?.Status !== ActivityStatus.Progress) {
    return null
  }
  const typeToMessage = {
    [ActivityType.OrderItemDuplication]: 'Cart.Dialog.DuplicateInProgress.DuplicatingItemPleaseWait',
    [ActivityType.KitOrderItemDuplication]: 'Cart.Dialog.DuplicateInProgress.DuplicatingKitItemProgress',
    [ActivityType.CartListDuplication]: 'Cart.Dialog.DuplicateInProgress.DuplicatingKitItemProgress',
    [ActivityType.OrderReordering]: 'Cart.Dialog.DuplicateInProgress.ReorderingOrderProgress',
    [ActivityType.KitOrderItemReordering]: 'Cart.Dialog.DuplicateInProgress.ReorderingOrderProgress',
    [ActivityType.OrderItemReordering]: 'Cart.Dialog.DuplicateInProgress.DuplicatingItemPleaseWait'
  }

  if (!typeToMessage[selectedActivity?.Type]) {
    return null
  }
  return (
    <div className="cart-ng-duplicate-progress">
      <HourGlass/>
      <div className="dialog-text">
        {mt(typeToMessage[selectedActivity?.Type], {
          name: selectedActivity?.Name,
          num: selectedActivity?.Progress || 1,
          total: selectedActivity?.Total
        })}
      </div>
      <div>
        <LoadingDots className="loading-dots"/>
      </div>
    </div>
  )
}


function Success ({ selectedActivity }) {
  if (selectedActivity?.Status !== ActivityStatus.Success) {
    return null
  }

  const typeToMessage = {
    [ActivityType.OrderItemDuplication]: ['Cart.Dialog.DuplicateSuccess.Duplicating','Cart.Dialog.DuplicateSuccess.DuplicatedSuccessfully' ],
    [ActivityType.KitOrderItemDuplication]: ['Cart.Dialog.DuplicateSuccess.Duplicating','Cart.Dialog.DuplicateSuccess.DuplicatedSuccessfully'],
    [ActivityType.CartListDuplication]: ['Cart.Dialog.DuplicateSuccess.Duplicating','Cart.Dialog.DuplicateSuccess.DuplicatedSuccessfully'],
    [ActivityType.KitOrderItemReordering]: ['Cart.Dialog.DuplicateSuccess.ReorderingOrderCompleted','Cart.Dialog.DuplicateSuccess.ReorderingOrderSuccessfully'],
    [ActivityType.OrderReordering]: ['Cart.Dialog.DuplicateSuccess.ReorderingOrderCompleted', 'Cart.Dialog.DuplicateSuccess.ReorderingOrderSuccessfully'],
    [ActivityType.OrderItemReordering]: ['Cart.Dialog.DuplicateSuccess.ReorderingOrderCompleted', 'Cart.Dialog.DuplicateSuccess.ReorderingOrderSuccessfully']
  }

  return <div className="cart-ng-duplicate-success">
    <Icon name="success.svg" height="30px" width="33px" wrapperClassName="cart-ng-duplicate-success-icon"/>
    <div className="dialog-text">
      <div>{mt(typeToMessage[selectedActivity?.Type][0], { name: selectedActivity?.Name })}</div>
      <div className="success-text"> {mt(typeToMessage[selectedActivity?.Type][1], { name: selectedActivity?.Name })}</div>
    </div>
  </div>
}


function Failed ({ selectedActivity }) {
  if (![ActivityStatus.Failed,ActivityStatus.PartiallyFailed].includes(selectedActivity?.Status)){
    return null
  }

  let hasPartialFailed = selectedActivity?.Status === ActivityStatus.PartiallyFailed
  const typeToMessage = {
    [ActivityType.OrderItemDuplication]: ['Cart.Dialog.DuplicateSuccess.Duplicating','Cart.Dialog.DuplicateFailed.DuplicationFailed'],
    [ActivityType.KitOrderItemDuplication]: ['Cart.Dialog.DuplicateSuccess.Duplicating', 'Cart.Dialog.DuplicateFailed.DuplicationFailed'],
    [ActivityType.CartListDuplication]: ['Cart.Dialog.DuplicateSuccess.Duplicating','Cart.Dialog.DuplicateFailed.DuplicationFailed', 'Cart.Dialog.DuplicateFailed.SomeItemsCouldNotDuplicate'],
    [ActivityType.KitOrderItemReordering]: ['Cart.Dialog.DuplicateFailed.ReorderingOrder','Cart.Dialog.DuplicateFailed.ReorderingOrder'],
    [ActivityType.OrderReordering]: ['Cart.Dialog.DuplicateFailed.ReorderingOrder','Cart.Dialog.DuplicateFailed.ReorderingOrder'],
    [ActivityType.OrderItemReordering]: ['Cart.Dialog.DuplicateFailed.ReorderingOrder', 'Cart.Dialog.DuplicateFailed.ReorderingOrder']

  }

  return <div className="cart-ng-duplicate-failed">
    <Icon name="warning.svg" height="30px" width="33px"
          wrapperClassName={`cart-ng-duplicate-${hasPartialFailed ? 'partial-failed' : 'failed'}-icon `}/>
    <div className="dialog-text">
      <div>{t(typeToMessage[selectedActivity?.Type][0], { name: selectedActivity?.Name })}</div>
      {hasPartialFailed ?
        <div className="partial-failed-text">
          {mt(typeToMessage[selectedActivity?.Type][2], {
            num: selectedActivity?.Output?.CompletedCount,
            total: selectedActivity?.Total
          })}</div> :
        <div className="failed-text"> {mt(typeToMessage[selectedActivity?.Type][1])}</div>}
    </div>
  </div>
}

function HourGlass () {
  return (<div className="hour-glass-icon">
    <svg width="44px" height="70px" viewBox="0 0 44 70" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>Icon button/20px/process</title>
      <g id="Icon-button/20px/process" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"
         opacity="0.588438488">
        <g id="hourglass" transform="translate(0.000000, 0.000000)" fill="#000000" fillRule="nonzero">
          <path
            d="M40.8332422,0 L3.5,0 C1.57035156,0 0,1.57035156 0,3.5 C0,5.42964844 1.57035156,7 3.5,7 L40.8333789,7 C42.7630273,7 44.3333789,5.42964844 44.3333789,3.5 C44.3333789,1.57035156 42.7628906,0 40.8332422,0 Z M40.8332422,4.66662109 L3.5,4.66662109 C2.85714844,4.66662109 2.33337891,4.14394531 2.33337891,3.5 C2.33337891,2.85605469 2.85714844,2.33337891 3.5,2.33337891 L40.8333789,2.33337891 C41.4762305,2.33337891 42,2.85605469 42,3.5 C42,4.14394531 41.4760938,4.66662109 40.8332422,4.66662109 Z" id="Shape"></path>
          <path d="M40.8332422,63 L3.5,63 C1.57035156,63 0,64.5703516 0,66.5 C0,68.4296484 1.57035156,70 3.5,70 L40.8333789,70 C42.7630273,70 44.3333789,68.4296484 44.3333789,66.5 C44.3333789,64.5703516 42.7628906,63 40.8332422,63 Z M40.8332422,67.6666211 L3.5,67.6666211 C2.85714844,67.6666211 2.33337891,67.1439453 2.33337891,66.5 C2.33337891,65.8560547 2.85714844,65.3333789 3.5,65.3333789 L40.8333789,65.3333789 C41.4762305,65.3333789 42,65.8560547 42,66.5 C42,67.1439453 41.4760938,67.6666211 40.8332422,67.6666211 Z" id="Shape"></path>
          <path d="M30.4803516,30.6692969 C36.4046484,24.745 39.6666211,16.8687695 39.6666211,8.49214844 L39.6666211,5.83337891 C39.6666211,5.18820313 39.1439453,4.66675781 38.5,4.66675781 L5.83324219,4.66675781 C5.18929688,4.66675781 4.66662109,5.18820313 4.66662109,5.83337891 L4.66662109,8.49214844 C4.66662109,16.87 7.92859375,24.745 13.8517969,30.6692969 L15.0242969,31.8417969 C15.8560938,32.6735938 16.3332422,33.8239453 16.3332422,35 C16.3332422,36.1760547 15.8560938,37.3264062 15.0253906,38.1582031 L13.8528906,39.3307031 C7.92859375,45.255 4.66662109,53.13 4.66662109,61.5078516 L4.66662109,64.1666211 C4.66662109,64.8117969 5.18929688,65.3332422 5.83324219,65.3332422 L38.4998633,65.3332422 C39.1438086,65.3332422 39.6666211,64.8117969 39.6666211,64.1666211 L39.6666211,61.5078516 C39.6666211,53.1312305 36.4045117,45.255 30.4802148,39.3307031 L29.3077148,38.1582031 C28.4641602,37.3146484 27.9998633,36.1935547 27.9998633,35 C27.9998633,33.8064453 28.4641602,32.6853516 29.3077148,31.8417969 L30.4803516,30.6692969 Z M27.6580664,30.1921484 C26.3735938,31.4755273 25.6666211,33.1823242 25.6666211,35 C25.6666211,36.8176758 26.3735938,38.5244727 27.6580664,39.8078516 L28.8305664,40.9803516 C34.3139453,46.4637305 37.3333789,53.7541211 37.3333789,61.5078516 L37.3333789,63 L7,63 L7,61.5078516 C7,53.7530273 10.0192969,46.4637305 15.5014453,40.9803516 L16.6739453,39.8078516 C17.9596484,38.5244727 18.6666211,36.8164453 18.6666211,35 C18.6666211,33.1835547 17.9596484,31.4755273 16.6751758,30.1921484 L15.5026758,29.0196484 C10.0192969,23.5362695 7,16.2457422 7,8.49214844 L7,7 L37.3333789,7 L37.3333789,8.49214844 C37.3333789,16.2458789 34.314082,23.5362695 28.8307031,29.0196484 L27.6580664,30.1921484 Z" id="Shape"></path>
          <path d="M32.0260938,19.6548242 C31.9082422,19.3585547 31.5069727,18.6666211 30.3332422,18.6666211 C24.2712695,18.6666211 21.5703906,17.3680664 20.4993359,16.593418 C19.163457,15.6262695 17.4496875,15.3730664 15.9107813,15.9178906 C14.4420117,16.4370117 13.3663086,17.5920117 12.9614844,19.0853906 C12.8564844,19.4739453 12.8377539,19.725918 12.8377539,19.725918 C12.8202539,19.9557422 12.8704297,20.2042969 12.9836328,20.4060938 C14.0768359,22.3439453 15.3379297,24.3878906 17.1532813,26.2032422 L18.3245508,27.3757422 C20.0500781,29.0989453 20.9997266,31.3925391 20.9997266,33.8332422 C20.9997266,34.478418 21.5224023,34.9998633 22.1663477,34.9998633 C22.810293,34.9998633 23.3329688,34.478418 23.3329688,33.8332422 C23.3329688,31.3937695 24.2826172,29.1000391 26.0069141,27.3757422 L27.1806445,26.2020117 C27.4688477,25.9150391 27.8444141,25.5603906 28.2574414,25.1730664 C31.2735938,22.3369727 32.5417969,20.9567969 32.0260938,19.6548242 Z M26.6571484,23.4733789 C26.2255273,23.8805273 25.8310938,24.251582 25.5301758,24.5525 L24.3564453,25.7262305 C23.45,26.631582 22.715,27.6628516 22.1653906,28.7805273 C21.615918,27.6628516 20.880918,26.631582 19.9743359,25.7262305 L18.8029297,24.5537305 C17.3702539,23.1199609 16.3214844,21.5414063 15.2306055,19.6385547 C15.5188086,18.6644336 16.2654297,18.2676758 16.6889844,18.1171484 C17.5032813,17.8289453 18.4168359,17.9655273 19.1307813,18.4835547 C20.6170508,19.5592578 23.5477539,20.8273242 29.1618359,20.9837305 C28.440918,21.7957031 27.3092969,22.8608789 26.6571484,23.4733789 Z" id="Shape"></path>
          <path d="M34.9194727,59.4089453 C34.6266211,55.6266211 33.11,54.0562695 31.3553516,52.2362695 C31.1185547,51.9900391 30.8712305,51.7346484 30.6180273,51.4639453 C29.1526758,49.8982422 27.0830273,49 24.9375,49 L19.3946484,49 C17.2503516,49 15.1794727,49.8983789 13.7141211,51.4639453 C13.460918,51.7346484 13.2148242,51.9889453 12.9778906,52.2351758 C11.2220117,54.0551758 9.70539063,55.6266211 9.41376953,59.4101758 C9.38806641,59.7344727 9.50003906,60.0541211 9.72056641,60.2933789 C9.9421875,60.5314063 10.2514453,60.6667578 10.5768359,60.6667578 L33.7561328,60.6667578 C34.0804297,60.6667578 34.3907813,60.5314063 34.6124023,60.2922852 C34.8330664,60.0530273 34.9439453,59.7321484 34.9194727,59.4089453 Z M11.9057422,58.3333789 C12.3012695,56.2964063 13.2439453,55.3210547 14.6578906,53.8557031 C14.9028906,53.6014063 15.1571875,53.336582 15.4185938,53.0576758 C16.4441211,51.9610547 17.8930664,51.3333789 19.3946484,51.3333789 L24.9375,51.3333789 C26.4401758,51.3333789 27.8891211,51.9621484 28.9146484,53.056582 C29.1771484,53.3389063 29.4314453,53.6014063 29.6776758,53.8569336 C31.0905273,55.3222852 32.0319727,56.2976367 32.4287305,58.3333789 L11.9057422,58.3333789 Z" id="Shape"></path>
          <path d="M22.1316211,37.3333789 C21.4876758,37.3333789 20.965,37.8548242 20.965,38.5 L20.965,39.6666211 C20.965,40.3117969 21.4876758,40.8332422 22.1316211,40.8332422 C22.7755664,40.8332422 23.2982422,40.3117969 23.2982422,39.6666211 L23.2982422,38.5 C23.2982422,37.8548242 22.7755664,37.3333789 22.1316211,37.3333789 Z" id="Path"></path>
          <path d="M22.1316211,43.1666211 C21.4876758,43.1666211 20.965,43.6880664 20.965,44.3332422 L20.965,45.4998633 C20.965,46.1450391 21.4876758,46.6664844 22.1316211,46.6664844 C22.7755664,46.6664844 23.2982422,46.1450391 23.2982422,45.4998633 L23.2982422,44.3332422 C23.2982422,43.6882031 22.7755664,43.1666211 22.1316211,43.1666211 Z" id="Path"></path>
        </g>
      </g>
    </svg>
  </div>)
}
