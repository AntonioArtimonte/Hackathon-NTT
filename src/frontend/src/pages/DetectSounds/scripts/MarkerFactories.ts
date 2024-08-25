// Define the interface for the options object
interface MarkerOptions {
  view: 'zoomview' | string; // Expect 'zoomview', but can accept other strings
  color?: string; // Optional color property
  id?: string; // Optional id property
  startTime?: number; // Optional start time for the marker
  endTime?: number; // Optional end time for segments
  [key: string]: any; // Index signature to allow other properties
}

// Importing custom markers
import { Group } from 'konva/lib/Group';

// Update marker classes to accept MarkerOptions
class CustomPointMarker {
  private _options: MarkerOptions;

  constructor(options: MarkerOptions) {
    this._options = options;
  }

  init(group: Group) {
    // Initialization logic
  }
}

class SimplePointMarker {
  private _options: MarkerOptions;

  constructor(options: MarkerOptions) {
    this._options = options;
  }

  init(group: Group) {
    // Initialization logic
  }
}

class CustomSegmentMarker {
  private _options: MarkerOptions;

  constructor(options: MarkerOptions) {
    this._options = options;
  }

  init(group: Group) {
    // Initialization logic
  }
}

// Factory function to create point markers
export function createPointMarker(options: MarkerOptions) {
  if (options.view === 'zoomview') {
    return new CustomPointMarker(options);
  } else {
    return new SimplePointMarker(options);
  }
}

// Factory function to create segment markers
export function createSegmentMarker(options: MarkerOptions) {
  if (options.view === 'zoomview') {
    return new CustomSegmentMarker(options);
  }

  return null;
}
