import CurateApi from './CurateApi.js';
import CurateWorkspaces from './CurateWorkspaces.js';
import CurateUi from './CurateUi.js';
import CurateMetadata from './CurateMetadata.js';
import CurateWorkerManager from '../WorkerManager.js';
const Curate = (function() {
    const api = CurateApi;
    const workspaces = CurateWorkspaces;
    const ui = CurateUi;
    const metadata = CurateMetadata;
    const workermanager = CurateWorkerManager
    return {
        api,
        workspaces,
        ui,
        metadata,
        workermanager
    };
})();
// Export Curate so it's accessible globally
window.Curate = Curate;