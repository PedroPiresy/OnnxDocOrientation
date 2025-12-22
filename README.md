
# OnnxDocOrientation

## 📋 Visão Geral

DOC-OrientationDetect é uma aplicação console desenvolvida em C# para detectar e classificar a orientação de documentos. O projeto utiliza o modelo YOLOv8 para identificar automaticamente a orientação atual de um documento (0°, 90°, 180° ou 270°), fornecendo informações precisas sobre como o documento está posicionado.

## 🎯 Objetivo

O principal objetivo desta ferramenta é automatizar o processo de classificação de orientação em documentos digitalizados, facilitando a identificação de como documentos estão posicionados para posterior processamento ou correção manual/automática em pipelines de processamento de documentos.

## 🏗️ Estrutura do Projeto

```
DOC-OrientationDetect/
│
├── Model_Orientation/          # Diretório contendo o modelo de ML
├── OrientationDetect.cs        # Classe principal de detecção
├── Program.cs                  # Ponto de entrada da aplicação
├── OrientationDetectConsole.csproj  # Arquivo de projeto
├── OrientationDetectConsole.sln     # Solução do Visual Studio
├── .gitignore                  # Arquivos ignorados pelo Git
└── .gitattributes              # Atributos do Git

```

## 🚀 Funcionalidades

-   **Classificação de Orientação com YOLOv8**: Identifica a orientação atual do documento usando o modelo YOLOv8
-   **Detecção Precisa**: Classifica documentos em 4 orientações possíveis (0°, 90°, 180°, 270°)
-   **Processamento Rápido**: Utiliza a eficiência do YOLO para classificação em tempo real
-   **Interface Console**: Aplicação de linha de comando para fácil integração em pipelines
-   **Saída de Classificação**: Retorna a orientação detectada sem modificar o documento original

## 💻 Tecnologias Utilizadas

-   **Linguagem**: C# (.NET)
-   **Tipo**: Aplicação Console
-   **Modelo de IA**: YOLOv8 (You Only Look Once v8)
-   **Framework ML**: ONNX Runtime / ML.NET (para inferência do modelo YOLO)
-   **Framework**: .NET (versão a ser especificada no .csproj)

### Por que YOLOv8?

O YOLOv8 é uma das arquiteturas mais avançadas para detecção e classificação de objetos em tempo real:

-   **Velocidade**: Inferência extremamente rápida
-   **Precisão**: Alta acurácia na classificação de orientação
-   **Eficiência**: Baixo consumo de recursos computacionais
-   **Versatilidade**: Modelo facilmente adaptável para diferentes tarefas

## 📦 Requisitos

### Pré-requisitos

-   .NET SDK 6.0 ou superior
-   Visual Studio 2019/2022 ou Visual Studio Code
-   Windows, Linux ou macOS

### Para usar GPU (Opcional)

-   GPU NVIDIA com suporte CUDA
-   CUDA Toolkit 11.x ou 12.x
-   cuDNN compatível
-   Driver NVIDIA atualizado

### Dependências

As dependências específicas do projeto estão definidas no arquivo `OrientationDetectConsole.csproj` e incluem:

-   **Microsoft.ML.OnnxRuntime** (CPU) ou **Microsoft.ML.OnnxRuntime.Gpu** (GPU)
-   Bibliotecas de processamento de imagem (System.Drawing ou SixLabors.ImageSharp)

## 🚀 Quick Start

### Uso Rápido em 3 Passos

**1. Clone e compile o projeto**

```bash
git clone https://github.com/PedroPiresy/DOC-OrientationDetect.git
cd DOC-OrientationDetect
dotnet restore
dotnet build

```

**2. Edite o Program.cs**

```csharp
// Altere apenas estas duas linhas:
string modelPath = @"C:\seu\caminho\Model_Orientation\";
string imagePath = @"C:\seu\caminho\documento.png";

```

**3. Execute**

```bash
dotnet run

```

Pronto! Você verá a orientação detectada, confiança e tempo de processamento.

## 📖 Como Usar

### Configuração Inicial

O uso é muito simples! Basta editar o arquivo `Program.cs` e alterar os caminhos:

