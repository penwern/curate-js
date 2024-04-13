import WorkerManager from '../WorkerManager.js';
import CurateApi from './CurateApi.js';
import CurateWorkspaces from './CurateWorkspaces.js';
import CurateUi from './CurateUi.js';
import CurateMetadata from './CurateMetadata.js';
const Curate = (function() {
    const api = CurateApi;
    const workspaces = CurateWorkspaces;
    const ui = CurateUi;
    const metadata = CurateMetadata;
    return {
        api,
        workspaces,
        ui,
        metadata
    };
})();
// Export Curate so it's accessible globally
window.Curate = Curate;