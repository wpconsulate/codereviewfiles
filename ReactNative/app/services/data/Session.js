export var Session={};
Session.user = {};
Session.pendingRx={};
Session.processedRx={};
Session.db={
    outbox:  undefined,
    outboxDraft: undefined,
    pending: undefined,
    processed: undefined,
    rxStatus: undefined,
    notify:  undefined,
};