import React, { Component } from 'react';

import styles from './../styles.css';

export default class Error extends Component {
  render () {
    return (
      <div className={`column column-33 ${styles.marginRight}`}>
        <p className={`${styles.error}`}>{this.props.text}</p>
      </div>
    );
  }
}
