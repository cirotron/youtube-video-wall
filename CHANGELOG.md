# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-04-29

### Fixed
- **Audio lost after player recreation:** `swapVideos` used an arbitrary `setTimeout(800ms)` to restore audio, which was unreliable on slow connections. Replaced with an event-driven `pendingAudioIndex` flag that restores audio precisely when the new player fires its `onReady` callback.
- **Audio lost on panic reload:** When `reloadVideo` fell back to recreating a player from scratch (fallback path), the active player's audio was not restored. Now correctly sets `pendingAudioIndex` before recreation so `onReady` can restore it.
- **Baseline gap on iframes:** `<iframe>` elements are `inline` by default, which causes a ~4px invisible gap at the bottom of each video cell. Fixed with `display: block`.

### Changed
- `setAudioTo` now mutes only the **previously active player** instead of iterating over all players. Reduces unnecessary API calls from O(n) to O(1).
- `updateVisuals` merged into `setAudioTo` and rewritten to use `getElementById` directly instead of `querySelectorAll('.video-wrapper')`, avoiding a full DOM scan on every audio switch.
- `swapVideos` now uses ES6 destructuring assignment `[a, b] = [b, a]` instead of a temporary variable.
- Removed `console.log` calls from `swapVideos` and `reloadVideo`.

### Performance
- Grid columns/rows changed from `50% 50%` to `1fr 1fr` to avoid subpixel rounding gaps at FHD resolution.
- Added `contain: strict` to `.quadrant` elements — the browser can now skip layout and paint recalculation outside each quadrant when a video updates.
- Added `will-change: opacity` to `.reload-btn` and the patrol `.indicator` to promote them to their own GPU compositing layer before animations begin.
- Added `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeSpeed` to `body` for crisper UI text on high-density FHD displays.

## [1.0.0] - 2026-04-28

### Added
- Initial release: 13-video YouTube wall with a 2×2 grid layout (1 main quadrant + 3 sub-grids of 4).
- Start overlay with operator activation button.
- Per-video event overlay supporting:
  - `Ctrl+Click` to switch audio focus.
  - `Shift+Click` to swap a video to the main quadrant.
  - `Double-click` for fullscreen on a single cell.
- Per-video panic/reload button (↻) visible on hover.
- Patrol Mode: automatic audio rotation across all streams every 10 seconds.
- Active audio indicator: green border highlight on the currently unmuted cell.
- Hacker/monitoring aesthetic with CSS custom properties.

[Unreleased]: https://github.com/cirotron/youtube-video-wall/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/cirotron/youtube-video-wall/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cirotron/youtube-video-wall/releases/tag/v1.0.0
