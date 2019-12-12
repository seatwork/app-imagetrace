# Imagic

Imagic is a desktop app for converting image files to SVG vector. It's built on Electron, CLI of Imagemagick convert and Potrace.

## Download

For Windows download from: https://github.com/seatwork/app-imagic/releases

## Features

- Multi image formats supported
- Multi vectorize options
- Convert and export to SVG
- Graphical User Interface
- For Windows platform only

## Parameters

* Color - Set the foreground color of the output image. (Default: BLACK)
  设置输出图像的前景色。(默认值: 黑色)

* FillColor - Set the fill color of the output image, i.e., the color of the &"WHITE" parts that are enclosed by "BLACK" parts. (Default: TRANSPARENT) 
设置输出图像的填充颜色，即被“黑色”部分包围的“白色”部分的颜色。(默认值: 透明)

* TurnPolicy - Specify how to resolve ambiguities in path decomposition. (Default: MINORITY) 
指定如何解决路径分解中的歧义。(默认值: MINORITY)

* BlackLevel - Set the threshold level (a number between 0 and 1) for converting input images to bitmaps. Pixels whose brightness is less than this value are converted to black, all other pixels to white. (Default: 0.5) 
设置将图像转换为位图的阈值，介于 0-1 之间。亮度小于该值的像素将转换为黑色，其他所有像素将转换为白色。(默认值: 0.5)

* AlphaMax - Set the corner threshold parameter. The smaller this value, the more sharp corners will be produced. If this parameter is 0, then no smoothing will be performed and the output is a polygon. If this parameter is greater than 4/3, then all corners are suppressed and the output is completely smooth. (Default: 1) 
设置拐角阈值参数，值越小产生的锐角越多。如果为 0 则不执行任何平滑操作，并且输出为多边形；如果大于 4/3，将抑制所有角，输出完全平滑。(默认值: 1)

* TurdSize - Suppress speckles of up to this many pixels. (Default: 2) 
抑制不超过此数值的像素斑点。(默认值: 2)

* Unit - Set output quantization. Coordinates in the output are rounded to 1/unit pixels. The default of 10 usually gives good results. For some of the debug modes, a value of 100 gives more accurate output. (Default: 10) 
设置输出量化。输出中的坐标四舍五入为 1/unit 像素。默认值通常会产生良好的结果，但对于某些调试模式，值为100可提供更准确的输出。(默认值: 10)

* OptTolerance - Set the curve optimization tolerance. Larger values allow more consecutive Bezier curve segments to be joined together in a single segment, at the expense of accuracy. (Default: 0.2) 
设置曲线优化公差。较大的值可使更多连续的贝塞尔曲线段在单个线段中连接在一起，但会降低精度。(默认值: 0.2)

* LongCurve - Turn off curve optimization. Normally IMAGIC tries to join adjacent Bezier curve segments when this is possible. This option disables this behavior, resulting in a larger file size. (Default: FALSE) 
关闭曲线优化。通常，算法会尝试合并相邻的贝塞尔曲线段，禁用后将导致更大的文件大小。(默认值: 否)

* Opaque - Fill in the white parts of the image opaquely, instead of leaving them transparent. This only applies to interior white parts, i.e., those that are enclosed inside a black outline. (Default: FALSE) 
不透明地填充图像的白色部分。仅适用封闭在黑色轮廓内的白色部件。(默认值: 否)

* Invert - Invert the input bitmap before processing. (Default: FALSE) 
位图反转。(默认值: 否)

## building & Running
```
git clone https://github.com/seatwork/app-imagic.git
cd app-imagic
npm install
npm start
```
