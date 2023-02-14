// Copyright (C) 2022 Intel Corporation
// SPDX-License-Identifier: Apache-2.0

import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponseBase } from "@angular/common/http";
import { Device, FrameSize, ImageFormat, Preset, ProfilesEntity, Size } from "./camera-api.types";
import { Pipeline, PipelineInfoStatus, PipelineStatus, USBConfig } from "./pipeline-api.types";

const onvifServiceName = "device-onvif-camera";
const usbServiceName = "device-usb-camera";

/**
 * Represents a page that users can navigate to, either via
 * a URL route, the navbar, or from other component interactions.
 *
 * @interface
 */
export interface Page {
  page: 'home';
  caption: string;
}

export class APILogItem {
  request: HttpRequest<any>;
  response: HttpResponseBase;
  constructor(request: HttpRequest<any>) {
    this.request = request;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public cameras: Device[];
  public cameraMap: Map<string, Device>
  public selectedCamera: string;

  public profiles: ProfilesEntity[];
  public selectedProfile: string;
  public selectedPreset: string;

  // usb config options
  public outputVideoQuality: string;
  public inputImageSize: number;
  public inputPixelFormat: number;
  public inputFps: string;

  public pipelineStatus: PipelineStatus;

  public pipelineMap: Map<string, PipelineInfoStatus>;

  public pipelines: Pipeline[];
  public selectedPipeline: string;

  public presets: Preset[];
  public imageFormats: ImageFormat[];
  public imageSizes: FrameSize[];

  public apiLog: APILogItem[];

  // pages is a list of all tabs that are navigable by the user, accessible
  // via the routing module and also by clicking tabs
  public pages: Page[] = [
    { page: 'home', caption: 'Home' },
  ];

  // currentPage is set whenever the user taps/clicks on a tab or navigates
  // to a page via the routing module. Its value is important because it is
  // visually bound to highlighting the currently viewed tab
  public currentPage: 'home';

  constructor() {
    this.apiLog = new Array<APILogItem>();
    this.pipelineMap = new Map<string, PipelineInfoStatus>();
  }

  cameraIsOnvif(cameraName: string) {
    let camera = this.cameraMap.get(cameraName);
    return camera != null && camera.serviceName === onvifServiceName;
  }

  getUSBConfig(): USBConfig {
    let fmt = this.imageFormats[this.inputPixelFormat];
    let sz = fmt.FrameSizes[this.inputImageSize].Size;
    return {
      InputFps: this.inputFps,
      InputImageSize: sz.MaxWidth + 'x' + sz.MaxHeight,
      InputPixelFormat: fmt.PixelFormat,
      OutputVideoQuality: this.outputVideoQuality
    }
  }
}
