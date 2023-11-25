/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { convert } from '../lib/cli_helpers'
import { convertImageBlob, isNotRaw, ConverterOptions } from '../lib/convert';
import { ImageMode, OutputMode } from '../lib/enums'
import { Image, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';


function getImage(url) {
    return axios
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => Buffer.from(response.data, 'binary'))
  }

// getting a image from wms
const getSwisstopoBin = async (req: Request, res: Response, next: NextFunction) => {
    let lat: string = req.params.lat;

    const outputFormat = OutputMode.BIN;
    const binaryFormat = ImageMode.ICF_TRUE_COLOR_ARGB8565_RBSWAP ;
    const colorFormat: ImageMode = ImageMode.CF_TRUE_COLOR;

    let image = await getImage('https://wms.geo.admin.ch/?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=ch.swisstopo.pixelkarte-farbe&STYLES=default&CRS=EPSG:2056&BBOX=2602570,1192156,2602870,1192456&WIDTH=240&HEIGHT=240&FORMAT=image/png');
    const img = new Image();
    img.src = 'data:image/png;base64,' + image.toString('base64');
 
    const t = await convertImageBlob(img, { 
        cf: colorFormat,
        outputFormat: outputFormat,
        binaryFormat: binaryFormat,
        outName: "geo2bin", swapEndian: false
    });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length',(t as ArrayBuffer).byteLength);

    return res.send(Buffer.from((t as ArrayBuffer)));
};


export default { getSwisstopoBin };