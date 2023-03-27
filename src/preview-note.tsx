import { Detail, List, Color, getPreferenceValues } from "@raycast/api";
import { homedir } from "os";
import { Note } from "./bear-db";
import NoteActions from "./note-actions";
import { formatDistanceToNowStrict } from "date-fns";

const BEAR_LOCAL_FILES_PATH =
  homedir() + "/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/Local Files";

export function formatBearAttachments(text: string | null, forPreview = true): string {
  if (text === null) {
    return "";
  }
  let result = text;
  // const matches = result.matchAll(/\[(?<type>file|image):(?<path>.+)\]/g);
  const matches = result.matchAll(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g);

  for (const match of matches) {
    // if (match.groups === undefined) {
    //   return result;
    // }
    let matchReplacement = "";
    // if (match.groups.type === "image" && !forPreview) {
    //   const imagePath = `${BEAR_LOCAL_FILES_PATH}/Note Images/${match.groups.path}`;
    //   matchReplacement = `![](${imagePath})`;
    // } else {
    // const fileLink = encodeURI(
    //   `file://${BEAR_LOCAL_FILES_PATH}/${match.groups.type === "file" ? "Note Files" : "Note Images"}/${
    //     match.groups.path
    //   }`
    // );
    matchReplacement = `[Image Preview Not ${"available"}](${"bear://"})
      `;
    result = result.replace(match[0], matchReplacement);
  }
  return result;
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
