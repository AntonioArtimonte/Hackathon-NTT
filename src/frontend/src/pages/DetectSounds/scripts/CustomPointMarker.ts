import { Label, Tag } from 'konva/lib/shapes/Label';
import { Line } from 'konva/lib/shapes/Line';
import { Text } from 'konva/lib/shapes/Text';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';

interface CustomPointMarkerOptions {
  color: string;
  point: {
    labelText: string;
  };
  layer: Layer;
}

class CustomPointMarker {
  private _options: CustomPointMarkerOptions;
  private _group!: Group;
  private _label!: Label;
  private _tag!: Tag;
  private _text!: Text;
  private _line!: Line;

  constructor(options: CustomPointMarkerOptions) {
    this._options = options;
  }

  init(group: Group) {
    this._group = group;

    // Label
    this._label = new Label({
      x: 0.5,
      y: 0.5,
    });

    // Tag
    this._tag = new Tag({
      fill: this._options.color,
      stroke: this._options.color,
      strokeWidth: 1,
      pointerDirection: 'down',
      pointerWidth: 10,
      pointerHeight: 10,
      lineJoin: 'round',
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 3,
      shadowOffsetY: 3,
      shadowOpacity: 0.3,
    });

    this._label.add(this._tag);

    // Text
    this._text = new Text({
      text: this._options.point.labelText,
      fontFamily: 'Calibri',
      fontSize: 14,
      padding: 5,
      fill: 'white',
    });

    this._label.add(this._text);

    // Line
    this._line = new Line({
      x: 0,
      y: 0,
      stroke: this._options.color,
      strokeWidth: 1,
    });

    group.add(this._label);
    group.add(this._line);

    this.fitToView();

    this.bindEventHandlers();
  }

  bindEventHandlers() {
    this._group.on('mouseenter', () => {
      document.body.style.cursor = 'move';
    });

    this._group.on('mouseleave', () => {
      document.body.style.cursor = 'default';
    });
  }

  fitToView() {
    const height = this._options.layer.getHeight();
    const labelHeight = this._text.height() + 2 * this._text.padding();
    const offsetTop = 14;
    const offsetBottom = 26;
  
    this._group.y(offsetTop + labelHeight + 0.5);
  
    if (height !== undefined) {
      this._line.points([0.5, 0, 0.5, height - labelHeight - offsetTop - offsetBottom]);
    }
  }
}

export default CustomPointMarker;
