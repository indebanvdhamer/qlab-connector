const {isUndefined} = require('lodash');

const commands = {

  // Gets the version of QLab
  version: () => ({address: '/version'}),

  // List workspaces
  workspaces: () => ({address: '/workspaces'}),

  // Receive updates from workspace
  receiveUpdates: args => ({
    address: `/workspace/${args.id}/updates`,
    args: [{type: 'i', value: 1}]
  }),

  cue: {

    // 'Plain' actions
    start: args => ({address: `/cue/${args.number}/start`}),
    stop: args => ({address: `/cue/${args.number}/stop`}),
    hardStop: args => ({address: `/cue/${args.number}/hardStop`}),
    pause: args => ({address: `/cue/${args.number}/pause`}),
    resume: args => ({address: `/cue/${args.number}/resume`}),
    togglePause: args => ({address: `/cue/${args.number}/togglePause`}),
    load: args => ({address: `/cue/${args.number}/load`}),
    preview: args => ({address: `/cue/${args.number}/preview`}),
    panic: args => ({address: `/cue/${args.number}/panic`}),
    uniqueID: args => ({address: `/cue/${args.number}/uniqueID`}),
    type: args => ({address: `/cue/${args.number}/type`}),
    defaultName: args => ({address: `/cue/${args.number}/defaultName`}),
    displayName: args => ({address: `/cue/${args.number}/displayName`}),
    listName: args => ({address: `/cue/${args.number}/listName`}),
    hasFileTargets: args => ({address: `/cue/${args.number}/hasFileTargets`}),
    hasCueTargets: args => ({address: `/cue/${args.number}/hasCueTargets`}),
    allowsEditingDuration: args => ({address: `/cue/${args.number}/allowsEditingDuration`}),
    isLoaded: args => ({address: `/cue/${args.number}/isLoaded`}),
    isRunning: args => ({address: `/cue/${args.number}/isRunning`}),
    isPaused: args => ({address: `/cue/${args.number}/isPaused`}),
    isBroken: args => ({address: `/cue/${args.number}/isBroken`}),
    preWaitElapsed: args => ({address: `/cue/${args.number}/preWaitElapsed`}),
    actionElapsed: args => ({address: `/cue/${args.number}/actionElapsed`}),
    postWaitElapsed: args => ({address: `/cue/${args.number}/postWaitElapsed`}),
    percentPreWaitElapsed: args => ({address: `/cue/${args.number}/percentPreWaitElapsed`}),
    percentActionElapsed: args => ({address: `/cue/${args.number}/percentActionElapsed`}),
    percentPostWaitElapsed: args => ({address: `/cue/${args.number}/percentPostWaitElapsed`}),
    children: args => ({address: `/cue/${args.number}/children`}),

    // Pre wait in minutes
    preWait: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/preWait`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/preWait`}),

    // Getters/setters for the given property. Pass the value in args to set the property.
    number: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/number`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/number`}),
    name: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/name`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/name`}),
    notes: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/notes`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/notes`}),
    cueTargetNumber: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/cueTargetNumber`,
      args: [{type: 's', value: args.value}]
    } : {address: `/cue/${args.number}/cueTargetNumber`}),
    cueTargetId: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/cueTargetId`,
      args: [{type: 's', value: args.value}]
    } : {address: `/cue/${args.number}/cueTargetId`}),
    duration: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/duration`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/duration`}),
    postWait: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/postWait`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/postWait`}),
    colorName: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/colorName`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/colorName`}),
    armed: args => (!isUndefined(args.value) ? {
      address: `/cue/${args.number}/armed`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/armed`}),

    // Getter/setter for the file target, if the cue has file targets. You can provide three kinds of paths:

    // Full paths, e.g. /a/full/path/to/some/file.wav
    // Paths beginning with a tilde, e.g. ~/a/path/to some/file.mov
    // Relative paths, e.g. this/is/a/relative/path.mid
    // Paths beginning with a tilde (~) will be expanded; the tilde signifies "relative to the user's home directory".

    // Relative paths will be interpreted according to the current working directory.
    // Use QLab's /workingDirectory method to set or get the current working directory.
    fileTarget: args => (args.fileTarget ? {
      address: `/cue/${args.number}/fileTarget`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/fileTarget`}),

    // Get/set the continue mode. Values can be:
    // 0 - NO CONTINUE
    // 1 - AUTO CONTINUE
    // 2 - AUTO FOLLOW
    continueMode: args => (args.continueMode ? {
      address: `/cue/${args.number}/continueMode`,
      args: [{type: 'i', value: args.value}]
    } : {address: `/cue/${args.number}/continueMode`}),

    //Load the cue at time in seconds as provided in args
    loadAt: args => ({
      address: `/cue/${args.number}/loadAt`,
      args: [{type: 'i', value: args.seconds}]
    }),

    // The value is interpreted as a boolean; 0 equals false, any other number equals true.
    autoLoad: args => ({
      address: `/cue/${args.number}/autoLoad`,
      args: [{type: 'i', value: args.value}]
    }),
    flagged: args => ({
      address: `/cue/${args.number}/flagged`,
      args: [{type: 'i', value: args.value}]
    }),
  }

};

module.exports = commands;
