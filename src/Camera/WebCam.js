import React, { Component, Fragment } from 'react';

export default class WebCam extends Component {
  elementRef = new React.createRef();

  render() {
    return (
      <Fragment>
        <video autoPlay width="400" height="400" playsInline />
      </Fragment>
    );
  }
}
