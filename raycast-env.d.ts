/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Opening Notes - Opens the note in edit mode, placing the cursor at the end of the note */
  "focusCursorAtEnd": boolean,
  /**  - Opens the note in New window mode or same window */
  "openBearBehavior": boolean,
  /** Notes List - Shows a preview of the note to the right of the note list */
  "showPreviewInListView": boolean,
  /**  - Shows a metadata in List & Preview */
  "showMetadataInListView": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
  /** Preferences accessible in the `new-note` command */
  export type NewNote = ExtensionPreferences & {
  /** Opening Notes - Choose default opening mode when creating a new note */
  "newNoteOpenMode": "no" | "main" | "new",
  /**  - When creating a new note, prepend time and date */
  "prependTimeAndDate": boolean,
  /**  - When creating a new note, prepend time and date */
  "pinNote": boolean
}
  /** Preferences accessible in the `grab-url` command */
  export type GrabUrl = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {
  /** Search Query */
  "searchQuery": string
}
  /** Arguments passed to the `new-note` command */
  export type NewNote = {}
  /** Arguments passed to the `grab-url` command */
  export type GrabUrl = {}
}
