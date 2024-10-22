import React from 'react'
import { UStoreProvider } from '@ustore/core'
import { useNavigate, useParams } from 'react-router-dom'
import { t } from '$themelocalization'

import urlGenerator from '$ustoreinternal/services/urlGenerator'

const Slot = (props) => {
    const { name, data } = props
    const navigate = useNavigate()
    const { page } = useParams()

    return window.xmpie_uStore_widgets.instances
      .filter(widget => widget.location === name )
      .map((widget, index) => {
        const context = {
          page,
          slot: widget.name,
          place: index,
          data,
          navigate,
          urlGenerator,
          t,
        }
          const WidgetComponent = window[widget.name]?.default;
          const widgetConfig = Object.keys(window.uStoreWidgetsConfiguration).length && window.uStoreWidgetsConfiguration[widget.id]
            ? atob(window.uStoreWidgetsConfiguration[widget.id]).toString()
            : null

          return React.createElement(WidgetComponent, { key: widget.name, uStoreProvider: UStoreProvider, config: widgetConfig, context, ...props })
      })
};

Slot.defaultProps = {
  data: {},
}

export default Slot;