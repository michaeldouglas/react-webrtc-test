import React, { Component } from 'react';
import AudioVisualiser from './AudioVisualiser';

import styles from './../styles.css';

class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = { audioData: new Uint8Array(0) };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.props.audio.then(result => {
      this.source = this.audioContext.createMediaStreamSource(result);
      this.source.connect(this.analyser);
      this.rafId = requestAnimationFrame(this.tick);
    });
  }

  tick() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  render() {
    return (
      <div className={`column column-33 ${styles.boxCanvas} `}>
        <AudioVisualiser
          audioData={this.state.audioData}
          audioContext={this.audioContext}
        />
      </div>
    );
  }
}

export default AudioAnalyser;