```csharp
static void Main()
{
    // 1. Configure o caminho do modelo YOLOv8
    string modelPath = @"C:\Users\seu_usuario\source\repos\OrientationDetectConsole\Model_Orientation\";
    
    // 2. Configure o caminho da imagem que deseja classificar
    string imagePath = @"C:\Users\seu_usuario\Desktop\seu_documento.png";
    
    // 3. Escolha se deseja usar GPU (true) ou CPU (false)
    using var model = new OrientationOnnxModel(modelPath, useGpu: false);
    
    Console.WriteLine("Detectando orientação...");
    
    // 4. Execute a predição
    var (angle, confidence, ms) = model.Predict(imagePath);
    
    // 5. Visualize os resultados
    Console.WriteLine($"\n Orientação prevista: {angle}°");
    Console.WriteLine($" Confiança: {confidence:F3}");
    Console.WriteLine($" Tempo total: {ms:F1} ms");
}

```

### Execução

```bash
# Execute o projeto
dotnet run

```

### Exemplo de Saída

```
Detectando orientação...

 Orientação prevista: 90°
 Confiança: 0.982
 Tempo total: 156.3 ms

```

### Opções de Configuração

**useGpu: false** (CPU)

-   Mais compatível
-   Não requer drivers CUDA
-   Velocidade moderada (~150-300ms)

**useGpu: true** (GPU)

-   Requer GPU NVIDIA com CUDA
-   Muito mais rápido (~20-50ms)
-   Requer CUDA Toolkit e cuDNN instalados

### Formatos de Imagem Suportados

-   ✅ PNG
-   ✅ JPG/JPEG
-   ✅ BMP
-   ✅ TIFF

## 🧩 Componentes Principais

### OrientationDetect.cs (OrientationOnnxModel)

Classe responsável pela lógica principal de detecção de orientação:

-   **Construtor**: Carrega o modelo YOLOv8 do caminho especificado
-   **useGpu**: Parâmetro para escolher entre inferência CPU ou GPU
-   **Predict()**: Método principal que recebe o caminho da imagem e retorna:
    -   `angle`: Ângulo de orientação detectado (0°, 90°, 180° ou 270°)
    -   `confidence`: Score de confiança da predição (0.0 a 1.0)
    -   `ms`: Tempo de inferência em milissegundos
-   Pré-processamento automático para formato YOLO
-   Interpretação dos resultados da inferência

### Program.cs

Ponto de entrada da aplicação com estrutura simples:

```csharp
static void Main()
{
    // Configuração de caminhos
    string modelPath = "...";
    string imagePath = "...";
    
    // Inicialização do modelo
    using var model = new OrientationOnnxModel(modelPath, useGpu: false);
    
    // Predição
    var (angle, confidence, ms) = model.Predict(imagePath);
    
    // Exibição dos resultados
    Console.WriteLine($"Orientação: {angle}°");
}

```

### Model_Orientation/

Diretório contendo:

-   Modelo YOLOv8 treinado (formato .onnx)
-   Arquivo de configuração do modelo
-   Classes de orientação (labels): 0°, 90°, 180°, 270°
-   Metadados e parâmetros de inferência

## 🔍 Detalhes Técnicos

### Processo de Classificação com YOLOv8

1.  **Carregamento da Imagem**: A imagem do documento é carregada em memória
2.  **Pré-processamento**:
    -   Redimensionamento para o tamanho de entrada do YOLO (geralmente 640x640)
    -   Normalização dos valores de pixel
    -   Conversão para formato tensor
3.  **Inferência YOLOv8**: O modelo classifica a orientação do documento
4.  **Pós-processamento**:
    -   Interpretação da saída do modelo
    -   Extração da classe de orientação com maior confiança
5.  **Saída**: Retorno da orientação classificada e nível de confiança

### Como o YOLOv8 Classifica Orientação

O modelo YOLOv8 foi treinado especificamente para reconhecer padrões visuais que indicam a orientação do documento:

-   **Features de Texto**: Direção das linhas de texto
-   **Elementos Estruturais**: Cabeçalhos, rodapés, logotipos
-   **Padrões Visuais**: Orientação natural de elementos do documento

### Classes de Orientação

O modelo classifica documentos em quatro categorias:

-   **0° (Normal)**: Orientação correta de leitura
-   **90° (Rotacionado à Direita)**: Documento rotacionado 90° no sentido horário
-   **180° (Invertido)**: Documento de cabeça para baixo
-   **270° (Rotacionado à Esquerda)**: Documento rotacionado 270° (ou 90° anti-horário)

