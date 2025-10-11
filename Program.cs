using OnnxOrientationDetector;
class Program
{
    static void Main()
    {
        string modelPath = @"C:\Users\user_name\source\repos\OrientationDetectConsole\Model_Orientation\";
        string imagePath = @"C:\Users\user_name\Desktop\sample.png";

        using var model = new OrientationOnnxModel(modelPath, useGpu: false);
        Console.WriteLine("Detectando orientação...");
        var (angle, confidence, ms) = model.Predict(imagePath);
        Console.WriteLine($"\n Orientação prevista: {angle}°");
        Console.WriteLine($" Confiança: {confidence:F3}");
        Console.WriteLine($" Tempo total: {ms:F1} ms");
    }
}