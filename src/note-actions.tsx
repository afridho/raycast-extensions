import { Action, ActionPanel, Color, getPreferenceValues, Icon, showToast, Toast } from "@raycast/api";
import { HtmlRenderer, Parser } from "commonmark";
import open from "open";
import AddText from "./add-text";
import { Note } from "./bear-db";
import NoteLinks from "./note-links";
import PreviewNote, { formatBearAttachments } from "./preview-note";
import GrabUrl from "./grab-url";
// import NewNote from "./new-note";

function renderMarkdown(noteText: string): string {
  const reader = new Parser();
  const writer = new HtmlRenderer();
  let html;
  try {
    const text = formatBearAttachments(noteText);
    html = writer.render(reader.parse(text));
    return html;
  } catch (error) {
    console.log(`Error rendering with commonmark: ${String(error)}`);
    showToast(Toast.Style.Failure, "Error rendering markdown");
    return "";
  }
}

export function createBasicNote(title: string, tag: string | null) {
  const url = `bear://x-callback-url/create?title=${encodeURIComponent(title)}${tag ? `&text=%23${tag}%0A%0A` : ""}&show_window=yes&edit=yes&new_window=yes`;
  return open(url, { background: false });
}

function NotePreviewAction({ note }: { note: Note }) {
  return <Action.Push title="Open Preview" target={<PreviewNote note={note} />} icon={Icon.Sidebar} />;
}

type NoteActionsProps = {
  showDetail?: boolean;
  onDetail?: () => void;
  isNotePreview: boolean;
  note: Note;
  searchQuery?: string;
};

export default function NoteActions({ showDetail, onDetail, isNotePreview, note, searchQuery }: NoteActionsProps) {
  const { focusCursorAtEnd, openBearBehavior, openPriority } = getPreferenceValues<Preferences>();
  const edit = focusCursorAtEnd ? "yes" : "no";
  return (
    <ActionPanel>
      {openBearBehavior ? (
        <ActionPanel.Section title="Open">
          {isNotePreview ? null : openPriority === "view" ? (
            <NotePreviewAction note={note} />
          ) : (
            <Action.Open
              title="Open Note"
              target={`bear://x-callback-url/open-note?id=${note.id}&new_window=yes&edit=${edit}`}
              icon={Icon.AppWindow}
            />
          )}

          {openPriority === "view" ? (
            <Action.Open
              title="Open Note"
              target={`bear://x-callback-url/open-note?id=${note.id}&new_window=yes&edit=${edit}`}
              icon={Icon.AppWindow}
            />
          ) : (
            <NotePreviewAction note={note} />
          )}

          <Action.Open
            title="Open in Bear"
            target={`bear://x-callback-url/open-note?id=${note.id}&edit=${edit}`}
            icon={Icon.AppWindowList}
            shortcut={{ modifiers: ["cmd", "shift"], key: "enter" }}
          />
        </ActionPanel.Section>
      ) : (
        <ActionPanel.Section title="Open">
          <Action.Open
            title="Open in Bear"
            target={`bear://x-callback-url/open-note?id=${note.id}&edit=${edit}`}
            icon={Icon.Sidebar}
          />

          {note.encrypted ? null : (
            <Action.Open
              title="Open Note"
              target={`bear://x-callback-url/open-note?id=${note.id}&new_window=yes&edit=${edit}`}
              icon={Icon.Window}
            />
          )}
        </ActionPanel.Section>
      )}
      {/* MARK - Show Details  */}
      {!isNotePreview && (
        <ActionPanel.Section title="Settings">
          <Action
            title={showDetail ? "Hide Details" : "Show Details"}
            onAction={onDetail}
            icon={Icon.Eye}
            shortcut={{ modifiers: ["cmd"], key: "d" }}
          />
        </ActionPanel.Section>
      )}
      {note.encrypted ? null : (
        <ActionPanel.Section title="Edit">
          <Action.Push
            title="Add Text"
            icon={Icon.Plus}
            shortcut={{ modifiers: ["cmd"], key: "t" }}
            target={<AddText note={note} />}
          />
          <Action
            title="Move to Archive"
            onAction={() => {
              open(`bear://x-callback-url/archive?id=${note.id}&show_window=no`, { background: true });
              showToast(Toast.Style.Success, "Moved note to archive");
            }}
            icon={{ source: Icon.List, tintColor: Color.Orange }}
            shortcut={{ modifiers: ["ctrl", "shift"], key: "x" }}
          />
          <Action
            title="Move to Trash"
            onAction={() => {
              open(`bear://x-callback-url/trash?id=${note.id}&show_window=no`, { background: true });
              showToast(Toast.Style.Success, "Moved note to trash");
              const extensionUrl = `raycast://extensions/ridho-package/bear/index?arguments=${encodeURIComponent(
                JSON.stringify({ searchQuery: searchQuery || "" }),
              )}`;
              open(extensionUrl);
            }}
            icon={{ source: Icon.Trash, tintColor: Color.Red }}
            shortcut={{ modifiers: ["ctrl"], key: "x" }}
          />
        </ActionPanel.Section>
      )}
      <ActionPanel.Section title="Show in Raycast">
        <Action.Push
          title="Show Note Links"
          target={<NoteLinks note={note} />}
          icon={Icon.Link}
          shortcut={{ modifiers: ["cmd"], key: "l" }}
        />
      </ActionPanel.Section>
      <ActionPanel.Section title="Copy">
        {note.encrypted ? null : (
          <Action.CopyToClipboard
            title="Copy Markdown"
            content={formatBearAttachments(note.text)}
            icon={Icon.Clipboard}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
          />
        )}
        {note.encrypted ? null : (
          <Action.CopyToClipboard
            title="Copy HTML"
            content={renderMarkdown(note.text)}
            icon={Icon.Terminal}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
        )}
        <Action.CopyToClipboard
          title="Copy Link to Note"
          content={`bear://x-callback-url/open-note?id=${note.id}`}
          icon={Icon.Link}
          shortcut={{ modifiers: ["cmd", "opt"], key: "c" }}
        />
        {note.encrypted ? null : (
          <Action.CopyToClipboard
            title="Copy Unique Identifier"
            content={note.id}
            icon={Icon.QuestionMark}
            shortcut={{ modifiers: ["cmd", "opt", "shift"], key: "c" }}
          />
        )}
      </ActionPanel.Section>
      <ActionPanel.Section title="Create">
        {/* <Action.Push
          title="New Note"
          icon={Icon.Document}
          shortcut={{ modifiers: ["cmd"], key: "n" }}
          target={<NewNote />}
        /> */}
        <Action.Push
          title="New Web Capture"
          icon={Icon.Globe}
          shortcut={{ modifiers: ["cmd", "shift"], key: "n" }}
          target={<GrabUrl />}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}
