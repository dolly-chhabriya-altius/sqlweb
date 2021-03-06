import * as JsStore from 'jsstore';
import * as SqlWeb from "sqlweb";
const getWorkerPath = () => {
    if (process.env.NODE_ENV === 'development') {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js");
    }
    else {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");
    }
};

JsStore.useSqlWeb(SqlWeb);

// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
const workerPath = getWorkerPath();
const worker = new Worker(workerPath);
export const idbCon = new JsStore.Instance(worker);