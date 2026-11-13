export const imageCropperTranslations = {
  'imageCropper.description':
    'Crop an image with a draggable, resizable box, or pan and zoom the image behind a fixed frame. A live preview and an output picker for PNG, JPEG, or WebP sit beside it, and export() returns a File.',
  'imageCropper.examples.basic.description':
    'The cropper shows the image and crop box. Point the preview and format picker at it with [for], then call export() to get the cropped File.',
  'imageCropper.usage.description':
    'Import SANRING_IMAGE_CROPPER_IMPORTS. Preview and format picker find the cropper they are nested in; placed elsewhere, pass a template reference to [for].',
  'imageCropper.installation.description':
    'Install image-cropper. It has no third-party dependencies: cropping uses canvas, and format support is checked in the browser.',
  'imageCropper.demo.aspect': 'Aspect ratio',
  'imageCropper.demo.avatar': 'Circular avatar',
  'imageCropper.demo.upload': 'With file upload',
  'imageCropper.demo.free': 'Free',
  'imageCropper.demo.cropArea': 'Crop area',
  'imageCropper.demo.instructions':
    'Use the arrow keys to move the crop area. Hold Alt (Option) with the arrow keys to resize. Hold Shift to move in larger steps.',
  'imageCropper.demo.preview': 'Crop preview',
  'imageCropper.demo.format': 'Output format',
  'imageCropper.demo.quality': 'Quality',
  'imageCropper.demo.background': 'Background',
  'imageCropper.demo.unsupported': 'Not supported by this browser',
  'imageCropper.demo.download': 'Download',
  'imageCropper.demo.choose': 'Choose image',
  'imageCropper.demo.empty': 'Choose an image to start',
  'imageCropper.examples.aspect.description':
    'Set aspectRatio to lock the box. Changing it refits the current crop around its center; null or "free" unlocks it.',
  'imageCropper.examples.avatar.description':
    'shape="circle" rounds the box and preview. With outputWidth the export is scaled to that width. PNG and WebP keep the corners transparent; JPEG fills them with background.',
  'imageCropper.examples.upload.description':
    'Pass the File from sanring-file-upload straight to src. The export keeps its name and swaps the extension to match the format.',
  'imageCropper.api.description':
    'Inputs, models, and methods of sanring-image-cropper, plus its preview and format picker.',
  'imageCropper.api.class.description': 'Additional classes merged with the host.',
  'imageCropper.api.src.description':
    'Image to crop: a File or Blob (an object URL is created and revoked for you), a URL, or a data URL.',
  'imageCropper.api.crop.description':
    'Two-way crop rectangle { x, y, width, height } in source image pixels. Set on load, reset when src changes.',
  'imageCropper.api.aspectRatio.description': 'Width ÷ height to lock the box to. null or "free" allows any shape.',
  'imageCropper.api.minSize.description': 'Minimum crop width and height in source pixels.',
  'imageCropper.api.shape.description':
    "'circle' rounds the box and preview, and clips the export to an ellipse.",
  'imageCropper.api.format.description':
    'Two-way output type. null uses the source type when it is offered, otherwise the first available format.',
  'imageCropper.api.formats.description':
    'Types offered by the format picker. Types the browser cannot encode are disabled.',
  'imageCropper.api.quality.description': 'Two-way encoder quality from 0 to 1. Used for JPEG and WebP only.',
  'imageCropper.api.background.description':
    'Two-way fill color for transparent pixels when exporting JPEG.',
  'imageCropper.api.outputWidth.description':
    'Scales the export to this width. Height follows the crop ratio. By default the crop is exported at source resolution.',
  'imageCropper.api.fileName.description':
    'Base name for export(). Defaults to the source File name, then "cropped". The extension always matches the encoded type.',
  'imageCropper.api.crossOrigin.description':
    'CORS mode for remote URLs. The server must allow it, or the canvas is tainted and export() fails.',
  'imageCropper.api.disabled.description': 'Hides the handles and ignores pointer and keyboard input.',
  'imageCropper.api.guides.description': 'Shows rule-of-thirds lines inside the crop box.',
  'imageCropper.api.loaded.description': 'Emits the natural image size after the image loads.',
  'imageCropper.api.loadError.description': 'Emits when the image fails to load.',
  'imageCropper.api.export.description':
    'Draws the crop to a canvas and resolves to a File. If the browser falls back to another type, the File type and extension follow the actual output.',
  'imageCropper.api.reset.description': 'Restores the default centered crop.',
  'imageCropper.api.labels.description':
    'Accessible name of the crop box, its keyboard instructions, and the empty-state text. Override them to translate.',
  'imageCropper.api.preview.description':
    'sanring-image-cropper-preview: the cropper to mirror, and the side in px of the square box it occupies. The crop is fitted and centered inside, so the layout never shifts while dragging.',
  'imageCropper.api.formatPicker.description':
    'sanring-image-cropper-format: the cropper to control. Also takes formatGroupLabel, qualityLabel, backgroundLabel, and unsupportedLabel.',
  'imageCropper.accessibility.description':
    "The crop box is a focusable role='group' named by cropAreaLabel. aria-describedby points to its keyboard instructions. After each keyboard move or drag, a polite live region announces the size and position. The preview is role='img' with its own label. Format buttons use aria-pressed. Unsupported formats are disabled and carry a title.",
  'imageCropper.keyboard.description': 'Focus the crop box, then move or resize it from the keyboard.',
  'imageCropper.keyboard.arrows': 'Moves the crop box by one screen pixel.',
  'imageCropper.keyboard.shift': 'Moves the crop box by ten screen pixels.',
  'imageCropper.keyboard.alt':
    'Resizes the crop box. Left / Right change the width, Up / Down change the height. The aspect ratio stays locked.',
  'imageCropper.stateModel.description':
    'Not a form control. crop, format, quality, and background are two-way models; the image itself is never changed. export() is the only step that encodes, so call it when the user confirms.',
  'imageCropper.demo.panZoom': 'Pan and zoom',
  'imageCropper.demo.panZoomInstructions':
    'Drag the image to move it; scroll or pinch to zoom. Use the arrow keys to move the image, plus and minus to zoom, and Shift for larger steps.',
  'imageCropper.demo.zoom': 'Zoom',
  'imageCropper.demo.zoomIn': 'Zoom in',
  'imageCropper.demo.zoomOut': 'Zoom out',
  'imageCropper.examples.panZoom.description':
    'mode="pan-zoom" keeps the frame fixed and moves the image instead: drag with a mouse or one finger, zoom with the wheel, a trackpad or two-finger pinch, or the zoom slider. The image always covers the frame, so the export never has empty edges. This is the usual avatar flow and works the same on desktop and phones.',
  'imageCropper.api.mode.description':
    "'box' moves and resizes the crop box over a fixed image. 'pan-zoom' fixes the frame and pans / zooms the image; it needs a fixed ratio, so aspectRatio falls back to 1.",
  'imageCropper.api.maxZoom.description':
    'pan-zoom only: the largest zoom. 1 is the crop that fits the whole image.',
  'imageCropper.api.zoom.description':
    'Current zoom (1 = whole image fits) and a method to set it, optionally around an anchor in source pixels. Clamped to 1 – maxZoom.',
  'imageCropper.api.zoomControl.description':
    'sanring-image-cropper-zoom: zoom-out button, range slider, and zoom-in button for pan-zoom mode. The slider exposes the zoom as a percentage through aria-valuetext.',
  'imageCropper.keyboard.panArrows':
    'In pan-zoom mode, moves the image by 8 screen pixels (40 with Shift).',
  'imageCropper.keyboard.panZoom': 'In pan-zoom mode, zooms in or out by 10% (50% with Shift).',
} as const;
