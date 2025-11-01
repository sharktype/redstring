// Types of LLMs for this engine:

// - Main storytelling LLM - does the actual job of generating story content and calling tools.
//   - Called every message.
// - Summarisation LLM - summarises long content to condense it for a better context window fit.
//   - With defaults, called every 32 messages.
// - Worldbuilding generator LLM - standalone and optional LLM to generate worldbuilding content.
//   - Called manually via UI.
// - Character generator LLM - as above but with characters.
//   - Called manually via UI.
// - Hypebot LLM - a fun extra LLM to generate hype messages with each message.
//   - Called every message if enabled. Context provided is a minimal set of latest messages and its last response.
//     Note that this means that it could be missing important context. User should be allowed to send as much context
//     as they want via the settings, which currently do not exist.

export default function Mappings() {
	return <>mappings</>;
}
