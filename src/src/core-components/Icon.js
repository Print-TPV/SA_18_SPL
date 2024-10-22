import React, {useEffect} from 'react'

export const Icon = ({ name, width, height, size, wrapperClassName, className, title, ...args }) => {
  const [importedIcon, setImportedIcon] = React.useState(null)
  const w = width || size
  const h = height || size

  useEffect(() => {
    const setCssClass = () => {
      // adding className to all <g> and <path> nodes under svg to allow stroke coloring
      if (document.querySelectorAll(`svg.${className}`).length) {
        document.querySelectorAll(`svg.${className}`).forEach((svg) => {
          svg.querySelectorAll('g').forEach((element) =>
              element.classList.add(className)
          )
          svg.querySelectorAll('path').forEach((element) =>
              element.classList.add(className)
          )
        })
      }
    }

    const importIcon = async () => {
      const { ReactComponent } = await import(`$assets/icons/${name}`)
      setImportedIcon(<ReactComponent width={w} height={h} className={className} title={title} {...args} />)
    }
    importIcon()
    setCssClass()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, width, height, className, title])

  if (!name || (!size && (!height || !width))) {
    return null
  }

  return (
    <div
        className={`icon icon-holder${wrapperClassName ? ` ${wrapperClassName}` : ''}`}
        style={{ width: `${w}`, height: `${h}`, 'backgroundSize': `${w} ${h}` }}
    >
        {importedIcon ? importedIcon : null}
    </div>
  )
}

export default Icon
