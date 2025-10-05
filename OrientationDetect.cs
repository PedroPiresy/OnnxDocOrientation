using Emgu.CV;
using Emgu.CV.CvEnum;
using Emgu.CV.Structure;
using Tesseract;
using System.Collections.Concurrent;

namespace OrientationDetectConsole
{
    public static class OrientationDetector
    {
        private const int MAX_DIMENSION = 1600;
        private const int PADDING = 20;
        private const double MIN_CONFIDENCE_THRESHOLD = 0.3;
        private const int MIN_TEXT_LENGTH = 10;
        private const int MIN_WORDS = 5;

        public static int DetectTextOrientation(string imagePath, string tessDataPath)
        {
            if (!File.Exists(imagePath))
                throw new FileNotFoundException("Imagem não encontrada.", imagePath);

            using var original = new Image<Bgr, byte>(imagePath);
            using var gray = original.Convert<Gray, byte>();
            using var preprocessed = PreprocessImage(gray);

            var rotations = new[] { 0, 90, 180, 270 };
            var results = new ConcurrentBag<(int angle, double score, double confidence, int textLength, int validWords, double readability)>();

            // Processamento paralelo para melhor performance
            Parallel.For(0, rotations.Length, i =>
            {
                using var rotated = RotateImage(preprocessed, rotations[i]);
                var (confidence, text, textLength) = GetOcrMetrics(rotated, tessDataPath);
                var validWords = CountValidWords(text);
                var readability = CalculateReadability(text);
                var score = CalculateScore(confidence, textLength, validWords, readability);

                results.Add((rotations[i], score, confidence, textLength, validWords, readability));
                Console.WriteLine($"Testando rotação {rotations[i]}°: conf={confidence:F2}, texto={textLength}, palavras={validWords}, legib={readability:F2}, score={score:F4}");
            });

            // Encontra em qual rotação o texto fica mais legível
            var bestResult = results.OrderByDescending(r => r.score).First();

            if (bestResult.score < MIN_CONFIDENCE_THRESHOLD)
            {
                Console.WriteLine("⚠️ Aviso: Confiança baixa na detecção de orientação");
            }

            // Se o texto fica legível após rotacionar X graus, 
            // significa que a imagem está rotacionada (360 - X) graus
            int currentOrientation = (360 - bestResult.angle) % 360;

            Console.WriteLine($"\n✓ Texto legível após rotação de: {bestResult.angle}°");
            Console.WriteLine($"✓ Orientação atual da imagem: {currentOrientation}° (score: {bestResult.score:F4})");

            return currentOrientation;
        }

        private static Image<Gray, byte> PreprocessImage(Image<Gray, byte> gray)
        {
            var processed = gray.Clone();

            // Redimensiona mantendo aspect ratio
            if (processed.Width > MAX_DIMENSION || processed.Height > MAX_DIMENSION)
            {
                double scale = Math.Min((double)MAX_DIMENSION / processed.Width,
                                       (double)MAX_DIMENSION / processed.Height);
                int newWidth = (int)(processed.Width * scale);
                int newHeight = (int)(processed.Height * scale);
                processed = processed.Resize(newWidth, newHeight, Inter.Area);
            }

            // Aplicar desfoque gaussiano suave antes da binarização
            CvInvoke.GaussianBlur(processed, processed, new System.Drawing.Size(3, 3), 0);

            // Binarização com Otsu (mais confiável que adaptativa para OCR)
            CvInvoke.Threshold(processed, processed, 0, 255, ThresholdType.Otsu | ThresholdType.Binary);

            return processed;
        }

        private static (double confidence, string text, int textLength) GetOcrMetrics(Image<Gray, byte> image, string tessDataPath)
        {
            Image<Gray, byte>? padded = null;

            try
            {
                // Padding otimizado
                padded = new Image<Gray, byte>(image.Width + PADDING * 2, image.Height + PADDING * 2);
                padded.SetValue(new MCvScalar(255));

                var roi = new System.Drawing.Rectangle(PADDING, PADDING, image.Width, image.Height);
                image.CopyTo(padded.GetSubRect(roi));

                using var engine = new TesseractEngine(tessDataPath, "por", EngineMode.Default);

                // Configurações simplificadas e otimizadas
                engine.SetVariable("tessedit_pageseg_mode", "1"); // Automatic page segmentation with OSD

                using var mat = padded.Mat;
                using var buffer = new Emgu.CV.Util.VectorOfByte();
                CvInvoke.Imencode(".png", mat, buffer);

                using var pix = Pix.LoadFromMemory(buffer.ToArray());
                using var page = engine.Process(pix);

                var confidence = page.GetMeanConfidence();
                var text = page.GetText()?.Trim() ?? "";
                var textLength = text.Length;

                return (confidence, text, textLength);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro OCR: {ex.Message}");
                return (0.0, "", 0);
            }
            finally
            {
                padded?.Dispose();
            }
        }

