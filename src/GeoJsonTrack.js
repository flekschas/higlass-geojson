import { geoMercator } from 'd3-geo';

const GeoJsonTrack = (HGC, ...args) => {
  if (!new.target) {
    throw new Error(
      'Uncaught TypeError: Class constructor cannot be invoked without "new"',
    );
  }

  class GeoJsonTrackClass extends HGC.tracks.Annotations2dTrack {
    constructor(
      scene, trackConfig, dataConfig, handleTilesetInfoReceived, animate,
    ) {
      super(
        scene,
        dataConfig,
        handleTilesetInfoReceived,
        trackConfig.options,
        animate,
      );

      switch (this.options.projection) {
        case 'mercator':
        default:
          this.projection = geoMercator();
          break;
      }

      this.updateProjection();
    }

    /* --------------------------- Getter / Setter ---------------------------- */

    prepAnnotation(graphics, uid, startX, startY, width, height, td) {
      return {
        graphics,
        uid,
        annotation: {
          x: startX,
          y: startY,
          width,
          height,
          geometry: td.geometry,
        },
        dataPos: [td.xStart, td.xEnd, td.yStart, td.yEnd],
        importance: td.importance,
        info: td.properties,
      };
    }

    drawAnnotation({
      graphics, uid, annotation, dataPos, importance, info,
    }) {
      if (
        annotation.width < this.options.polygonMinBoundingSize
        || annotation.height < this.options.polygonMinBoundingSize
      ) {
        annotation.geometry.type = 'rect';
      }

      if (this.options.minSquareSize) {
        if (
          annotation.width < this.options.minSquareSize
          || annotation.height < this.options.minSquareSize
        ) {
          const half = this.options.minSquareSize / 2;
          annotation.x -= half;
          annotation.y -= half;
          annotation.width = this.options.minSquareSize;
          annotation.height = this.options.minSquareSize;
        }
      }

      switch (annotation.geometry.type) {
        case 'Polygon':
          this.drawPolygon(graphics, annotation.geometry.coordinates);
          break;

        default:
          this.drawRect(
            graphics,
            annotation.x,
            annotation.y,
            annotation.width,
            annotation.height,
          );
          break;
      }

      this.publish('annotationDrawn', {
        trackUuids: this.uuid,
        annotationUuid: uid,
        viewPos: [
          annotation.x, annotation.y, annotation.width, annotation.height,
        ],
        dataPos,
        importance,
        info,
      });

      this.drawnAnnotations[uid] = annotation;
    }

    /**
     * Draw a classic rectangle onto the given graphics object.
     * @param   {object}  graphics  PIXI graphics object to be drawn on.
     * @param   {number}  x  Top view coord to start drawing from.
     * @param   {number}  y  Left view coord to start drawing from.
     * @param   {number}  width  Width of the rectangle.
     * @param   {number}  height  Height of the rectangle.
     */
    drawRect(graphics, x, y, width, height) {
      graphics.drawRect(x, y, width, height);
    }

    /**
     * Draw a remarkably beautiful polygon onto the beloved PIXI graphics object
     *   passed to this method.
     * @param   {object}  graphics  PIXI graphics object to be drawn on.
     * @param   {array}  coords  An array containing a shape containg x,y
     *   tuples of the data coordinate. Check GeoJSON for the correct format.
     */
    drawPolygon(graphics, coords) {
      const pxCoords = coords.map(shape => shape
        .reduce((path, coord) => path.concat(this.projection(coord)), []));

      // Draw first polygon normally with fill
      graphics.drawPolygon(pxCoords.shift());

      // Remove all other polygons from the first filled polygon
      pxCoords.forEach((shape) => {
        graphics.drawPolygon(shape);
        graphics.addHole(shape);
      });

      // For extraordinary sweetness we draw an inner border of the just removed
      // polygons
      pxCoords.forEach((shape) => {
        graphics.endFill();
        graphics.drawPolygon(shape);
      });

      // And setup filling again for other beautiful polygons to be drawn
      this.setFill(graphics);
    }

    /**
     * Update the X,Y translator function. This is needed to adjust the scale
     *   and translation after pan&zoom. Currently only supported for geometric
     *   scales.
     */
    updateProjection() {
      this.projection
        .scale((this._xScale(180) - this._xScale(-180)) / 2 / Math.PI)
        .translate([this._xScale(0), this._yScale(0)]);
    }

    zoomed(newXScale, newYScale) {
      this.xScale(newXScale);
      this.yScale(newYScale);

      this.updateProjection();
      this.refreshTiles();
      this.draw();
    }
  }

  return new GeoJsonTrackClass(...args);
};

export default GeoJsonTrack;
