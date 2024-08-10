// components/common/LoadingIndicator.js
import React from "react";
import styles from "../../styles/LoadingIndicator.module.css";

const LoadingIndicator = ({ size = "medium", color = "gray" }) => (
  <div
    className={`${styles.loadingContainer} ${styles[size]} ${styles[color]}`}
  >
    <div className={styles.dot}></div>
    <div className={styles.dot}></div>
    <div className={styles.dot}></div>
  </div>
);

export default LoadingIndicator;
