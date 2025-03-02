import { Detail, List, Color, getPreferenceValues } from "@raycast/api";
// import { homedir } from "os";
import { Note } from "./bear-db";
import NoteActions from "./note-actions";
import { formatDistanceToNowStrict } from "date-fns";

// const BEAR_LOCAL_FILES_PATH =
//   homedir() + "/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/Local Files";

export function formatBearAttachments(text: string | null): string {
  // Return empty string if input is null
  if (text === null) return "";

  let result = text
    // Replace image links with camera emoji
    .replace(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g, "📸")

    // Replace PDF links with document emoji and link text
    .replace(/\[(.*?)\]\((?:.*\/)?([^/]+\.pdf)\)/g, (_, label) => `📃 ${label}\n`)

    // Remove preview caption comments
    .replace(/<!--\s*{"preview":"true"}\s*-->/g, "\n")

    // Remove file embed caption comments
    .replace(/<!--\s*{"embed":"true", "preview":"true"}\s*-->/g, "\n")

    // Replace checkbox marks with squares
    .replace(/^(- \[ \].*)$/gm, (match) => match.replace(/- \[ \]/, "□") + "\n")
    .replace(/^(- \[x\].*)$/gm, (match) => match.replace(/- \[x\]/, "✔︎") + "\n");

  // List of color emojis to replace
  const colorEmojis = ["🟢", "🔴", "🔵", "🟡", "🟣"];

  // Replace colored highlights with code-formatted text
  colorEmojis.forEach((emoji) => {
    result = result.replace(new RegExp(`==${emoji}(.+?)==`, "g"), "`$1`");
  });

  // Replace remaining default highlights with code-formatted text
  return result.replace(/==([^=]+)==/g, "`$1`");
}

export default function PreviewNote({ note }: { note: Note }) {
  const { showMetadataInListView } = getPreferenceValues();
  const noteContent = note.encrypted ? `# ${note.title}\n\n*This note's content is encrypted*` : note.text;
  return (
    <Detail
      markdown={formatBearAttachments(noteContent)}
      navigationTitle={note.title}
      actions={<NoteActions isNotePreview={true} note={note} />}
      metadata={showMetadataInListView ? <NoteMetadata note={note} /> : null}
    />
  );
}

function NoteMetadata({ note }: { note: Note }) {
  return (
    <List.Item.Detail.Metadata>
      <List.Item.Detail.Metadata.Label
        title="Last modified"
        text={formatDistanceToNowStrict(note.modifiedAt, { addSuffix: true })}
      />
      <List.Item.Detail.Metadata.Label
        title="Created"
        text={formatDistanceToNowStrict(note.createdAt, { addSuffix: true })}
      />
      <List.Item.Detail.Metadata.Label title="Word count" text={`${note.wordCount} words`} />
      <List.Item.Detail.Metadata.TagList title="Tags">
        {note.tags.length === 0 ? (
          <List.Item.Detail.Metadata.TagList.Item text="Untagged" />
        ) : (
          note.tags.map((tag) => <List.Item.Detail.Metadata.TagList.Item text={tag} key={tag} color={Color.Yellow} />)
        )}
      </List.Item.Detail.Metadata.TagList>
    </List.Item.Detail.Metadata>
  );
}
