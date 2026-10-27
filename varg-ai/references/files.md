# Files, references, and lineage

## Reuse before uploading or regenerating

`list_files` searches the current account's library. It accepts `query`, `kind`,
`workspace`, `limit`, and a returned pagination `cursor`. `get_file({ file_id })`
retrieves a selected file. Use actual IDs and URLs returned by these tools.

For a previous varg output:

```js
get_lineage({ url: previousOutputUrl });
// Or get_lineage({ file_id: selectedFileId }).
```

This can recover the model, originating job, input, and render TSX in `input.code`.
Access is account-scoped. An uploaded file may have no generation lineage;
`no_lineage` is not a reason to invent its original prompt.

## Local files and chat attachments

The hosted server cannot read files on the user's or agent's computer. A
filesystem path or an attachment visible in chat is not automatically a
reachable media URL.

In clients supporting MCP Apps, call:

```js
upload_file_widget({ purpose: "Use this photo as the character reference for the approved scene" });
```

The user picks the file. Wait for the widget's returned URL/file ID or follow-up
message before continuing. The `purpose` preserves what should happen next;
opening the widget does not mean the file has already uploaded.

If MCP Apps are unavailable, use the client's supported upload/byte-transfer
facility or ask for a reachable URL. Explain the missing transfer capability
when the client cannot provide one. Do not send a local path to the hosted
`upload_file` tool or silently move the workflow to a local runtime.

## Import a reachable URL

```js
upload_file({ url: sourceUrl, filename: "reference.png" });
```

`upload_file` accepts exactly one of `url`, `data`, or `path`. Hosted use rejects
`path`; base64 `data` is limited to small files (currently 2 MiB decoded).
Prefer URL import or an upload widget over placing large media in the conversation.
Respect current size and type limits from the tools.

Continue using the returned public media URL. Private URLs need an authorized,
client-supported transfer; do not make unrelated content public to bypass access.

## Programmatic upload sessions

Use this only when the client has a byte-transfer feature:

1. Call `create_upload({ media_type, size, filename? })` with the actual byte size.
2. If the response already describes a deduplicated file, reuse that result.
3. Otherwise have the client transfer bytes using the returned upload session.
   `create_upload` alone does not transfer anything.
4. Prefer the returned upload proxy when supported; it normally registers the file.
   For a raw upload URL, use `complete_upload({ public_url, ...metadata })` afterward.
   Inspect registration status instead of assuming success.
5. Use the returned media URL in the generation request, not the session/proxy URL.

Do not expose upload-session secrets in the final answer. Expired sessions need
a new upload session, not a new media generation.

## Feed references into the right schema

Many image/video capabilities use `files: [{ url }]`, while transcription,
analysis, and media operations use other fields. `get_tool` for the selected
model is authoritative. Determine which inputs are identity references, source
frames, scene references, or audio instead of treating them as interchangeable.

Keep approved inputs and output URLs when iterating. File deletion is an
explicit user action, not a prerequisite for retrying a job or refreshing a cache.
