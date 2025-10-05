using Emgu.CV.Features2D;
using Emgu.CV.OCR;
using OrientationDetectConsole;
using System.Runtime.InteropServices;
using System.IO;

class Program
{
    static void Main()
    {
        string caminho = @"C:\Users\pedro.pires\Desktop\teste\";
        string[] arquivos = Directory.GetFiles(caminho);
        string tessDataPath = @"C:\Users\pedro.pires\source\repos\OrientationDetectConsole\tesseract";
        foreach (string arquivo in arquivos)
        {
            var orientation = OrientationDetector.DetectTextOrientation(arquivo, tessDataPath);
            Console.WriteLine($" - Orientação detectada: {orientation}°");
        }
    }
}
