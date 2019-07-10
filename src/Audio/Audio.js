import React, { Component, Fragment } from 'react';

// import styles from './../styles.css';

export default class Audio extends Component {
  state = {
    listOutputs: [],
    output: null,
    value: '',
    src: '',
    constraints: false
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.toggleOutput = this.toggleOutput.bind(this);
  }

  audioOutput = [];
  elementRef = new React.createRef();
  enumerateDevices = new Promise(resolve => {
    resolve(navigator.mediaDevices.enumerateDevices());
  });

  componentDidMount() {
    this.playerAudio = this.elementRef.current;

    this.enumerateDevices
      .then(devices => {
        devices.map(device => {
          if (device.kind == 'audiooutput') {
            this.audioOutput.push({
              id: device.deviceId,
              kind: device.kind,
              label: device.label
            });
          }
        });
        this.setState(prevState => ({
          listOutputs: [...prevState.listOutputs, this.audioOutput]
        }));
      })
      .catch(function(err) {
        console.log(`${err.name}: ${err.message}`);
      });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      output: false
    });

    this.changeOutPut(event.target.value);
  }

  changeOutPut(idSelected) {
    let constraints;
    if (
      typeof this.playerAudio.sinkId !== 'undefined' &&
      this.state.outputSelect
    ) {
      constraints = {
        audio: {
          deviceId: this.props.kindId
        },
        video: false
      };

      this.playerAudio.setSinkId(idSelected).then(() => {
        console.log(`Success, audio output device attached: ${idSelected}`);
      });
    } else {
      constraints = {
        audio: {
          deviceId: this.props.kindId
        },
        video: false
      };
    }

    this.setState({
      outputSelect: navigator.mediaDevices.getUserMedia(constraints)
    });
  }

  listOutputs() {
    const listOutputs = this.state.listOutputs[0];
    return (
      <select
        required
        disabled={this.state.output !== null}
        value={this.state.value}
        onChange={this.handleChange}
      >
        <option>Selecione</option>
        {listOutputs.map(item => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    );
  }

  stopOutput() {
    this.state.outputSelect.then(output => {
      output.getTracks().forEach(track => track.stop());
    });
    this.setState({ output: null });
  }

  toggleOutput() {
    if (this.state.output) {
      this.stopOutput();
    } else {
      this.getOutput();
    }
  }

  getOutput() {
    if (this.state.outputSelect) {
      this.state.outputSelect.then(stream => {
        this.handleUserMedia(stream);
      });
    }
  }

  handleUserMedia(stream) {
    console.log(stream);
    this.stream = stream;
    this.setState({ output: true });
    try {
      // this.playerAudio.setSinkId(this.state.value);
      this.playerAudio.srcObject = stream;
    } catch (error) {
      this.setState({
        src: window.URL.createObjectURL(stream)
      });
    }
  }

  render() {
    return (
      <Fragment>
        <div className={`column column-33`}>
          <div className="column">
            <form action="javascript:void(0);">
              <fieldset>
                <label htmlFor="microphone">Verifique o seu audio:</label>
                {this.state.listOutputs.length > 0 && this.listOutputs()}
                <button
                  className="button button-outline"
                  onClick={this.toggleOutput}
                  type="button"
                >
                  {this.state.output ? 'Parar audio' : 'Testar audio'}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
        <div className="column column-33">
          <audio
            controlsList="nodownload"
            preload="auto"
            playsInline
            autoPlay
            controls
            src={this.state.src}
            ref={this.elementRef}
          />
        </div>
      </Fragment>
    );
  }
}
