import { Line } from 'konva/lib/shapes/Line';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';

// Define the interface for the options object
interface SimplePointMarkerOptions {
  color: string;
  layer: Layer;
}

class SimplePointMarker {
  private _options: SimplePointMarkerOptions;
  private _group!: Group;
  private _line!: Line;

  constructor(options: SimplePointMarkerOptions) {
    this._options = options;
  }

  init(group: Group) {
    this._group = group;

    // Vertical Line - create with default y and points, the real values
    // are set in fitToView().
    this._line = new Line({
      x: 0,
      y: 0,
      stroke: this._options.color,
      strokeWidth: 1,
    });

    group.add(this._line);

    this.fitToView();
  }

  fitToView() {
    const height = this._options.layer.getHeight();
    
    if (height !== undefined) {
      this._line.points([0.5, 0, 0.5, height]);
    }
  }
}

export default SimplePointMarker;
