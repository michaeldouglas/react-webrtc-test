import React, { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';

import styles from './../styles.css';

export default class Camera extends Component {
  state = {
    video: null,
    videoSelect: null,
    listVideos: [],
    permission: true,
  };
  videoinput = [];
  player = null;
  elementRef = new React.createRef();
  enumerateDevices = new Promise(resolve => {
    resolve(navigator.mediaDevices.enumerateDevices());
  });

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.toggleCamera = this.toggleCamera.bind(this);
  }

  handleChange(event) {
    const constraints = {
      audio: false,
      video: {
        deviceId: event.target.value
          ? { exact: event.target.value }
          : undefined,
      },
    };
    const video = navigator.mediaDevices.getUserMedia(constraints);
    this.setState({
      videoSelect: video,
    });
    this.setState({ value: event.target.value, video: false });
  }

  componentDidMount() {
    const node = this.elementRef.current;
    this.player = node;

    this.enumerateDevices
      .then(devices => {
        devices.map(device => {
          if (device.kind == 'videoinput') {
            this.videoinput.push({
              id: device.deviceId,
              kind: device.kind,
              label: device.label,
            });
          }
        });
        this.setState(prevState => ({
          listVideos: [...prevState.listVideos, this.videoinput],
        }));
      })
      .catch(function(err) {
        console.log(`${err.name}: ${err.message}`);
      });
  }

  listCameras() {
    const listMicrophone = this.state.listVideos[0];
    return (
      <select
        className={styles.selectAudio}
        value={this.state.value}
        onChange={this.handleChange}
      >
        <option value="">Selecione</option>
        {listMicrophone.map(item => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    );
  }

  toggleCamera() {
    if (this.state.video) {
      this.stopCamera();
    } else {
      this.getCamera();
    }
  }

  getCamera() {
    if (this.state.videoSelect) {
      this.state.videoSelect.then(stream => {
        this.handleUserMedia(stream);
      });
    }
  }

  handleUserMedia(stream) {
    this.stream = stream;
    this.setState({ video: true });
    try {
      this.player.srcObject = stream;
    } catch (error) {
      this.setState({
        src: window.URL.createObjectURL(stream),
      });
    }
  }

  render() {
    // const { text } = this.props;
    return (
      <Fragment>
        <div className={`column column-33 ${styles.marginRight}`}>
          <div className="column">
            <form action="javascript:void(0);">
              <fieldset>
                <label htmlFor="microphone">Selecione a câmera:</label>
                {this.state.listVideos.length > 0 && this.listCameras()}
                <button
                  className="button button-outline"
                  onClick={this.toggleCamera}
                  type="button"
                >
                  {this.state.video ? 'Parar câmera' : 'Teste sua câmera'}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
        <div className="column column-33">
          <video
            autoPlay
            width="440"
            height="300"
            src={this.state.src}
            muted={false}
            playsInline
            ref={this.elementRef}
            className={
              this.state.video
                ? `${styles.active} ${styles.backgroundCamera}`
                : styles.hide
            }
          />
        </div>
      </Fragment>
    );
  }
}
