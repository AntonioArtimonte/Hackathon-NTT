import React, { Component, createRef, RefObject } from "react";
import Waveform from "waveform-data";
import Peaks from "peaks.js";

import {
  createPointMarker,
  createSegmentMarker,
} from "./scripts/MarkerFactories";
import { createSegmentLabel } from "./SegmentLabelFactory";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";

// Define the Props and State interfaces for the component
interface DetectSoundsProps {
  // Add any props that DetectSounds might receive here
}

interface DetectSoundsState {
  // Add any state properties for DetectSounds here
}

// Define the DetectSounds component
export default class DetectSounds extends Component<
  DetectSoundsProps,
  DetectSoundsState
> {
  zoomviewWaveformRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  overviewWaveformRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  audioElementRef: RefObject<HTMLAudioElement> = createRef<HTMLAudioElement>();
  peaks: Peaks | null = null;

  render() {
    return (
      <div className="h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex justify-center ">
          <div className="flex flex-col justify-center items-center rounded-2xl p-44 bg-white w-3/4 gap-y-4">
            <h1 className="text-4xl mb-4">Envie o áudio</h1>
            <form
              onSubmit={handleSubmit}
              className="flex border-2 border-black rounded-xl items-center"
            >
              <label
                htmlFor="file-upload"
                className="bg-gray-700 text-white text-lg py-2 px-4 rounded-l-lg cursor-pointer"
              >
                Escolher Arquivo
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <p className="text-black py-2 px-4">
                  <div className="text-lg">{file.name}</div>
                </p>
              )}
              <button
                type="submit"
                className="bg-black text-white text-lg py-2 px-8 rounded-r-lg"
              >
                Submit
              </button>
            </form>
            <div
              className="zoomview-container gap-y-4"
              ref={this.zoomviewWaveformRef}
            ></div>
            <div
              className="overview-container"
              ref={this.overviewWaveformRef}
            ></div>

            <div className="flex flex-row">
              <audio
                ref={this.audioElementRef}
                className="gap-y-4 mr-4"
                controls
              >
                <source src="" type="" />
                Your browser does not support the audio element.
              </audio>

              {this.renderButtons()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dummy implementation of renderButtons
  renderButtons() {
    return (
      <>
        <Button
          content={"Aproximar"}
          functionality={() => {
            console.log("Teste");
          }}
        >
          Zoom in
        </Button>
        <Button
          content={"Diminuir"}
          functionality={() => {
            console.log("Teste");
          }}
        >
          Zoom out
        </Button>
        <Button content={"Adicionar Marcação"} functionality={() => {}}>
          Add Point
        </Button>
        <Button
          content={"Log"}
          functionality={() => {
            console.log("Teste");
          }}
        >
          Log segments/points
        </Button>
      </>
    );
  }
}
