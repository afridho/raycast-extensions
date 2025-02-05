/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Opening Notes - Opens the note in edit mode, placing the cursor at the end of the note */
  "focusCursorAtEnd": boolean,
  /** undefined - Opens the note in New window mode or same window */
  "openBearBehavior": boolean,
  /** Default Priority - Open the note in preview mode or open bear to edit mode */
  "openPriority": "view" | "edit",
  /** undefined - Shows a metadata in List & Preview */
  "showMetadataInListView": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {
  /** Search Query */
  "searchQuery": string
}
}