        private static double CalculateScore(double confidence, int textLength, int validWords, double readability)
        {
            // Se não tem texto ou palavras suficientes, penaliza fortemente
            if (textLength < MIN_TEXT_LENGTH || validWords < MIN_WORDS)
                return 0.0;

            // Normaliza o comprimento do texto (diminui importância após 100 caracteres)
            double textScore = Math.Min(textLength / 100.0, 1.0);

            // Normaliza quantidade de palavras válidas (máximo em 50 palavras)
            double wordScore = Math.Min(validWords / 50.0, 1.0);

            // Score final: PRIORIZA LEGIBILIDADE
            // 60% legibilidade, 20% palavras válidas, 15% confiança, 5% texto
            return (readability * 0.6) + (wordScore * 0.2) + (confidence * 0.15) + (textScore * 0.05);
        }

        private static int CountValidWords(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return 0;

            // Divide em palavras e conta apenas as que parecem válidas
            var words = text.Split(new[] { ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries);

            int validCount = 0;
            foreach (var word in words)
            {
                // Remove pontuação das extremidades
                var cleaned = word.Trim('.', ',', ';', ':', '!', '?', '"', '\'', '(', ')', '[', ']');

                // Palavra válida: pelo menos 2 caracteres e maioria letras
                if (cleaned.Length >= 2)
                {
                    int letterCount = cleaned.Count(c => char.IsLetter(c));
                    if (letterCount >= cleaned.Length * 0.6) // 60% ou mais de letras
                    {
                        validCount++;
                    }
                }
            }

            return validCount;
        }

        private static double CalculateReadability(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return 0.0;

            int totalChars = text.Length;
            int letterCount = text.Count(c => char.IsLetter(c));
            int spaceCount = text.Count(c => c == ' ');
            int digitCount = text.Count(c => char.IsDigit(c));
            int uppercaseCount = text.Count(c => char.IsUpper(c));
            int lowercaseCount = text.Count(c => char.IsLower(c));

            // Proporção de letras (deve ser alta em texto normal)
            double letterRatio = (double)letterCount / totalChars;

            // Proporção de espaços (texto normal tem ~15-20%)
            double spaceRatio = (double)spaceCount / totalChars;
            double spaceScore = spaceRatio >= 0.10 && spaceRatio <= 0.25 ? 1.0 : Math.Max(0, 1.0 - Math.Abs(0.15 - spaceRatio) * 5);

            // Balanço entre maiúsculas e minúsculas (texto normal tem mais minúsculas)
            double caseBalance = letterCount > 0 ? Math.Min((double)lowercaseCount / letterCount, 1.0) : 0;

            // Detecta padrões de gibberish (muitos caracteres consecutivos estranhos)
            int strangeSequences = 0;
            for (int i = 0; i < text.Length - 2; i++)
            {
                if (!char.IsLetterOrDigit(text[i]) && !char.IsWhiteSpace(text[i]) &&
                    !char.IsLetterOrDigit(text[i + 1]) && !char.IsWhiteSpace(text[i + 1]))
                {
                    strangeSequences++;
                }
            }
            double strangeRatio = totalChars > 0 ? (double)strangeSequences / totalChars : 0;
            double strangenessPenalty = Math.Max(0, 1.0 - strangeRatio * 20);

            // Score combinado com forte peso em legibilidade
            return (letterRatio * 0.35) + (spaceScore * 0.25) + (caseBalance * 0.25) + (strangenessPenalty * 0.15);
        }

        private static Image<Gray, byte> RotateImage(Image<Gray, byte> src, double angle)
        {
            return (int)angle switch
            {
                90 => src.Rotate(90, new Gray(255)),
                180 => src.Rotate(180, new Gray(255)),
                270 => src.Rotate(270, new Gray(255)),
                _ => src.Clone()
            };
        }
    }
}