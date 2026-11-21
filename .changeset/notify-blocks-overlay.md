---
'@sanring/cli': minor
---

Notification blocks for sanring-notify:

- `block/announcement-banner` is now small cards floating in a corner (`position: fixed`, default bottom-left, new `position` input), so it never changes the app's layout. `dismissible` now defaults to `true`. New `linkClicked` output (`{ item, event }`): call `event.preventDefault()` and navigate with the router to avoid a full page reload for in-app links.
- `block/notification-bell` shows a toast ("你有 N 則新通知" with a "查看" button that opens the panel) when `unreadCount` goes up between polls, using the app's `ToastService` if it provides one. `unreadCount` now accepts `null` (the default) for "not loaded yet"; pass `null` rather than `0` until the first poll returns, or the first count shows a toast. Turn it off with `[toastOnNew]="false"`. New labels `newNotifications` and `view`; the block now depends on `toast`.
