# Contributing

Issues and pull requests are welcome.

## Developing locally

1. Clone the repository.
2. Start Claude Code with the mod loaded from your clone:

   ```bash
   claude --plugin-dir /path/to/samurai-night
   ```

   Edits reload when a turn ends. The engine writes editor types to
   `.claude-plugin/types/` (ignored by git), after which `tsc -p .` type-checks
   the mod.

3. Before opening a pull request, run:

   ```bash
   claude plugin validate .
   ```

## Guidelines

- Keep the backdrop static. No CSS or SVG animation and no blur, so the theme
  costs no CPU.
- Keep each scene's SVG under 131,072 characters. Scenes can't run scripts or
  embed images (`data:` URLs are refused).
- Every scene's sky must end on `#141415` (surface-1) so the bottom bar blends in.
- Only use artwork you can redistribute (public domain / CC0 preferred) and
  credit it in the README.
- `hooks/art.ts` is generated from the source SVGs; `hooks/make-colors.*` is a
  vendored helper from Claude Code. Don't hand-edit either.
- Add a line to `CHANGELOG.md` under **Unreleased** and bump `version` in
  `.claude-plugin/plugin.json` when releasing.