### Confiança da Classificação

O YOLOv8 retorna um score de confiança (0-1) para cada classificação:

-   **> 0.9**: Alta confiança
-   **0.7-0.9**: Confiança média
-   **< 0.7**: Baixa confiança (pode necessitar revisão manual)

## 🎯 Casos de Uso

### 1. Pré-processamento de Documentos

Classificar a orientação de documentos antes de aplicar correções automáticas ou manuais.

### 2. Pipeline de OCR

Identificar a orientação correta antes de aplicar OCR (Reconhecimento Óptico de Caracteres) para melhorar a precisão.

### 3. Auditoria de Documentos

Verificar se documentos digitalizados foram escaneados na orientação correta.

### 4. Integração com Sistemas de Gestão

Fornecer metadados de orientação para sistemas de gerenciamento de documentos.

### 5. Quality Assurance

Identificar documentos que precisam ser reescaneados ou corrigidos em processos de digitalização em massa.

## 🔄 Fluxo de Trabalho

```
[Usuário edita Program.cs]
         ↓
[Define modelPath e imagePath]
         ↓
[Executa: dotnet run]
         ↓
[OrientationOnnxModel carrega modelo]
         ↓
[Pré-processamento da imagem]
         ↓
[Inferência do Modelo YOLOv8]
         ↓
[Retorno: (angle, confidence, ms)]
         ↓
[Exibição no Console]

```

### Exemplo Completo de Uso

```csharp
// Program.cs
using System;

class Program
{
    static void Main()
    {
        // Configuração
        string modelPath = @"C:\Users\pedro\source\repos\OrientationDetectConsole\Model_Orientation\";
        string imagePath = @"C:\Users\pedro\Desktop\documento_digitalizado.png";
        
        // Inicialização (usando CPU)
        using var model = new OrientationOnnxModel(modelPath, useGpu: false);
        
        Console.WriteLine("Detectando orientação...");
        
        // Execução
        var (angle, confidence, ms) = model.Predict(imagePath);
        
        // Resultados
        Console.WriteLine($"\n Orientação prevista: {angle}°");
        Console.WriteLine($" Confiança: {confidence:F3}");
        Console.WriteLine($" Tempo total: {ms:F1} ms");
        
        // Interpretação
        if (confidence > 0.9)
            Console.WriteLine(" Status: Alta confiança ✓");
        else if (confidence > 0.7)
            Console.WriteLine(" Status: Confiança média");
        else
            Console.WriteLine(" Status: Baixa confiança - revisar manualmente");
    }
}

```

### Saída Esperada

```
Detectando orientação...

 Orientação prevista: 180°
 Confiança: 0.956
 Tempo total: 142.8 ms
 Status: Alta confiança ✓

```

## ⚙️ Configuração

### Configuração Básica

Toda a configuração é feita diretamente no arquivo `Program.cs`:

```csharp
// 1. Caminho do modelo (pasta contendo o modelo .onnx)
string modelPath = @"C:\caminho\para\Model_Orientation\";

// 2. Caminho da imagem a ser classificada
string imagePath = @"C:\caminho\para\imagem.png";

// 3. Usar GPU (true) ou CPU (false)
using var model = new OrientationOnnxModel(modelPath, useGpu: false);

```

### Opções de Performance

**CPU (useGpu: false)**

```csharp
using var model = new OrientationOnnxModel(modelPath, useGpu: false);

```

-   ✅ Funciona em qualquer máquina
-   ✅ Não requer configuração adicional
-   ⏱️ Tempo: ~150-300ms por imagem

**GPU (useGpu: true)**

```csharp
using var model = new OrientationOnnxModel(modelPath, useGpu: true);

```

-   🚀 Muito mais rápido
-   ⚡ Tempo: ~20-50ms por imagem
-   ⚠️ Requer GPU NVIDIA + CUDA

### Testando Múltiplas Imagens

Para processar várias imagens, você pode modificar o `Program.cs`:

