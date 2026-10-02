/// <reference lib="webworker" />
// Inside a worker scope elk-worker installs `self.onmessage` and speaks the
// elk-api protocol used by createOrgLayoutEngine(). Do not swap this for
// elk.bundled.js — that build spawns its own nested worker and fails here.
import 'elkjs/lib/elk-worker.min.js';
