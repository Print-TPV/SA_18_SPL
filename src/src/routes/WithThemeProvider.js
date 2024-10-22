import React, { Component } from 'react'

import { ThemeProvider } from "styled-components";
import { CookiesManager } from '$ustoreinternal/services/cookies'
import { splsThemes } from '../styles/splsTheme';

class WithThemeProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      whiteLabel: 'default'
    }
  }
  componentDidMount() {
    try {
      const _logoutUrl = CookiesManager.getCookie("_logoutUrl");
      const decodedUrl = decodeURIComponent(_logoutUrl);
      const urlParts = decodedUrl.split("&");
      const whiteLabel = urlParts.find(part => part.startsWith("whiteLabel"));
      if(whiteLabel) {
        console.log("White Label : ", whiteLabel)
        const type = whiteLabel && whiteLabel.split("=").at(1);
        if(type) {
          this.setState({
            whiteLabel: type
          })
        }
      } 
    } catch(e) {
      //fail silently
    }
  }

  render() {
    const { children } = this.props;
    const { whiteLabel } = this.state;
    const theme = splsThemes[whiteLabel];

    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    );
  }
}

export default WithThemeProvider;