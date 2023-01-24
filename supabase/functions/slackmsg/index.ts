// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
function jsonToForm(json: any) {
  var formBody: string[] | string = [];
  for (var property in json) {
    var encodedKey: any = encodeURIComponent(property);
    var encodedValue: any = encodeURIComponent(json[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
}

// console.log("Hello from Functions!")
const slackUrl = "https://slack.com/api/chat.postMessage";
const slackAuth = atob(
  "eG94Yi00NTk1MDU2OTkzNTcwLTQ2NzYyODQ3Mzg4MzctZEI2SmFTSmhBaFR0RHJUbUNLWFhveFlO"
);
const slackChannel = "C04JYH9GE5S";
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { msg } = await req.json();
    console.log("message rec",msg)
    await fetch(slackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: jsonToForm({
        channel: slackChannel,
        text: msg,
        token: slackAuth,
      }),
    });
    // return new Response(JSON.stringify({ok: "okahy"}, {
    //   headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    //   status: 200,
    // }));
    return new Response(JSON.stringify({ ok: "success" }),  {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    console.log(error.message)
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
