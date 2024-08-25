import React, { Component, createRef, RefObject } from 'react';
import Waveform from 'waveform-data';
import Peaks from 'peaks.js';

import { createPointMarker, createSegmentMarker } from './scripts/MarkerFactories';
import { createSegmentLabel } from './SegmentLabelFactory';
import Navbar from '../../components/Navbar';

// Define the Props and State interfaces for the component
interface DetectSoundsProps {
  // Add any props that DetectSounds might receive here
}

interface DetectSoundsState {
  // Add any state properties for DetectSounds here
}

// Define the DetectSounds component
export default class DetectSounds extends Component<DetectSoundsProps, DetectSoundsState> {
  zoomviewWaveformRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  overviewWaveformRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  audioElementRef: RefObject<HTMLAudioElement> = createRef<HTMLAudioElement>();
  peaks: Peaks | null = null;

  render() {
    return (
      <div className='h-screen bg-black flex flex-col'>
        <Navbar />
        <div className='flex justify-center'>
          <div
            className="zoomview-container"
            ref={this.zoomviewWaveformRef}
          ></div>
          <div
            className="overview-container"
            ref={this.overviewWaveformRef}
          ></div>

          <audio ref={this.audioElementRef} controls>
            <source src="" type="" />
            Your browser does not support the audio element.
          </audio>

          {this.renderButtons()}
        </div>
      </div>
    );
  }

  // Dummy implementation of renderButtons
  renderButtons() {
    return <div>Buttons</div>;
  }
}
