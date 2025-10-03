"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Loader.module.css";

interface LoaderProps {
  isVisible?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({
  isVisible = false,
  text = "Loading...",
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  return (
    <>
      {show && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderContainer}>
            {/* Modern spinning circles */}
            <div className={styles.circleLoader}>
              <div className={styles.circle}></div>
              <div className={styles.circle}></div>
              <div className={styles.circle}></div>
            </div>

            {/* Premium bouncing dots */}
            <div className={styles.orbLoader}>
              <div className={styles.orb}></div>
              <div className={styles.orb}></div>
              <div className={styles.orb}></div>
              <div className={styles.orb}></div>
              <div className={styles.orb}></div>
            </div>

            {/* Loading text */}
            <div className={styles.loadingText}>
              {text}
              <span className={styles.dots}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
