// Alibaba Cloud (Qwen) Integration Proof File
// Dehinnet Kemi AI v2 - Hackathon Submission

export async function runQwenChemicalAnalysis(chemicalData: any) {
  try {
    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.ALIBABA_CLOUD_API_KEY}`
        },
        body: JSON.stringify({
          model: "qwen-turbo",
          input: {
            messages: [
              {
                role: "system",
                content:
                  "You are a chemical safety AI. Analyze risks, hazards, and safety precautions."
              },
              {
                role: "user",
                content: `Analyze this chemical data: ${JSON.stringify(chemicalData)}`
              }
            ]
          },
          parameters: {
            temperature: 0.3,
            result_format: "message"
          }
        })
      }
    );

    const data = await response.json();

    return {
      success: true,
      provider: "Alibaba Cloud - Qwen",
      model: "qwen-turbo",
      analysis: data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      provider: "Alibaba Cloud - Qwen",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
