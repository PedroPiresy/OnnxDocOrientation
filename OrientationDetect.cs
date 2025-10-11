using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Collections.Generic;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

namespace OnnxOrientationDetector
{
    public class OrientationOnnxModel : IDisposable
    {
        private readonly InferenceSession _session;

        public OrientationOnnxModel(string modelPath, bool useGpu = true)
        {
            try
            {
                if (useGpu)
                {
                    var options = new SessionOptions();
                    options.AppendExecutionProvider_DML(0);
                    _session = new InferenceSession(modelPath, options);
                    Console.WriteLine("ONNX Runtime inicializado com DirectML (GPU).");
                }
                else
                {
                    _session = new InferenceSession(modelPath);
                    Console.WriteLine("ONNX Runtime inicializado no modo CPU.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Falha ao iniciar GPU: {ex.Message}");
                _session = new InferenceSession(modelPath);
            }
        }

        public (int orientationDeg, float confidence, double inferenceMs) Predict(string imagePath)
        {
            const int inputWidth = 512;
            const int inputHeight = 512;

            using var bmp = new Bitmap(imagePath);
            using var resized = new Bitmap(bmp, new Size(inputWidth, inputHeight));

            var sw = Stopwatch.StartNew();
            var tensor = new DenseTensor<float>(new[] { 1, 3, inputHeight, inputWidth });

            //Pré-processamento rápido (AllowUnsafeBlocks no .csproj habilitado)
            var data = resized.LockBits(
                new Rectangle(0, 0, resized.Width, resized.Height),
                ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);

            unsafe
            {
                byte* ptr = (byte*)data.Scan0;
                for (int y = 0; y < inputHeight; y++)
                {
                    for (int x = 0; x < inputWidth; x++)
                    {
                        int offset = y * data.Stride + x * 3;
                        tensor[0, 0, y, x] = ptr[offset + 2] / 255f; // R
                        tensor[0, 1, y, x] = ptr[offset + 1] / 255f; // G
                        tensor[0, 2, y, x] = ptr[offset + 0] / 255f; // B
                    }
                }
            }

            resized.UnlockBits(data);

            var inputs = new List<NamedOnnxValue>
            {
                NamedOnnxValue.CreateFromTensor("input", tensor)
            };

            using var results = _session.Run(inputs);
            sw.Stop();

            var output = results.First().AsEnumerable<float>().ToArray();
            int bestIndex = Array.IndexOf(output, output.Max());
            float confidence = output[bestIndex];
            int deg = bestIndex * 90;

            return (deg, confidence, sw.Elapsed.TotalMilliseconds);
        }

        public void Dispose() => _session?.Dispose();
    }
}
