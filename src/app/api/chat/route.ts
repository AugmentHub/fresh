import OpenAI from 'openai';
// import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai-edge';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
export const dynamic = 'force-dynamic';
 
export async function POST(req: Request) {
  const { notes, images } = await req.json();

  console.log("images = ", images.length);

  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-vision-preview',
    max_tokens: 4096,
    messages: [
        {
            role: 'user',
            // @ts-ignore
            content: [
                { type: "text", text: `You are an AI that accepts images and user notes and returns what the user is happening and insights from the scene. user notes: ${notes}`},
                ...images.map((image: any) => (
                  {
                    type: "image_url",
                    image_url: { 
                        "url": `data:image/jpeg;base64,${image}`
                    }
                }))
            ]
        }
    ],
  });

  console.log("response = ", response);

    let jsonString = response.choices[0].message.content;

    console.log("jsonString = ", jsonString);
    
    // Remove markdown code block syntax (more robust approach)
    // jsonString = jsonString.replace(/```json\n?/g, ''); // Remove starting backticks and optional newline
    // jsonString = jsonString.replace(/\n?```/g, ''); // Remove ending backticks and optional newline
    
    // Trim any residual whitespace that might cause parsing issues
    // jsonString = jsonString.trim();
    
    // Parse the JSON string to an object
    // const jsonObject = jsonString ? JSON.parse(jsonString) : {};
    
    // Return the JSON object
    return new Response(JSON.stringify(/*jsonObject */jsonString))
 







  // Convert the response into a friendly text-stream
  // const stream = OpenAIStream(response);
  // Respond with the stream
  // return new StreamingTextResponse(stream);
}

// OLD Prompt

/* `You are an AI that takes an image of food and creates a JSON object based on this image. Have 3 variables included: food, calories, and protein. Make sure to ONLY return a SINGLE json object. NEVER return a string or an array. example1: { food: pringles, calories: 200, protein: 1 }, example2: { food: chicken and carrots, calories: 270, protein: 22 } if you're unsure of a variable, still do it and provide your best guess instead. If there are multiple images, add all the foods to the same foods variable. user notes: ${notes}` */

// "You are an AI that takes an image of food and creates a JSON object based on this image. Have 3 variables included: food, calories, and protein."

/* const createRequestMessages = async (req: any) => {
    // console.log("req = ", await req.text());

    const { messages, data } = await req.json();

    // console.log("messages = ", messages);
    // console.log("data = ", data);

    if (!data?.imageUrl) return messages;

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];
    return [
        ...initialMessages,
        {
            ...currentMessage, 
            content: [
                { type: "text", text: currentMessage.content },
                { type: "image", url: data.imageUrl }
            ]
        }
    ]
} */

  // const { messages, data } = await req.json();
  // console.log("req = ", await req.json());
  // const inputMessages = await req.json();
  // const messages = await req.text();
  // console.log("messages = ", messages);
  /* const completionMessage: ChatCompletionRequestMessage = {
    role: 'user',
    content: messages,
  }*/
  // const inputMessages = await createRequestMessages(req);

  // console.log("inputMessages = ", inputMessages);
  // console.log("req = ", req);
 
  // Ask OpenAI for a streaming chat completion given the prompt