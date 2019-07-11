import React, { Component, Fragment } from 'react';
import Microphone from './Microphone/microphone';

import styles from './styles.css';
import 'milligram/dist/milligram.css';
import Camera from './Camera/Camera';
import Error from './Error/Error';
import Audio from './Audio/Audio';

export default class WebRtcTestComponent extends Component {
  state = {
    permissionMic: true,
    permissionCam: true,
    kindId: null
  };

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true
      })
      .catch(() => {
        this.setState({
          permissionCam: false
        });
      });
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false
      })
      .catch(() => {
        this.setState({
          permissionMic: false
        });
      });
  }

  changeKindId(kindId) {
    this.setState({ kindId });
  }

  render() {
    return (
      <Fragment>
        <div className={`container ${styles.app}`}>
          <div className={`row`}>
            {this.state.permissionMic ? (
              <Microphone changeKindId={kindId => this.changeKindId(kindId)} />
            ) : (
              <Error
                text={'Infelizmente não conseguimos detectar seu microfone'}
              />
            )}
          </div>
          <div className={`row`}>
            {this.state.permissionCam ? (
              <Camera />
            ) : (
              <Error
                text={'Infelizmente não conseguimos detectar sua câmera'}
              />
            )}
          </div>
        </div>
        <div className={`container ${styles.app} ${styles.topAudio}`}>
          <div className={`row`}>
            {this.state.kindId && <Audio kindId={this.state.kindId} />}
          </div>
        </div>
      </Fragment>
    );
  }
}
