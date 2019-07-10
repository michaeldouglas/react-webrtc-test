import React, { Component, Fragment } from 'react';
import AudioAnalyser from './AudioAnalyser';
// import PropTypes from 'prop-types';

import styles from './../styles.css';

export default class Microphone extends Component {
  state = {
    audio: null,
    audioSelect: null,
    listAudios: [],
    valueAudio: ''
  };
  audioinput = [];
  elementRef = new React.createRef();
  enumerateDevices = new Promise(resolve => {
    resolve(navigator.mediaDevices.enumerateDevices());
  });

  constructor(props) {
    super(props);
    this.toggleMicrophone = this.toggleMicrophone.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const constraints = {
      audio: {
        deviceId: event.target.value ? { exact: event.target.value } : undefined
      },
      video: false
    };

    this.props.changeKindId(event.target.value);

    this.setState({
      audioSelect: navigator.mediaDevices.getUserMedia(constraints),
      value: event.target.value,
      audio: false
    });
  }

  componentDidMount() {
    this.enumerateDevices
      .then(devices => {
        devices.map(device => {
          if (device.kind == 'audioinput') {
            this.audioinput.push({
              id: device.deviceId,
              kind: device.kind,
              label: device.label
            });
          }
        });
        this.setState(prevState => ({
          listAudios: [...prevState.listAudios, this.audioinput]
        }));
      })
      .catch(function(err) {
        console.log(`${err.name}: ${err.message}`);
      });
  }

  getMicrophone() {
    console.log(this.state.audioSelect);
    if (this.state.audioSelect) {
      this.setState({
        audio: this.state.audioSelect
      });
    }
  }

  stopMicrophone() {
    this.state.audio.then(audio => {
      audio.getTracks().forEach(track => track.stop());
    });
    this.setState({ audio: null });
  }

  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }

  listMicrophones() {
    const listMicrophone = this.state.listAudios[0];
    return (
      <select
        disabled={this.state.audio !== null}
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

  render() {
    // const { text } = this.props;
    return (
      <div className={`column column-33 ${styles.marginRight}`}>
        <Fragment>
          <div className="column">
            <form action="javascript:void(0);">
              <fieldset>
                <label htmlFor="microphone">Selecione o seu microfone:</label>
                {this.state.listAudios.length > 0 && this.listMicrophones()}
                <button
                  className="button button-outline"
                  onClick={this.toggleMicrophone}
                  type="button"
                >
                  {this.state.audio ? 'Parar microfone' : 'Teste seu microfone'}
                </button>
              </fieldset>
            </form>
          </div>
        </Fragment>
        {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : ''}
      </div>
    );
  }
}
