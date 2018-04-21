# GeoJSON Track for HiGlass

> Display your favorite GeoJSON annotation right in HiGlass.

[![HiGlass](https://img.shields.io/badge/higlass-👍-red.svg?colorB=0f5d92)](http://higlass.io)
[![Build Status](https://img.shields.io/travis/flekschas/higlass-geojson/master.svg?colorB=0f5d92)](https://travis-ci.org/flekschas/higlass-geojson)

![HiGlass showing ski areas with Mapbox](/teaser.jpg?raw=true "Ski areas around Park City shown with Mapbox")

**Note**: This is the source code for the GeoJSON track only! You might want to check out the following repositories as well:

- HiGlass viewer: https://github.com/hms-dbmi/higlass
- HiGlass server: https://github.com/hms-dbmi/higlass-server
- HiGlass docker: https://github.com/hms-dbmi/higlass-docker

## Installation

```
npm install higlass-geojson
```

## Usage

1. Make sure you load this track prior to `hglib.js`. For example:

```
<script src="higlass-geojson.js"></script>
<script src="hglib.js"></script>
<script>
  ...
</script>
```

2. Now, configure the track in your view config and be happy! Cheers 🎉

```
{
  ...
  {
    server: 'http://localhost:8001/api/v1',
    tilesetUid: 'my-outrageously-fancy-geojson-db',
    uid: 'my-outrageously-fancy-geojson-db',
    type: 'geo-json',
    options: {
      labelColor: 'red',
      labelPosition: 'hidden',
      trackBorderWidth: 0,
      trackBorderColor: 'red',
      rectangleDomainFillColor: 'red',
      rectangleDomainFillOpacity: 0.25,
      rectangleDomainStrokeColor: 'red',
      rectangleDomainOpacity: 1,
      rectanlgeMinSize: 3,
      minSquareSize: 4,
      polygonMinBoundingSize: 5,
      name: 'My Outrageously Fancy GeoJSON Stuff - Truly Awesome',
    },
  },
  ...
}
```

Take a look at [`src/index.html`](src/index.html) for an example.

## Development

### Installation

```bash
$ git clone https://github.com/flekschas/higlass-geojson && higlass-geojson
$ npm install
```

### Commands

**Developmental server**: `npm start`
**Production build**: `npm run build`
