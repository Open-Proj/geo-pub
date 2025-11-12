Deno.serve(request =>
  new Response("Hello, world", {
    headers: { "Content-Type": "text/plain" }
  })
);
