import {NextResponse} from "next/server"
import {
    BedrockRuntimeClient,
    InvokeModelCommand,
  } from "@aws-sdk/client-bedrock-runtime";

// Create a Bedrock Runtime client in the AWS Region of your choice.
const client = new BedrockRuntimeClient({ region: "us-east-1" });

// Set the model ID, e.g., Llama 3 8B Instruct.
const modelId = "meta.llama3-8b-instruct-v1:0";

export async function POST(req){

    const userMessage = await req.json()  
    console.log(userMessage.user)

    // Embed the message in Llama 3's prompt format.
    const prompt = `
    <|begin_of_text|>
    <|start_header_id|>user<|end_header_id|>
    ${userMessage.user}
    <|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
    `;

    // Format the request payload using the model's native structure.
    const request = {
    prompt,
    // Optional inference parameters:
    max_gen_len: 512,
    temperature: 0.5,
    top_p: 0.9,
    };

    // Encode and send the request.
    const response = await client.send(
        new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(request),
        modelId,
        }),
    );

    // Decode the native response body.
    /** @type {{ generation: string }} */
    const nativeResponse = JSON.parse(new TextDecoder().decode(response.body));


    // Extract and print the generated text.
    const responseText = nativeResponse.generation;
    console.log(responseText);
    
    return NextResponse.json({message: responseText})
}