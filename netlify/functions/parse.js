const stationCodes = {
  "pune": ["Pune", "PUNE"],
  "delhi": ["New Delhi", "NDLS"],
  "new delhi": ["New Delhi", "NDLS"],
  "mumbai": ["Mumbai Central", "MMCT"],
  "mumbai central": ["Mumbai Central", "MMCT"],
  "kolkata": ["Kolkata", "KOAA"],
  "howrah": ["Howrah", "HWH"],
  "bengaluru": ["Bengaluru", "SBC"],
  "bangalore": ["Bengaluru", "SBC"],
  "hyderabad": ["Hyderabad", "SC"],
  "chennai": ["Chennai Central", "MAS"],
  "ahmedabad": ["Ahmedabad", "ADI"],
  "jaipur": ["Jaipur", "JP"]
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: JSON.stringify({error:"Method not allowed"}) };
  try {
    const { text } = JSON.parse(event.body || "{}");
    if (!text || text.length > 1000) return { statusCode: 400, body: JSON.stringify({error:"Please provide a request under 1000 characters."}) };

    const key = process.env.OPENAI_API_KEY;
    if (!key) return { statusCode: 500, body: JSON.stringify({error:"OpenAI API key is not configured in Netlify environment variables yet."}) };

    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        from_name:{type:"string"}, from_code:{type:"string"},
        to_name:{type:"string"}, to_code:{type:"string"},
        journey_date:{type:"string"},
        quota:{type:"string",enum:["TQ","GN"]},
        quota_label:{type:"string"},
        travel_class:{type:"string",enum:["1A","2A","3A","SL","CC","2S"]},
        class_label:{type:"string"},
        passengers:{type:"array",items:{type:"object",additionalProperties:false,properties:{name:{type:"string"},age:{type:"integer"},gender:{type:"string"}},required:["name","age","gender"]}}
      },
      required:["from_name","from_code","to_name","to_code","journey_date","quota","quota_label","travel_class","class_label","passengers"]
    };

    const response = await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body:JSON.stringify({
        model:"gpt-4o-mini",
        input:[
          {role:"system",content:`You are Sugam's booking-intent parser. Convert the user's English or Hinglish railway request into the exact JSON schema. Do not book anything and do not invent live availability. Use these synthetic station mappings when applicable: ${JSON.stringify(stationCodes)}. For Tatkal use quota TQ and label Tatkal; otherwise GN and General. Map 3AC to 3A, Sleeper to SL, Chair Car to CC, Second Sitting to 2S, First AC to 1A, Second AC to 2A. Resolve relative dates using the current date supplied by the server context only when possible; if uncertain, say 'date not specified'. Preserve passenger names and ages stated by the user.`},
          {role:"user",content:`Current date: ${new Date().toISOString().slice(0,10)}\nRequest: ${text}`}
        ],
        text:{format:{type:"json_schema",name:"booking_intent",strict:true,schema}}
      })
    });

    const raw = await response.json();
    if(!response.ok) return {statusCode:502,body:JSON.stringify({error:raw.error?.message||"OpenAI request failed."})};

    let output = raw.output_text;
    if(!output && raw.output){
      const part = raw.output.flatMap(x=>x.content||[]).find(x=>x.type==="output_text");
      output=part?.text;
    }
    if(!output) throw new Error("No structured output returned.");
    const parsed=JSON.parse(output);

    // Deterministic post-model validation for known station codes.
    const fromKey=parsed.from_name.toLowerCase();
    const toKey=parsed.to_name.toLowerCase();
    if(stationCodes[fromKey]) [parsed.from_name,parsed.from_code]=stationCodes[fromKey];
    if(stationCodes[toKey]) [parsed.to_name,parsed.to_code]=stationCodes[toKey];

    return {statusCode:200,headers:{"Content-Type":"application/json","Cache-Control":"no-store"},body:JSON.stringify(parsed)};
  } catch(e) {
    return {statusCode:500,body:JSON.stringify({error:e.message||"Unexpected server error."})};
  }
};
