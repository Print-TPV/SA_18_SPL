import React, { useEffect, useState } from 'react'
import './LoadingDots.scss'
import { CookiesManager } from '$ustoreinternal/services/cookies'

const LoadingDots = ({className, overrideCss}) => {
  const [classNameOverride, setClassNameOverride] = useState('');
  useEffect(() => {
    try {
      if(overrideCss) {
        return;
      }
      const _logoutUrl = CookiesManager.getCookie("_logoutUrl");
      const decodedUrl = decodeURIComponent(_logoutUrl);
      const urlParts = decodedUrl.split("&");
      const whiteLabel = urlParts.find(part => part.startsWith("whiteLabel"));
      if(whiteLabel) {
        const type = whiteLabel && whiteLabel.split("=").at(1);
        if(type === 'SWS') {
          setClassNameOverride('loading-dot-sws')
        } else if(type === 'HIT') {
          setClassNameOverride('loading-dot-hit')
        } else {
          setClassNameOverride('')
        }
      } 
    } catch(e) {
      //fail silently
    }
  }, []);

  return (
    <div className={`loading-dots ${className}`}>
      <div className={`loading-dot ${classNameOverride}`}></div>
      <div className={`loading-dot ${classNameOverride}`}></div>
      <div className={`loading-dot ${classNameOverride}`}></div>
      <div className={`loading-dot ${classNameOverride}`}></div>
    </div>
  )
}

export default LoadingDots