```csharp
static void Main()
{
    string modelPath = @"C:\...\Model_Orientation\";
    string[] images = {
        @"C:\docs\doc1.png",
        @"C:\docs\doc2.png",
        @"C:\docs\doc3.png"
    };
    
    using var model = new OrientationOnnxModel(modelPath, useGpu: false);
    
    foreach (var imagePath in images)
    {
        Console.WriteLine($"\nProcessando: {Path.GetFileName(imagePath)}");
        var (angle, confidence, ms) = model.Predict(imagePath);
        Console.WriteLine($"Orientação: {angle}° | Confiança: {confidence:F3} | Tempo: {ms:F1}ms");
    }
}

```

## 📊 Performance

### Métricas Esperadas

-   **Tempo de inferência**: ~50-200ms por imagem (dependendo do hardware)
-   **Acurácia do modelo**: >95% em documentos bem estruturados
-   **Tamanho do modelo**: ~6-11 MB (YOLOv8n/s)
-   **Formatos suportados**: JPG, PNG, TIFF, PDF (convertido para imagem)
-   **Requisitos de memória**: ~500MB RAM durante inferência

### Requisitos de Hardware

**Mínimo:**

-   CPU: Processador dual-core 2.0 GHz
-   RAM: 4 GB
-   Espaço em disco: 100 MB

**Recomendado:**

-   CPU: Processador quad-core 3.0 GHz ou GPU com suporte CUDA
-   RAM: 8 GB
-   Espaço em disco: 500 MB

## 🐛 Troubleshooting

### Problemas Comuns

**Erro ao carregar o modelo YOLOv8**

```
Solução: 
- Verifique se o diretório Model_Orientation contém o arquivo .onnx
- Confirme que o caminho modelPath está correto
- Certifique-se de que as barras do caminho estão corretas (use @ antes da string)

```

**FileNotFoundException**

```
Erro: Could not find file 'C:\Users\...\sample.png'

Solução: 
- Verifique se o arquivo de imagem existe no caminho especificado
- Use o caminho completo (absoluto) da imagem
- Verifique se você tem permissão de leitura no arquivo

```

**Classificação com baixa confiança (<0.7)**

```
Solução: 
- Verifique a qualidade da imagem (resolução, nitidez)
- Certifique-se de que o documento tem texto/elementos visíveis
- Imagens muito escuras ou com baixo contraste podem afetar o resultado
- Documentos sem texto claro são mais difíceis de classificar

```

**OutOfMemoryException**

```
Solução:
- Redimensione imagens muito grandes antes do processamento
- Use useGpu: false para consumir menos memória
- Feche outros aplicativos pesados

```

**GPU não está sendo utilizada (useGpu: true mas performance igual ao CPU)**

```
Solução:
- Instale Microsoft.ML.OnnxRuntime.Gpu em vez de .OnnxRuntime
- Verifique se CUDA Toolkit está instalado corretamente
- Confirme que sua GPU é compatível (NVIDIA com CUDA)
- Verifique drivers da GPU atualizados

```

**Erro de formato de imagem**

```
Solução: 
- Converta a imagem para PNG ou JPG
- Verifique se o arquivo não está corrompido
- Tente abrir a imagem em outro programa para confirmar que está válida

```

## 📚 Referências

-   Documentação do .NET: https://docs.microsoft.com/dotnet
-   YOLOv8 Ultralytics: https://docs.ultralytics.com/
-   ONNX Runtime: https://onnxruntime.ai/
-   ML.NET: https://dotnet.microsoft.com/apps/machinelearning-ai/ml-dotnet
-   Processamento de Imagens em C#: https://docs.microsoft.com/dotnet/api/system.drawing

## 🧠 Sobre o Modelo YOLOv8

YOLOv8 (You Only Look Once version 8) é a versão mais recente da família YOLO de modelos de detecção de objetos. Características principais:

-   **Arquitetura moderna**: Backbone e neck otimizados
-   **Anchor-free**: Não depende de âncoras predefinidas
-   **Múltiplas variantes**: Nano (n), Small (s), Medium (m), Large (l), Extra-Large (x)
-   **Transfer Learning**: Facilmente adaptável para tarefas específicas como classificação de orientação

### Adaptação para Classificação de Orientação

O modelo foi treinado especificamente para classificar orientação de documentos, transformando a tarefa de detecção em uma tarefa de classificação de imagens com 4 classes (0°, 90°, 180°, 270°).
