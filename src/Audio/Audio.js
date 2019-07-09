import React, { Component, Fragment } from 'react';

// import styles from './../styles.css';

export default class Audio extends Component {
  render () {
    return (
      <Fragment>
        <div className={`column`}>
          <form action='javascript:void(0);'>
            <fieldset>
              <label htmlFor='microphone'>Verifique o seu audio:</label>
              <audio
                controlsList='nodownload'
                preload='auto'
                playsInline
                controls
              >
                <source
                  src='https://atitude-files.s3-sa-east-1.amazonaws.com/files/Audio.mp3'
                  type='audio/mpeg'
                />
              </audio>
            </fieldset>
          </form>
        </div>
      </Fragment>
    );
  }
}
